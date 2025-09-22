#import "RNSVGFeTurbulence.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/view/conversions.h>
#import <rnsvg/RNSVGComponentDescriptors.h>
#import "RNSVGConvert.h"
#import "RNSVGFabricConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

#define RAND_m 2147483647
#define RAND_a 16807
#define RAND_q 127773
#define RAND_r 2836

#define BM 0xff
#define PerlinN 0x1000
#define NM 0xfff
#define BSize 0x100

typedef struct {
  int nWidth;
  int nHeight;
  int nWrapX;
  int nWrapY;
} StitchInfo;

@implementation RNSVGFeTurbulence

static int uLatticeSelector[BSize + BSize + 2];
static double fGradient[4][BSize + BSize + 2][2];

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSVGFeTurbulenceProps>();
    _props = defaultProps;
  }
  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSVGFeTurbulenceComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = static_cast<const RNSVGFeTurbulenceProps &>(*props);
  
  id baseFrequency = RNSVGConvertFollyDynamicToId(newProps.baseFrequency);
  if (baseFrequency != nil) {
    self.baseFrequency = [RCTConvert RNSVGLengthArray:baseFrequency];
  }
  
  id numOctaves = RNSVGConvertFollyDynamicToId(newProps.numOctaves);
  if (numOctaves != nil) {
    self.numOctaves = [RCTConvert RNSVGLength:numOctaves];
  }
  
  id seed = RNSVGConvertFollyDynamicToId(newProps.seed);
  if (seed != nil) {
    self.seed = [RCTConvert RNSVGLength:seed];
  }
  
  self.type = [RNSVGConvert RNSVGTurbulenceTypeFromCppEquivalent:newProps.type];
  self.stitchTiles = [RNSVGConvert RNSVGTurbulenceStitchTileFromCppEquivalent:newProps.stitchTiles];
  
  setCommonFilterProps(newProps, self);
  _props = std::static_pointer_cast<RNSVGFeTurbulenceProps const>(props);
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _baseFrequency = nil;
  _numOctaves = [RNSVGLength lengthWithNumber:1];
  _seed = [RNSVGLength lengthWithNumber:0];
  _stitchTiles = RNSVGTurbulenceStitchTile::SVG_FETURBULENCE_STITCH_TILE_NO_STITCH;
  _type = RNSVGTurbulenceType::SVG_FETURBULENCE_TYPE_TURBULENCE;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)setBaseFrequency:(NSArray<RNSVGLength *> *)baseFrequency
{
  if (baseFrequency == _baseFrequency) {
    return;
  }
  
  _baseFrequency = baseFrequency;
  [self invalidate];
}

- (void)setNumOctaves:(RNSVGLength *)numOctaves
{
  if ([numOctaves isEqualTo:_numOctaves]) {
    return;
  }
  
  _numOctaves = numOctaves;
  [self invalidate];
}

- (void)setSeed:(RNSVGLength *)seed
{
  if ([seed isEqualTo:_seed]) {
    return;
  }
  
  _seed = seed;
  [self invalidate];
}

- (void)setStitchTiles:(RNSVGTurbulenceStitchTile)stitchTiles
{
  if (stitchTiles == _stitchTiles) {
    return;
  }
  _stitchTiles = stitchTiles;
  [self invalidate];
}

- (void)setType:(RNSVGTurbulenceType)type
{
  if (type == _type) {
    return;
  }
  _type = type;
  [self invalidate];
}

- (CIImage *)applyFilter:(NSMutableDictionary<NSString *, CIImage *> *)results
    previousFilterResult:(CIImage *)previous
{
  CGRect extent = previous.extent;
  size_t width = CGRectGetWidth(extent);
  size_t height = CGRectGetHeight(extent);
  
  [self init:(long)_seed];
  
  unsigned char *rawData = (unsigned char *)calloc(height * width * 4, sizeof(unsigned char));
  
  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      double point[2] = { (double)x, (double)y };
      
      double rSum = [self turbulence:0 point:point width:width height:height];
      double gSum = [self turbulence:1 point:point width:width height:height];
      double bSum = [self turbulence:2 point:point width:width height:height];
      double aSum = [self turbulence:3 point:point width:width height:height];
      
      if (_type == RNSVGTurbulenceType::SVG_FETURBULENCE_TYPE_FRACTAL_NOISE) {
        rSum = (rSum + 1.0) / 2.0;
        gSum = (gSum + 1.0) / 2.0;
        bSum = (bSum + 1.0) / 2.0;
        aSum = (aSum + 1.0) / 2.0;
      }
      
      rSum = fmin(fmax(rSum, 0.0), 1.0);
      gSum = fmin(fmax(gSum, 0.0), 1.0);
      bSum = fmin(fmax(bSum, 0.0), 1.0);
      aSum = fmin(fmax(aSum, 0.0), 1.0);
      
      int offset = (int)(y * width + x) * 4;
      rawData[offset]     = (unsigned char)round(rSum * 255.0);
      rawData[offset + 1] = (unsigned char)round(gSum * 255.0);
      rawData[offset + 2] = (unsigned char)round(bSum * 255.0);
      rawData[offset + 3] = (unsigned char)round(aSum * 255.0);
    }
  }
  
  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  CGDataProviderRef provider = CGDataProviderCreateWithData(NULL, rawData, width * height * 4, NULL);
  CGImageRef cgImage = CGImageCreate(width, height, 8, 32, width * 4, colorSpace,
                                     (CGBitmapInfo)kCGImageAlphaLast | kCGBitmapByteOrder32Big,
                                     provider, NULL, NO, kCGRenderingIntentDefault);
  
  CIImage *output = [CIImage imageWithCGImage:cgImage];
  
  CGImageRelease(cgImage);
  CGDataProviderRelease(provider);
  CGColorSpaceRelease(colorSpace);
  free(rawData);
  
  return output;
}

- (void)init:(long)lSeed {
  double s;
  int i, j, k;
  lSeed = [self setupSeed:lSeed];
  
  for (k = 0; k < 4; k++) {
    for (i = 0; i < BSize; i++) {
      uLatticeSelector[i] = i;
      do {
        for (j = 0; j < 2; j++) {
          lSeed = [self random_val:lSeed];
          fGradient[k][i][j] = ((double)((lSeed % (BSize + BSize)) - BSize)) / (double)BSize;
        }
      } while (fGradient[k][i][0] == 0.0 && fGradient[k][i][1] == 0.0);
      
      s = sqrt(fGradient[k][i][0] * fGradient[k][i][0] + fGradient[k][i][1] * fGradient[k][i][1]);
      if (s > 1.0) {
        i--;
        continue;
      }
      fGradient[k][i][0] /= s;
      fGradient[k][i][1] /= s;
    }
  }
  
  while (--i) {
    k = uLatticeSelector[i];
    lSeed = [self random_val:lSeed];
    j = (int)(lSeed % BSize);
    uLatticeSelector[i] = uLatticeSelector[j];
    uLatticeSelector[j] = k;
  }
  
  for (i = 0; i < BSize + 2; i++) {
    uLatticeSelector[BSize + i] = uLatticeSelector[i];
    for (k = 0; k < 4; k++) {
      for (j = 0; j < 2; j++) fGradient[k][BSize + i][j] = fGradient[k][i][j];
    }
  }
}

- (double)noise2:(int)nColorChannel vec:(double *)vec pStitchInfo:(StitchInfo *)pStitchInfo
{
  int bx0, bx1, by0, by1, b00, b10, b01, b11;
  double rx0, rx1, ry0, ry1, *q, sx, sy, a, b, t, u, v;
  int i, j;
  
  t = vec[0] + PerlinN;
  bx0 = (int)t;
  bx1 = bx0 + 1;
  rx0 = t - (int)t;
  rx1 = rx0 - 1.0;
  
  t = vec[1] + PerlinN;
  by0 = (int)t;
  by1 = by0 + 1;
  ry0 = t - (int)t;
  ry1 = ry0 - 1.0;
  
  if (pStitchInfo != NULL) {
    if (bx0 >= pStitchInfo->nWrapX) bx0 -= pStitchInfo->nWidth;
    if (bx1 >= pStitchInfo->nWrapX) bx1 -= pStitchInfo->nWidth;
    if (by0 >= pStitchInfo->nWrapY) by0 -= pStitchInfo->nHeight;
    if (by1 >= pStitchInfo->nWrapY) by1 -= pStitchInfo->nHeight;
  }
  
  bx0 &= BM;
  bx1 &= BM;
  by0 &= BM;
  by1 &= BM;
  
  i = uLatticeSelector[bx0];
  j = uLatticeSelector[bx1];
  
  b00 = uLatticeSelector[i + by0];
  b10 = uLatticeSelector[j + by0];
  b01 = uLatticeSelector[i + by1];
  b11 = uLatticeSelector[j + by1];
  
  sx = [self sCurve:rx0];
  sy = [self sCurve:ry0];
  
  q = fGradient[nColorChannel][b00]; u = rx0 * q[0] + ry0 * q[1];
  q = fGradient[nColorChannel][b10]; v = rx1 * q[0] + ry0 * q[1];
  a = [self lerp:sx a:u b:v];
  
  q = fGradient[nColorChannel][b01]; u = rx0 * q[0] + ry1 * q[1];
  q = fGradient[nColorChannel][b11]; v = rx1 * q[0] + ry1 * q[1];
  b = [self lerp:sx a:u b:v];
  
  return [self lerp:sy a:a b:b];
}

- (double)turbulence:(int)nColorChannel point:(double *)point width:(double)width height:(double)height
{
  StitchInfo stitch;
  StitchInfo *pStitchInfo = NULL;
  double baseFreqX = [self getBaseFrequencyX];
  double baseFreqY = [self getBaseFrequencyY];
  
  if (_stitchTiles == RNSVGTurbulenceStitchTile::SVG_FETURBULENCE_STITCH_TILE_STITCH) {
    if (baseFreqX != 0.0) {
      double fLoFreq = floor(width * baseFreqX) / width;
      double fHiFreq = ceil(width * baseFreqX) / width;
      baseFreqX = (baseFreqX / fLoFreq < fHiFreq / baseFreqX) ? fLoFreq : fHiFreq;
    }
    if (baseFreqY != 0.0) {
      double fLoFreq = floor(height * baseFreqY) / height;
      double fHiFreq = ceil(height * baseFreqY) / height;
      baseFreqY = (baseFreqY / fLoFreq < fHiFreq / baseFreqY) ? fLoFreq : fHiFreq;
    }
    
    pStitchInfo = &stitch;
    stitch.nWidth  = (int)(width * baseFreqX + 0.5);
    stitch.nWrapX  = (int)(PerlinN + stitch.nWidth);
    stitch.nHeight = (int)(height * baseFreqY + 0.5);
    stitch.nWrapY  = (int)(PerlinN + stitch.nHeight);
  }
  
  double fSum = 0.0;
  double vec[2];
  double screenScale = [UIScreen mainScreen].scale;
  vec[0] = point[0] / screenScale * baseFreqX;
  vec[1] = point[1] / screenScale * baseFreqY;
  double ratio = 1.0;
  
  for (int nOctave = 0; nOctave < _numOctaves.value; nOctave++) {
    double n = [self noise2:nColorChannel vec:vec pStitchInfo:pStitchInfo];
    
    if (_type == RNSVGTurbulenceType::SVG_FETURBULENCE_TYPE_FRACTAL_NOISE) {
      fSum += n / ratio;
    } else {
      fSum += fabs(n) / ratio;
    }
    
    vec[0] *= 2.0;
    vec[1] *= 2.0;
    ratio *= 2.0;
    
    if (pStitchInfo != NULL) {
      stitch.nWidth  *= 2;
      stitch.nWrapX   = 2 * stitch.nWrapX - PerlinN;
      stitch.nHeight *= 2;
      stitch.nWrapY   = 2 * stitch.nWrapY - PerlinN;
    }
  }
  
  return fSum;
}

- (long)setupSeed:(long)lSeed
{
  if (lSeed <= 0) lSeed = -(lSeed % (RAND_m - 1)) + 1;
  if (lSeed > RAND_m - 1) lSeed = RAND_m - 1;
  return lSeed;
}

- (long)random_val:(long)lSeed
{
  long result;
  result = RAND_a * (lSeed % RAND_q) - RAND_r * (lSeed / RAND_q);
  if (result <= 0) result += RAND_m;
  return result;
}


- (double)sCurve:(double)t
{
  return t * t * (3.0 - 2.0 * t);
}

- (double)lerp:(double)t a:(double)a b:(double)b
{
  return a + t * (b - a);
}

- (CGFloat)getBaseFrequencyX {
  if (_baseFrequency != nil && _baseFrequency.count > 0) {
    return _baseFrequency[0].value;
  }
  return 0.0f;
}

- (CGFloat)getBaseFrequencyY {
  if (_baseFrequency != nil && _baseFrequency.count > 1) {
    return _baseFrequency[1].value;
  }
  return [self getBaseFrequencyX];
}

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSVGFeTurbulenceCls(void)
{
  return RNSVGFeTurbulence.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end
