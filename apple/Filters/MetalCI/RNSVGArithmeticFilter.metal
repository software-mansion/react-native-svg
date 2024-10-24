#include <metal_stdlib>
using namespace metal;
#include <CoreImage/CoreImage.h>


extern "C" float4 RNSVGArithmeticFilter(coreimage::sample_t in1, coreimage::sample_t in2, float k1, float k2, float k3, float k4)
{
    float4 arithmeticResult;
    arithmeticResult.rgb = k1 * in1.rgb * in2.rgb + k2 * in1.rgb + k3 * in2.rgb + k4;
    arithmeticResult.a = k1 * in1.a * in2.a + k2 * in1.a + k3 * in2.a + k4;

    arithmeticResult.rgb = clamp(arithmeticResult.rgb, 0.0, 1.0);
    arithmeticResult.a = clamp(arithmeticResult.a, 0.0, 1.0);

    return arithmeticResult;
}
