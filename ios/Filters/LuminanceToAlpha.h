
#ifndef LuminanceToAlpha_h
#define LuminanceToAlpha_h

static CIImage *applyLuminanceToAlphaFilter(CIImage *inputImage)
{
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

#endif /* LuminanceToAlpha_h */
