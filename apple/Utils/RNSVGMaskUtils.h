#ifndef LuminanceToAlpha_h
#define LuminanceToAlpha_h

static CIImage *transparentImage()
{
  static CIImage *transparentImage = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    CIFilter *transparent = [CIFilter filterWithName:@"CIConstantColorGenerator"];
    [transparent setValue:[CIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.0] forKey:@"inputColor"];
    transparentImage = [transparent valueForKey:@"outputImage"];
  });
  return transparentImage;
}

static CIImage *blackImage()
{
  static CIImage *blackImage = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    CIFilter *black = [CIFilter filterWithName:@"CIConstantColorGenerator"];
    [black setValue:[CIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:1.0] forKey:@"inputColor"];
    blackImage = [black valueForKey:@"outputImage"];
  });
  return blackImage;
}

static CIImage *applyLuminanceToAlphaFilter(CIImage *inputImage)
{
  // https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEMergeElement:~:text=not%20applicable.%20A-,luminanceToAlpha,-operation%20is%20equivalent
  CIFilter *luminanceToAlpha = [CIFilter filterWithName:@"CIColorMatrix"];
  [luminanceToAlpha setDefaults];
  CGFloat alpha[4] = {0.2125, 0.7154, 0.0721, 0};
  CGFloat zero[4] = {0, 0, 0, 0};
  [luminanceToAlpha setValue:inputImage forKey:@"inputImage"];
  [luminanceToAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputRVector"];
  [luminanceToAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputGVector"];
  [luminanceToAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBVector"];
  [luminanceToAlpha setValue:[CIVector vectorWithValues:alpha count:4] forKey:@"inputAVector"];
  [luminanceToAlpha setValue:[CIVector vectorWithValues:zero count:4] forKey:@"inputBiasVector"];
  return [luminanceToAlpha valueForKey:@"outputImage"];
}

static CIImage *transformImageIntoAlphaMask(CIImage *inputImage)
{
  // Compose alpha only with luminanceToAlpha results
  CIImage *blackBackground = blackImage();
  CIFilter *layerOverBlack = [CIFilter filterWithName:@"CISourceOverCompositing"];
  [layerOverBlack setValue:blackBackground forKey:@"inputBackgroundImage"];
  [layerOverBlack setValue:inputImage forKey:@"inputImage"];
  return applyLuminanceToAlphaFilter([layerOverBlack valueForKey:@"outputImage"]);
}

static CIImage *applyBlendWithAlphaMask(CIImage *inputImage, CIImage *inputMaskImage)
{
  // Apply mask to the source image with transparent background
  CIImage *transparent = transparentImage();
  CIFilter *blendWithAlphaMask = [CIFilter filterWithName:@"CIBlendWithAlphaMask"];
  [blendWithAlphaMask setDefaults];
  [blendWithAlphaMask setValue:inputImage forKey:@"inputImage"];
  [blendWithAlphaMask setValue:transparent forKey:@"inputBackgroundImage"];
  [blendWithAlphaMask setValue:inputMaskImage forKey:@"inputMaskImage"];
  return [blendWithAlphaMask valueForKey:@"outputImage"];
}

#endif /* LuminanceToAlpha_h */
