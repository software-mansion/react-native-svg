#import <Foundation/Foundation.h>

#ifndef FontWeight_h
#define FontWeight_h

NS_ENUM(NSInteger, FontWeight) {
    FontWeightNormal,
    FontWeightBold,
    FontWeightBolder,
    FontWeightLighter,
    FontWeight100,
    FontWeight200,
    FontWeight300,
    FontWeight400,
    FontWeight500,
    FontWeight600,
    FontWeight700,
    FontWeight800,
    FontWeight900,
    FontWeightDEFAULT = FontWeightNormal,
};

static NSString* const FontWeightStrings[] = {@"Normal", @"Bold", @"Bolder", @"Lighter", @"100", @"200", @"300", @"400", @"500", @"600", @"700", @"800", @"900", nil};


NSString* FontWeightToString( enum FontWeight fw );

enum FontWeight FontWeightFromString( NSString* s );

#endif
