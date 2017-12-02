//
//  PerformanceBezierClockwiseTests.m
//  PerformanceBezier
//
//  Created by Adam Wulf on 1/7/14.
//  Copyright (c) 2014 Milestone Made, LLC. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "PerformanceBezierAbstractTest.h"

@interface PerformanceBezierClockwiseTests : PerformanceBezierAbstractTest

@end

@implementation PerformanceBezierClockwiseTests

- (void)setUp
{
    [super setUp];
    // Put setup code here; it will be run once, before the first test case.
}

- (void)tearDown
{
    // Put teardown code here; it will be run once, after the last test case.
    [super tearDown];
}

- (void)testLinearCounterClockwise
{
    UIBezierPath* simplePath = [UIBezierPath bezierPath];
    [simplePath moveToPoint:CGPointMake(100, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 99)];
    
    XCTAssertTrue(![simplePath isClockwise], @"clockwise is correct");
}

- (void)testLinearClockwise
{
    UIBezierPath* simplePath = [UIBezierPath bezierPath];
    [simplePath moveToPoint:CGPointMake(100, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 101)];
    
    XCTAssertTrue(![simplePath isClockwise], @"clockwise is correct");
}

- (void)testLinearEmptyShape
{
    UIBezierPath* simplePath = [UIBezierPath bezierPath];
    [simplePath moveToPoint:CGPointMake(100, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 101)];
    [simplePath closePath];
    
    XCTAssertTrue([simplePath isClockwise], @"clockwise is correct");
}

- (void)testLinearEmptyShape2
{
    UIBezierPath* simplePath = [UIBezierPath bezierPath];
    [simplePath moveToPoint:CGPointMake(100, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 100)];
    [simplePath addLineToPoint:CGPointMake(200, 99)];
    [simplePath closePath];
    
    XCTAssertTrue(![simplePath isClockwise], @"clockwise is correct");
}

- (void)testSimpleClockwiseCurve
{
    UIBezierPath* simplePath = [UIBezierPath bezierPath];
    [simplePath moveToPoint:CGPointMake(100, 100)];
    [simplePath addCurveToPoint:CGPointMake(200, 100) controlPoint1:CGPointMake(100, 0) controlPoint2:CGPointMake(200, 0)];
    
    XCTAssertTrue([simplePath isClockwise], @"clockwise is correct");
}

- (void)testSimpleCounterClockwiseCurve
{
    UIBezierPath* simplePath = [UIBezierPath bezierPath];
    [simplePath moveToPoint:CGPointMake(100, 100)];
    [simplePath addCurveToPoint:CGPointMake(200, 100) controlPoint1:CGPointMake(100, 200) controlPoint2:CGPointMake(200, 200)];
    
    XCTAssertTrue(![simplePath isClockwise], @"clockwise is correct");
}

- (void)testSimplePath
{
    UIBezierPath* simplePath = [UIBezierPath bezierPathWithArcCenter:CGPointZero radius:10 startAngle:0 endAngle:M_PI clockwise:YES];
    
    XCTAssertTrue([simplePath isClockwise], @"clockwise is correct");
}

- (void)testSimplePath2
{
    UIBezierPath* simplePath = [UIBezierPath bezierPathWithArcCenter:CGPointZero radius:10 startAngle:0 endAngle:M_PI clockwise:NO];
    
    XCTAssertTrue(![simplePath isClockwise], @"clockwise is correct");
}

- (void)testComplexPath
{
    XCTAssertTrue([self.complexShape isClockwise], @"clockwise is correct");
}

- (void)testReversedComplexPath
{
    XCTAssertTrue(![[self.complexShape bezierPathByReversingPath] isClockwise], @"clockwise is correct");
}

- (void)testFirstAndLastPointRect {
    // This is an example of a functional test case.
    
    UIBezierPath* path1 = [UIBezierPath bezierPathWithRect:CGRectMake(10, 10, 20, 20)];
    XCTAssertEqual([path1 elementCount], 5, "element count is correct");
    XCTAssertEqual([path1 firstPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 firstPoint].y, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].y, (CGFloat) 10, "element count is correct");
}

- (void)testFirstAndLastPointLine {
    // This is an example of a functional test case.
    
    UIBezierPath* path1 = [UIBezierPath bezierPath];
    [path1 moveToPoint:CGPointMake(10, 10)];
    [path1 addLineToPoint:CGPointMake(30, 30)];
    XCTAssertEqual([path1 elementCount], 2, "element count is correct");
    XCTAssertEqual([path1 firstPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 firstPoint].y, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].x, (CGFloat) 30, "element count is correct");
    XCTAssertEqual([path1 lastPoint].y, (CGFloat) 30, "element count is correct");
}


- (void)testFirstAndLastPointCurve {
    // This is an example of a functional test case.
    
    UIBezierPath* path1 = [UIBezierPath bezierPath];
    [path1 moveToPoint:CGPointMake(10, 10)];
    [path1 addCurveToPoint:CGPointMake(30, 30) controlPoint1:CGPointMake(15, 15) controlPoint2:CGPointMake(25, 25)];
    XCTAssertEqual([path1 elementCount], 2, "element count is correct");
    XCTAssertEqual([path1 firstPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 firstPoint].y, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].x, (CGFloat) 30, "element count is correct");
    XCTAssertEqual([path1 lastPoint].y, (CGFloat) 30, "element count is correct");
}

- (void)testFirstAndLastPointQuadCurve {
    // This is an example of a functional test case.
    
    UIBezierPath* path1 = [UIBezierPath bezierPath];
    [path1 moveToPoint:CGPointMake(10, 10)];
    [path1 addQuadCurveToPoint:CGPointMake(30, 30) controlPoint:CGPointMake(20, 20)];
    XCTAssertEqual([path1 elementCount], 2, "element count is correct");
    XCTAssertEqual([path1 firstPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 firstPoint].y, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].x, (CGFloat) 30, "element count is correct");
    XCTAssertEqual([path1 lastPoint].y, (CGFloat) 30, "element count is correct");
}

- (void)testFirstAndLastPointMoveTo {
    // This is an example of a functional test case.
    
    UIBezierPath* path1 = [UIBezierPath bezierPath];
    [path1 moveToPoint:CGPointMake(10, 10)];
    XCTAssertEqual([path1 elementCount], 1, "element count is correct");
    XCTAssertEqual([path1 firstPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 firstPoint].y, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].y, (CGFloat) 10, "element count is correct");
}

- (void)testFirstAndLastPointMoveTo2 {
    // This is an example of a functional test case.
    
    UIBezierPath* path1 = [UIBezierPath bezierPathWithRect:CGRectMake(10, 10, 20, 20)];
    [path1 moveToPoint:CGPointMake(50, 50)];
    XCTAssertEqual([path1 elementCount], 6, "element count is correct");
    XCTAssertEqual([path1 firstPoint].x, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 firstPoint].y, (CGFloat) 10, "element count is correct");
    XCTAssertEqual([path1 lastPoint].x, (CGFloat) 50, "element count is correct");
    XCTAssertEqual([path1 lastPoint].y, (CGFloat) 50, "element count is correct");
}

@end
