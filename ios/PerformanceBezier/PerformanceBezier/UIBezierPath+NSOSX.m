//
//  UIBezierPath+NSOSX.m
//  PaintingSample
//
//  Created by Adam Wulf on 10/5/12.
//
//

#import "UIBezierPath+NSOSX.h"
#import <objc/runtime.h>
#import "JRSwizzle.h"
#import "UIBezierPath+NSOSX_Private.h"
#import "UIBezierPath+Performance_Private.h"
#import "UIBezierPath+Performance.h"
#import "UIBezierPath+Uncached.h"
#import "UIBezierPath+Util.h"


static char ELEMENT_ARRAY;
static CGFloat idealFlatness = .01;

@implementation UIBezierPath (NSOSX)


#pragma mark - Properties

/**
 * this is a property on the category, as described in:
 * https://github.com/techpaa/iProperties
 *
 *
 * this array is for private PerformanceBezier use only
 *
 * Since iOS doesn't allow for index lookup of CGPath elements (only option is CGPathApply)
 * this array will cache the elements after they've been looked up once
 */
-(void) freeCurrentElementCacheArray{
    NSMutableArray* currentArray = objc_getAssociatedObject(self, &ELEMENT_ARRAY);
    if([currentArray count]){
        while([currentArray count]){
            NSValue* val = [currentArray lastObject];
            CGPathElement* element = [val pointerValue];
            free(element->points);
            free(element);
            [currentArray removeLastObject];
        }
    }
    objc_setAssociatedObject(self, &ELEMENT_ARRAY, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
-(void)setElementCacheArray:(NSMutableArray *)_elementCacheArray{
    [self freeCurrentElementCacheArray];
    NSMutableArray* newArray = [NSMutableArray array];
    for(NSValue* val in _elementCacheArray){
        CGPathElement* element = [val pointerValue];
        CGPathElement* copiedElement = [UIBezierPath copyCGPathElement:element];
        [newArray addObject:[NSValue valueWithPointer:copiedElement]];
    }
    objc_setAssociatedObject(self, &ELEMENT_ARRAY, newArray, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
-(NSMutableArray*)elementCacheArray{
    NSMutableArray* ret = objc_getAssociatedObject(self, &ELEMENT_ARRAY);
    if(!ret){
        ret = [NSMutableArray array];
        self.elementCacheArray = ret;
    }
    return ret;
}



#pragma mark - UIBezierPath

/**
 * returns the CGPathElement at the specified index, optionally
 * also returning the elements points in the 2nd parameter
 *
 * this method is meant to mimic UIBezierPath's method of the same name
 */
- (CGPathElement)elementAtIndex:(NSInteger)askingForIndex associatedPoints:(CGPoint[])points{
    __block BOOL didReturn = NO;
    __block CGPathElement returnVal;
    if(askingForIndex < [self.elementCacheArray count]){
        returnVal = *(CGPathElement*)[[self.elementCacheArray objectAtIndex:askingForIndex] pointerValue];
#ifdef MMPreventBezierPerformance
        [self simulateNoBezierCaching];
#endif
    }else{
        __block UIBezierPath* this = self;
        [self iteratePathWithBlock:^(CGPathElement element, NSUInteger currentIndex){
            int numberInCache = (int) [this.elementCacheArray count];
            if(!didReturn || currentIndex == [this.elementCacheArray count]){
                if(currentIndex == numberInCache){
                    [this.elementCacheArray addObject:[NSValue valueWithPointer:[UIBezierPath copyCGPathElement:&element]]];
                }
                if(currentIndex == askingForIndex){
                    returnVal = *(CGPathElement*)[[this.elementCacheArray objectAtIndex:askingForIndex] pointerValue];
                    didReturn = YES;
                }
            }
        }];
    }
    
    if(points){
        for(int i=0;i<[UIBezierPath numberOfPointsForElement:returnVal];i++){
            points[i] = returnVal.points[i];
        }
    }
    return returnVal;
}


/**
 * returns the CGPathElement at the specified index
 *
 * this method is meant to mimic UIBezierPath's method of the same name
 */
- (CGPathElement)elementAtIndex:(NSInteger)index{
    return [self elementAtIndex:index associatedPoints:NULL];
}


/**
 * updates the point in the path with the new input points
 *
 * TODO: this method is entirely untested
 */
- (void)setAssociatedPoints:(CGPoint[])points atIndex:(NSInteger)index{
    NSMutableDictionary* params = [NSMutableDictionary dictionary];
    [params setObject:[NSNumber numberWithInteger:index] forKey:@"index"];
    [params setObject:[NSValue valueWithPointer:points]  forKey:@"points"];
    CGPathApply(self.CGPath, params, updatePathElementAtIndex);
    
}
//
// helper function for the setAssociatedPoints: method
void updatePathElementAtIndex(void* info, const CGPathElement* element) {
    NSMutableDictionary* params = (NSMutableDictionary*)info;
    int currentIndex = 0;
    if([params objectForKey:@"curr"]){
        currentIndex = [[params objectForKey:@"curr"] intValue] + 1;
    }
    if(currentIndex == [[params objectForKey:@"index"] intValue]){
        CGPoint* points = [[params objectForKey:@"points"] pointerValue];
        for(int i=0;i<[UIBezierPath numberOfPointsForElement:*element];i++){
            element->points[i] = points[i];
        }
        CGPathElement* returnVal = [UIBezierPath copyCGPathElement:(CGPathElement*)element];
        [params setObject:[NSValue valueWithPointer:returnVal] forKey:@"element"];
    }
    [params setObject:[NSNumber numberWithInt:currentIndex] forKey:@"curr"];
}

/**
 * Returns the bounding box containing all points in a graphics path.
 * The bounding box is the smallest rectangle completely enclosing
 * all points in the path, including control points for Bézier and
 * quadratic curves.
 *
 * this method is meant to mimic UIBezierPath's method of the same name
 */
-(CGRect) controlPointBounds{
    return CGPathGetBoundingBox(self.CGPath);
}


- (NSInteger)elementCount{
    UIBezierPathProperties* props = [self pathProperties];
    if(props.cachedElementCount){
#ifdef MMPreventBezierPerformance
        [self simulateNoBezierCaching];
#endif
        return props.cachedElementCount;
    }
    NSMutableDictionary* params = [NSMutableDictionary dictionary];
    [params setObject:[NSNumber numberWithInteger:0] forKey:@"count"];
    [params setObject:self forKey:@"self"];
    [self retain];
    CGPathApply(self.CGPath, params, countPathElement);
    [self release];
    NSInteger ret = [[params objectForKey:@"count"] integerValue];
    props.cachedElementCount = ret;
    return ret;
}
// helper function
void countPathElement(void* info, const CGPathElement* element) {
    NSMutableDictionary* params = (NSMutableDictionary*) info;
    UIBezierPath* this = [params objectForKey:@"self"];
    NSInteger count = [[params objectForKey:@"count"] integerValue];
    [params setObject:[NSNumber numberWithInteger:(count + 1)] forKey:@"count"];
    if(count == [this.elementCacheArray count]){
        [this.elementCacheArray addObject:[NSValue valueWithPointer:[UIBezierPath copyCGPathElement:(CGPathElement*)element]]];
    }
}

-(void) iteratePathWithBlock:(void (^)(CGPathElement element,NSUInteger idx))block{
    void (^copiedBlock)(CGPathElement element) = [block copy];
    NSMutableDictionary* params = [NSMutableDictionary dictionary];
    [params setObject:copiedBlock forKey:@"block"];
    CGPathApply(self.CGPath, params, blockWithElement);
    [copiedBlock release];
}

// helper function
static void blockWithElement(void* info, const CGPathElement* element) {
    NSMutableDictionary* params = (NSMutableDictionary*) info;
    void (^block)(CGPathElement element,NSUInteger idx) = [params objectForKey:@"block"];
    NSUInteger index = [[params objectForKey:@"index"] unsignedIntegerValue];
    block(*element, index);
    [params setObject:@(index+1) forKey:@"index"];
}

#pragma mark - Flat



#pragma mark - Properties


/**
 * this is a property on the category, as described in:
 * https://github.com/techpaa/iProperties
 */
-(void)setIsFlat:(BOOL)isFlat{
    [self pathProperties].isFlat = isFlat;
}

/**
 * return YES if this bezier path is made up of only
 * moveTo, closePath, and lineTo elements
 *
 * TODO
 * this method helps caching flattened paths internally
 * to this category, but is not yet fit for public use.
 *
 * detecting when this path is flat would mean we'd have
 * to also swizzle the constructors to bezier paths
 */
-(BOOL) isFlat{
    return [self pathProperties].isFlat;
}

#pragma mark - UIBezierPath


/**
 * call this method on a UIBezierPath to generate
 * a new flattened path
 *
 * This category is named after Athar Luqman Ahmad, who
 * wrote a masters thesis about minimizing the number of
 * lines required to flatten a bezier curve
 *
 * The thesis is available here:
 * http://www.cis.usouthal.edu/~hain/general/Theses/Ahmad_thesis.pdf
 *
 * The algorithm that I use as of 10/09/2012 is a simple
 * recursive algorithm that doesn't use any of ahmed's
 * optimizations yet
 *
 * TODO: add in Ahmed's optimizations
 */
-(UIBezierPath*) bezierPathByFlatteningPath{
    return [self bezierPathByFlatteningPathAndImmutable:NO];
}
/**
 * @param shouldBeImmutable: YES if this function should return a distinct UIBezier, NO otherwise
 *
 * if the caller plans to modify the returned path, then shouldBeImmutable should
 * be called with NO.
 *
 * if the caller only plans to iterate over and look at the returned value,
 * then shouldBeImmutable should be YES - this is considerably faster to not
 * return a copy if the value will be treated as immutable
 */
-(UIBezierPath*) bezierPathByFlatteningPathAndImmutable:(BOOL)willBeImmutable{
    UIBezierPathProperties* props = [self pathProperties];
    UIBezierPath* ret = props.bezierPathByFlatteningPath;
    if(ret){
        if(willBeImmutable) return ret;
        return [[ret copy] autorelease];
    }
    if(self.isFlat){
        if(willBeImmutable) return self;
        return [[self copy] autorelease];
    }
    
    __block NSInteger flattenedElementCount = 0;
    UIBezierPath *newPath = [UIBezierPath bezierPath];
    NSInteger	       elements = [self elementCount];
    NSInteger	       n;
    CGPoint    pointForClose = CGPointMake (0.0, 0.0);
    CGPoint    lastPoint = CGPointMake (0.0, 0.0);
    
    for (n = 0; n < elements; ++n)
    {
        CGPoint		points[3];
        CGPathElement element = [self elementAtIndex:n associatedPoints:points];
        
        switch (element.type)
        {
            case kCGPathElementMoveToPoint:
                [newPath moveToPoint:points[0]];
                pointForClose = lastPoint = points[0];
                flattenedElementCount++;
                continue;
                
            case kCGPathElementAddLineToPoint:
                [newPath addLineToPoint:points[0]];
                lastPoint = points[0];
                flattenedElementCount++;
                break;
                
            case kCGPathElementAddQuadCurveToPoint:
            case kCGPathElementAddCurveToPoint:
            {
                
                //
                // handle both curve types gracefully
                CGPoint curveTo;
                CGPoint ctrl1;
                CGPoint ctrl2;
                if(element.type == kCGPathElementAddQuadCurveToPoint){
                    curveTo = element.points[1];
                    ctrl1 = element.points[0];
                    ctrl2 = ctrl1;
                }else if(element.type == kCGPathElementAddCurveToPoint){
                    curveTo = element.points[2];
                    ctrl1 = element.points[0];
                    ctrl2 = element.points[1];
                }
                
                //
                // ok, this is the bezier for our current element
                CGPoint bezier[4] = { lastPoint, ctrl1, ctrl2, curveTo };
                
                
                //
                // define our recursive function that will
                // help us split the curve up as needed
                void (^__block flattenCurve)(UIBezierPath* newPath, CGPoint startPoint, CGPoint bez[4]) = ^(UIBezierPath* newPath, CGPoint startPoint, CGPoint bez[4]){
                    //
                    // first, calculate the error rate for
                    // a line segement between the start/end points
                    // vs the curve
                    
                    CGPoint onCurve = bezierPointAtT(bez, .5);
                    
                    CGFloat error = distanceOfPointToLine(onCurve, startPoint, bez[2]);
                    
                    
                    //
                    // if that error is less than our accepted
                    // level of error, then just add a line,
                    //
                    // otherwise, split the curve in half and recur
                    if (error <= idealFlatness)
                    {
                        [newPath addLineToPoint:bez[3]];
                        flattenedElementCount++;
                    }
                    else
                    {
                        CGPoint bez1[4], bez2[4];
                        subdivideBezierAtT(bez, bez1, bez2, .5);
                        // now we've split the curve in half, and have
                        // two bezier curves bez1 and bez2. recur
                        // on these two halves
                        flattenCurve(newPath, startPoint, bez1);
                        flattenCurve(newPath, startPoint, bez2);
                    }
                };
                
                flattenCurve(newPath, lastPoint, bezier);
                
                lastPoint = points[2];
                break;
            }
                
            case kCGPathElementCloseSubpath:
                [newPath closePath];
                lastPoint = pointForClose;
                flattenedElementCount++;
                break;
                
            default:
                break;
        }
    }
    
    // since we just built the flattened path
    // we know how many elements there are, so cache that
    UIBezierPathProperties* newPathProps = [newPath pathProperties];
    newPathProps.cachedElementCount = flattenedElementCount;
    
    props.bezierPathByFlatteningPath = newPath;
    
    return [self bezierPathByFlatteningPathAndImmutable:willBeImmutable];
}


#pragma mark - Helper

/**
 * returns the length of the points array for the input
 * CGPathElement element
 */
+(NSInteger) numberOfPointsForElement:(CGPathElement)element{
    NSInteger nPoints = 0;
    switch (element.type)
    {
        case kCGPathElementMoveToPoint:
            nPoints = 1;
            break;
        case kCGPathElementAddLineToPoint:
            nPoints = 1;
            break;
        case kCGPathElementAddQuadCurveToPoint:
            nPoints = 2;
            break;
        case kCGPathElementAddCurveToPoint:
            nPoints = 3;
            break;
        case kCGPathElementCloseSubpath:
            nPoints = 0;
            break;
        default:
            nPoints = 0;
    }
    return nPoints;
}


/**
 * copies the input CGPathElement
 *
 * TODO: I currently never free the memory assigned for the points array
 * https://github.com/adamwulf/DrawKit-iOS/issues/4
 */
+(CGPathElement*) copyCGPathElement:(CGPathElement*)element{
    CGPathElement* ret = malloc(sizeof(CGPathElement));
    if(!ret){
        @throw [NSException exceptionWithName:@"Memory Exception" reason:@"can't malloc" userInfo:nil];
    }
    NSInteger numberOfPoints = [UIBezierPath numberOfPointsForElement:*element];
    if(numberOfPoints){
        ret->points = malloc(sizeof(CGPoint) * numberOfPoints);
    }else{
        ret->points = NULL;
    }
    ret->type = element->type;
    
    for(int i=0;i<numberOfPoints;i++){
        ret->points[i] = element->points[i];
    }
    return ret;
}




#pragma mark - Swizzling

///////////////////////////////////////////////////////////////////////////
//
// All of these methods are to listen to UIBezierPath method calls
// so that we can add new functionality on top of them without
// changing any of the default behavior.
//
// These methods help maintain:
// 1. cachedElementCount
// 2. elementCacheArray
// 3. keeping cache's valid across copying


-(void) nsosx_swizzle_removeAllPoints{
    [self setElementCacheArray:nil];
    [self nsosx_swizzle_removeAllPoints];
}

-(UIBezierPath*) nsosx_swizzle_copy{
    UIBezierPath* ret = [self nsosx_swizzle_copy];
    // note, when setting the array here, it will actually be making
    // a mutable copy of the input array, so the copied
    // path will have its own version.
    [ret setElementCacheArray:self.elementCacheArray];
    return ret;
}
-(void) nsosx_swizzle_applyTransform:(CGAffineTransform)transform{
    [self setElementCacheArray:nil];
    [self pathProperties].hasLastPoint = NO;
    [self pathProperties].hasFirstPoint = NO;
    [self nsosx_swizzle_applyTransform:transform];
}



-(void) nsosx_swizzle_dealloc{
    [self freeCurrentElementCacheArray];
    [self nsosx_swizzle_dealloc];
}

+(void)load{
    @autoreleasepool {
        NSError *error = nil;
        [UIBezierPath jr_swizzleMethod:@selector(removeAllPoints)
                            withMethod:@selector(nsosx_swizzle_removeAllPoints)
                                 error:&error];
        [UIBezierPath jr_swizzleMethod:@selector(applyTransform:)
                            withMethod:@selector(nsosx_swizzle_applyTransform:)
                                 error:&error];
        [UIBezierPath jr_swizzleMethod:@selector(copy)
                            withMethod:@selector(nsosx_swizzle_copy)
                                 error:&error];
        [UIBezierPath jr_swizzleMethod:@selector(dealloc)
                            withMethod:@selector(nsosx_swizzle_dealloc)
                                 error:&error];
    }
}



@end
