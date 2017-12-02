//
//  PerformanceBezierAbstractTest.m
//  PerformanceBezier
//
//  Created by Adam Wulf on 11/20/13.
//  Copyright (c) 2013 Milestone Made, LLC. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "PerformanceBezierAbstractTest.h"

#define kIntersectionPointPrecision .1

@implementation PerformanceBezierAbstractTest{
    UIBezierPath* complexShape;
}

@synthesize complexShape;

-(void) setUp{
    complexShape = [UIBezierPath bezierPath];
    [complexShape moveToPoint:CGPointMake(218.500000,376.000000)];
    [complexShape addCurveToPoint:CGPointMake(227.000000,362.000000) controlPoint1:CGPointMake(218.100235,369.321564) controlPoint2:CGPointMake(222.816589,365.945923)];
    //    [complexShape addCurveToPoint:CGPointMake(213.000000,372.000000) controlPoint1:CGPointMake(237.447144,352.833008) controlPoint2:CGPointMake(255.082840,326.966705)];
    [complexShape addCurveToPoint:CGPointMake(243.000000,316.000000) controlPoint1:CGPointMake(232.801880,363.107697) controlPoint2:CGPointMake(248.582321,338.033752)];
    [complexShape addCurveToPoint:CGPointMake(172.000000,218.000000) controlPoint1:CGPointMake(215.326599,286.866608) controlPoint2:CGPointMake(182.880371,258.374298)];
    [complexShape addCurveToPoint:CGPointMake(242.000000,111.000000) controlPoint1:CGPointMake(149.812820,168.222122) controlPoint2:CGPointMake(195.466583,119.790573)];
    [complexShape addCurveToPoint:CGPointMake(265.000000,109.000000) controlPoint1:CGPointMake(249.474472,108.948883) controlPoint2:CGPointMake(257.298248,108.285248)];
    [complexShape addCurveToPoint:CGPointMake(302.000000,116.000000) controlPoint1:CGPointMake(277.539948,110.401459) controlPoint2:CGPointMake(291.623962,104.844376)];
    [complexShape addCurveToPoint:CGPointMake(310.000000,148.000000) controlPoint1:CGPointMake(310.890778,124.607719) controlPoint2:CGPointMake(310.189972,136.988098)];
    [complexShape addCurveToPoint:CGPointMake(302.000000,184.000000) controlPoint1:CGPointMake(310.722900,160.600952) controlPoint2:CGPointMake(305.109131,172.145187)];
    [complexShape addCurveToPoint:CGPointMake(295.000000,221.000000) controlPoint1:CGPointMake(299.082794,196.217377) controlPoint2:CGPointMake(297.024170,208.612000)];
    [complexShape addCurveToPoint:CGPointMake(304.000000,294.000000) controlPoint1:CGPointMake(297.367493,244.586227) controlPoint2:CGPointMake(286.870880,273.642609)];
    [complexShape addCurveToPoint:CGPointMake(343.000000,305.000000) controlPoint1:CGPointMake(315.167755,304.101868) controlPoint2:CGPointMake(329.526489,302.807587)];
    [complexShape addCurveToPoint:CGPointMake(395.000000,297.000000) controlPoint1:CGPointMake(361.147430,306.169556) controlPoint2:CGPointMake(378.948700,305.707855)];
    [complexShape addCurveToPoint:CGPointMake(413.000000,285.000000) controlPoint1:CGPointMake(401.931854,294.629944) controlPoint2:CGPointMake(408.147980,290.431854)];
    [complexShape addCurveToPoint:CGPointMake(435.000000,255.000000) controlPoint1:CGPointMake(423.555023,278.199219) controlPoint2:CGPointMake(433.437531,268.110229)];
    [complexShape addCurveToPoint:CGPointMake(424.000000,228.000000) controlPoint1:CGPointMake(436.063995,245.070923) controlPoint2:CGPointMake(432.549713,233.803619)];
    [complexShape addCurveToPoint:CGPointMake(402.000000,209.000000) controlPoint1:CGPointMake(416.571869,221.776123) controlPoint2:CGPointMake(409.428101,215.223877)];
    [complexShape addCurveToPoint:CGPointMake(385.000000,183.000000) controlPoint1:CGPointMake(392.239838,203.283615) controlPoint2:CGPointMake(390.379822,191.873459)];
    [complexShape addCurveToPoint:CGPointMake(385.000000,128.000000) controlPoint1:CGPointMake(378.582947,166.163315) controlPoint2:CGPointMake(374.234924,143.960587)];
    [complexShape addCurveToPoint:CGPointMake(472.000000,105.000000) controlPoint1:CGPointMake(405.864136,103.071175) controlPoint2:CGPointMake(442.110016,95.355499)];
    [complexShape addLineToPoint:CGPointMake(472.000000,105.000000)];
    [complexShape addLineToPoint:CGPointMake(488.000000,177.000000)];
    [complexShape addCurveToPoint:CGPointMake(534.000000,177.000000) controlPoint1:CGPointMake(498.942047,187.308975) controlPoint2:CGPointMake(522.349426,190.655228)];
    [complexShape addLineToPoint:CGPointMake(534.000000,177.000000)];
    [complexShape addLineToPoint:CGPointMake(611.000000,77.000000)];
    [complexShape addCurveToPoint:CGPointMake(700.000000,111.000000) controlPoint1:CGPointMake(643.743652,54.625603) controlPoint2:CGPointMake(684.106140,80.752876)];
    [complexShape addCurveToPoint:CGPointMake(704.000000,126.000000) controlPoint1:CGPointMake(703.098755,115.324257) controlPoint2:CGPointMake(704.460693,120.742104)];
    [complexShape addCurveToPoint:CGPointMake(700.000000,156.000000) controlPoint1:CGPointMake(703.210999,136.088333) controlPoint2:CGPointMake(706.451782,146.830612)];
    [complexShape addCurveToPoint:CGPointMake(681.000000,196.000000) controlPoint1:CGPointMake(695.262329,170.166794) controlPoint2:CGPointMake(684.152832,181.086166)];
    [complexShape addCurveToPoint:CGPointMake(655.000000,246.000000) controlPoint1:CGPointMake(672.227966,212.611191) controlPoint2:CGPointMake(663.084045,229.033600)];
    [complexShape addCurveToPoint:CGPointMake(636.000000,300.000000) controlPoint1:CGPointMake(649.778381,264.429260) controlPoint2:CGPointMake(639.110535,280.894592)];
    [complexShape addCurveToPoint:CGPointMake(637.000000,374.000000) controlPoint1:CGPointMake(633.264893,324.262054) controlPoint2:CGPointMake(629.540955,350.094421)];
    [complexShape addCurveToPoint:CGPointMake(692.000000,512.000000) controlPoint1:CGPointMake(666.332947,413.789734) controlPoint2:CGPointMake(699.608032,459.043060)];
    [complexShape addCurveToPoint:CGPointMake(683.000000,536.000000) controlPoint1:CGPointMake(688.852905,519.944031) controlPoint2:CGPointMake(685.852539,527.945801)];
    [complexShape addCurveToPoint:CGPointMake(661.000000,571.000000) controlPoint1:CGPointMake(677.198853,548.592712) controlPoint2:CGPointMake(668.260010,559.289062)];
    [complexShape addCurveToPoint:CGPointMake(610.000000,619.000000) controlPoint1:CGPointMake(648.250000,590.532715) controlPoint2:CGPointMake(631.222351,608.483521)];
    [complexShape addCurveToPoint:CGPointMake(585.000000,625.000000) controlPoint1:CGPointMake(602.312439,623.111694) controlPoint2:CGPointMake(593.647827,625.135620)];
    [complexShape addCurveToPoint:CGPointMake(542.000000,612.000000) controlPoint1:CGPointMake(569.838867,626.477356) controlPoint2:CGPointMake(551.172668,629.067810)];
    [complexShape addCurveToPoint:CGPointMake(530.000000,557.000000) controlPoint1:CGPointMake(525.270691,596.196289) controlPoint2:CGPointMake(531.172729,575.895203)];
    [complexShape addCurveToPoint:CGPointMake(539.000000,514.000000) controlPoint1:CGPointMake(528.119263,541.759460) controlPoint2:CGPointMake(537.465271,528.714905)];
    [complexShape addCurveToPoint:CGPointMake(557.000000,458.000000) controlPoint1:CGPointMake(546.810364,495.904419) controlPoint2:CGPointMake(549.387146,476.172821)];
    [complexShape addCurveToPoint:CGPointMake(577.000000,334.000000) controlPoint1:CGPointMake(570.620544,419.011993) controlPoint2:CGPointMake(584.251587,375.770599)];
    [complexShape addCurveToPoint:CGPointMake(552.000000,307.000000) controlPoint1:CGPointMake(572.811646,321.661407) controlPoint2:CGPointMake(563.442261,312.060883)];
    [complexShape addCurveToPoint:CGPointMake(505.000000,304.000000) controlPoint1:CGPointMake(537.517578,299.902161) controlPoint2:CGPointMake(520.555420,301.162994)];
    [complexShape addCurveToPoint:CGPointMake(417.000000,395.000000) controlPoint1:CGPointMake(471.423096,326.244507) controlPoint2:CGPointMake(426.598511,351.118713)];
    [complexShape addCurveToPoint:CGPointMake(412.000000,423.000000) controlPoint1:CGPointMake(413.398468,403.873810) controlPoint2:CGPointMake(411.718628,413.460388)];
    [complexShape addCurveToPoint:CGPointMake(418.000000,460.000000) controlPoint1:CGPointMake(412.695190,435.349243) controlPoint2:CGPointMake(409.621643,449.299377)];
    [complexShape addCurveToPoint:CGPointMake(445.000000,488.000000) controlPoint1:CGPointMake(425.380219,470.784973) controlPoint2:CGPointMake(435.315186,479.392761)];
    [complexShape addCurveToPoint:CGPointMake(469.000000,514.000000) controlPoint1:CGPointMake(453.446838,496.144928) controlPoint2:CGPointMake(463.737061,503.078857)];
    [complexShape addCurveToPoint:CGPointMake(476.000000,562.000000) controlPoint1:CGPointMake(477.951324,528.615112) controlPoint2:CGPointMake(475.631348,545.762817)];
    [complexShape addLineToPoint:CGPointMake(476.000000,562.000000)];
    [complexShape addLineToPoint:CGPointMake(384.000000,717.000000)];
    [complexShape addCurveToPoint:CGPointMake(382.000000,740.000000) controlPoint1:CGPointMake(381.948761,724.474304) controlPoint2:CGPointMake(381.285309,732.298340)];
    [complexShape addCurveToPoint:CGPointMake(394.000000,768.000000) controlPoint1:CGPointMake(373.999329,755.779053) controlPoint2:CGPointMake(424.795959,792.055847)];
    [complexShape addCurveToPoint:CGPointMake(466.000000,790.000000) controlPoint1:CGPointMake(413.033173,794.757141) controlPoint2:CGPointMake(440.293671,789.339783)];
    [complexShape addCurveToPoint:CGPointMake(509.000000,769.000000) controlPoint1:CGPointMake(479.958252,782.095642) controlPoint2:CGPointMake(496.425812,779.557007)];
    [complexShape addCurveToPoint:CGPointMake(570.000000,717.000000) controlPoint1:CGPointMake(536.317139,759.409058) controlPoint2:CGPointMake(549.962769,734.921936)];
    [complexShape addCurveToPoint:CGPointMake(632.000000,663.000000) controlPoint1:CGPointMake(586.772034,695.344360) controlPoint2:CGPointMake(605.504700,673.223633)];
    [complexShape addCurveToPoint:CGPointMake(679.000000,654.000000) controlPoint1:CGPointMake(645.724731,654.867432) controlPoint2:CGPointMake(663.048096,650.318481)];
    [complexShape addCurveToPoint:CGPointMake(696.000000,730.000000) controlPoint1:CGPointMake(702.263611,671.121704) controlPoint2:CGPointMake(698.817200,704.461426)];
    [complexShape addCurveToPoint:CGPointMake(685.000000,758.000000) controlPoint1:CGPointMake(693.381836,739.709473) controlPoint2:CGPointMake(689.682678,749.111511)];
    [complexShape addCurveToPoint:CGPointMake(639.000000,805.000000) controlPoint1:CGPointMake(674.516968,777.568542) controlPoint2:CGPointMake(664.349304,799.584106)];
    [complexShape addCurveToPoint:CGPointMake(605.000000,809.000000) controlPoint1:CGPointMake(627.873596,807.853577) controlPoint2:CGPointMake(616.339233,807.757568)];
    [complexShape addCurveToPoint:CGPointMake(559.000000,810.000000) controlPoint1:CGPointMake(589.680847,809.707275) controlPoint2:CGPointMake(574.264648,807.876892)];
    [complexShape addCurveToPoint:CGPointMake(491.000000,832.000000) controlPoint1:CGPointMake(535.253113,811.682922) controlPoint2:CGPointMake(510.867584,818.326538)];
    [complexShape addCurveToPoint:CGPointMake(483.000000,949.000000) controlPoint1:CGPointMake(452.488922,868.759766) controlPoint2:CGPointMake(506.715942,910.094971)];
    [complexShape addCurveToPoint:CGPointMake(438.000000,971.000000) controlPoint1:CGPointMake(471.816193,962.527100) controlPoint2:CGPointMake(455.094940,970.199341)];
    [complexShape addCurveToPoint:CGPointMake(381.000000,969.000000) controlPoint1:CGPointMake(419.703827,973.256775) controlPoint2:CGPointMake(398.264557,978.824951)];
    [complexShape addCurveToPoint:CGPointMake(332.000000,894.000000) controlPoint1:CGPointMake(336.834229,961.446167) controlPoint2:CGPointMake(348.029205,921.138672)];
    [complexShape addCurveToPoint:CGPointMake(201.000000,838.000000) controlPoint1:CGPointMake(307.704529,850.152588) controlPoint2:CGPointMake(249.883804,820.437744)];
    [complexShape addCurveToPoint:CGPointMake(167.000000,881.000000) controlPoint1:CGPointMake(182.977020,844.574768) controlPoint2:CGPointMake(166.990494,861.006348)];
    [complexShape addCurveToPoint:CGPointMake(175.000000,930.000000) controlPoint1:CGPointMake(165.412155,897.691711) controlPoint2:CGPointMake(168.718536,914.566101)];
    [complexShape addCurveToPoint:CGPointMake(169.000000,974.000000) controlPoint1:CGPointMake(175.880753,944.083801) controlPoint2:CGPointMake(184.246262,962.543579)];
    [complexShape addCurveToPoint:CGPointMake(112.000000,969.000000) controlPoint1:CGPointMake(153.879868,987.139404) controlPoint2:CGPointMake(121.948792,989.663391)];
    [complexShape addCurveToPoint:CGPointMake(99.000000,945.000000) controlPoint1:CGPointMake(105.050240,962.664062) controlPoint2:CGPointMake(100.558395,954.098572)];
    [complexShape addCurveToPoint:CGPointMake(97.000000,875.000000) controlPoint1:CGPointMake(95.831497,921.925537) controlPoint2:CGPointMake(94.644936,898.300354)];
    [complexShape addCurveToPoint:CGPointMake(132.000000,821.000000) controlPoint1:CGPointMake(107.640190,856.536194) controlPoint2:CGPointMake(116.238022,835.936340)];
    [complexShape addCurveToPoint:CGPointMake(184.000000,750.000000) controlPoint1:CGPointMake(155.798218,802.971130) controlPoint2:CGPointMake(173.768723,777.893677)];
    [complexShape addCurveToPoint:CGPointMake(187.000000,687.000000) controlPoint1:CGPointMake(185.273651,729.554688) controlPoint2:CGPointMake(197.039795,707.556824)];
    [complexShape addCurveToPoint:CGPointMake(154.000000,656.000000) controlPoint1:CGPointMake(180.328445,672.368408) controlPoint2:CGPointMake(164.994644,666.234436)];
    [complexShape addCurveToPoint:CGPointMake(196.000000,600.000000) controlPoint1:CGPointMake(149.363876,627.436218) controlPoint2:CGPointMake(180.133606,615.870422)];
    [complexShape addCurveToPoint:CGPointMake(268.000000,553.000000) controlPoint1:CGPointMake(219.965149,584.441223) controlPoint2:CGPointMake(243.722717,568.280640)];
    [complexShape addCurveToPoint:CGPointMake(295.000000,494.000000) controlPoint1:CGPointMake(285.621643,544.794250) controlPoint2:CGPointMake(308.387665,515.697510)];
    [complexShape addCurveToPoint:CGPointMake(223.000000,479.000000) controlPoint1:CGPointMake(274.950104,475.730682) controlPoint2:CGPointMake(247.686523,476.989319)];
    [complexShape addCurveToPoint:CGPointMake(115.000000,488.000000) controlPoint1:CGPointMake(190.196381,488.207886) controlPoint2:CGPointMake(149.008881,507.599640)];
    [complexShape addCurveToPoint:CGPointMake(92.000000,430.000000) controlPoint1:CGPointMake(91.723808,479.934326) controlPoint2:CGPointMake(81.161568,451.403015)];
    [complexShape addCurveToPoint:CGPointMake(185.000000,434.000000) controlPoint1:CGPointMake(119.158417,409.750031) controlPoint2:CGPointMake(157.642273,416.770874)];
    [complexShape addCurveToPoint:CGPointMake(298.000000,425.000000) controlPoint1:CGPointMake(219.467361,450.346191) controlPoint2:CGPointMake(268.697144,455.229706)];
    [complexShape addCurveToPoint:CGPointMake(339.000000,443.000000) controlPoint1:CGPointMake(312.625793,410.994751) controlPoint2:CGPointMake(331.307281,429.430817)];
    [complexShape addCurveToPoint:CGPointMake(349.000000,478.000000) controlPoint1:CGPointMake(344.453400,453.933380) controlPoint2:CGPointMake(347.832184,465.856812)];
    [complexShape addCurveToPoint:CGPointMake(344.000000,540.000000) controlPoint1:CGPointMake(351.007965,498.725006) controlPoint2:CGPointMake(352.137878,520.179993)];
    [complexShape addCurveToPoint:CGPointMake(316.000000,580.000000) controlPoint1:CGPointMake(339.491791,556.244446) controlPoint2:CGPointMake(328.167419,569.066284)];
    [complexShape addCurveToPoint:CGPointMake(273.000000,620.000000) controlPoint1:CGPointMake(299.305786,590.606079) controlPoint2:CGPointMake(286.016296,605.359131)];
    [complexShape addCurveToPoint:CGPointMake(219.000000,737.000000) controlPoint1:CGPointMake(253.199554,654.579529) controlPoint2:CGPointMake(210.386047,692.031433)];
    [complexShape addCurveToPoint:CGPointMake(249.000000,759.000000) controlPoint1:CGPointMake(225.442154,748.286621) controlPoint2:CGPointMake(236.628326,756.096069)];
    [complexShape addCurveToPoint:CGPointMake(334.000000,704.000000) controlPoint1:CGPointMake(285.551544,759.768677) controlPoint2:CGPointMake(315.180786,732.848572)];
    [complexShape addCurveToPoint:CGPointMake(352.000000,664.000000) controlPoint1:CGPointMake(342.386566,691.840271) controlPoint2:CGPointMake(348.465118,678.245239)];
    [complexShape addCurveToPoint:CGPointMake(363.000000,594.000000) controlPoint1:CGPointMake(356.415161,640.814575) controlPoint2:CGPointMake(362.213562,617.716248)];
    [complexShape addCurveToPoint:CGPointMake(375.000000,545.000000) controlPoint1:CGPointMake(364.278687,577.084534) controlPoint2:CGPointMake(369.613586,560.946472)];
    [complexShape addCurveToPoint:CGPointMake(370.000000,449.000000) controlPoint1:CGPointMake(385.057648,514.062866) controlPoint2:CGPointMake(387.877350,477.758911)];
    [complexShape addLineToPoint:CGPointMake(370.000000,449.000000)];
    [complexShape addLineToPoint:CGPointMake(349.000000,394.000000)];
    [complexShape addCurveToPoint:CGPointMake(317.000000,376.000000) controlPoint1:CGPointMake(342.462463,381.669800) controlPoint2:CGPointMake(329.632996,375.483673)];
    [complexShape addCurveToPoint:CGPointMake(288.000000,392.000000) controlPoint1:CGPointMake(302.854156,369.438843) controlPoint2:CGPointMake(296.932526,386.031342)];
    [complexShape closePath];
    [super setUp];
}

- (void)tearDown
{
    // Put teardown code here; it will be run once, after the last test case.
    [super tearDown];
}

-(CGFloat) round:(CGFloat)val to:(int)digits{
    double factor = pow(10, digits);
    return roundf(val * factor) / factor;
}

-(BOOL) point:(CGPoint)p1 isNearTo:(CGPoint)p2{
    CGFloat xDiff = ABS(p2.x - p1.x);
    CGFloat yDiff = ABS(p2.y - p1.y);
    return xDiff < kIntersectionPointPrecision && yDiff < kIntersectionPointPrecision;
}


-(BOOL) check:(CGFloat) f1 isLessThan:(CGFloat)f2 within:(CGFloat)marginOfError{
    if(f1 <= (f2 * (1.0f+marginOfError))){
        return YES;
    }
    NSLog(@"float value %f is > %f", f1, f2);
    return NO;
}

-(BOOL) checkTanPoint:(CGFloat) f1 isLessThan:(CGFloat)f2{
    return [self check:f1 isLessThan:f2 within:.2];
}

@end
