//
//  RNSVGCompositeXor.metal
//  RNSVG
//
//  Created by Jakub Grzywacz on 28/08/2024.
//

#include <metal_stdlib>
using namespace metal;
#include <CoreImage/CoreImage.h>

// Porter-Duff XOR composition
extern "C" float4 compositeXor(coreimage::sample_t in1, coreimage::sample_t in2)
{
    float4 result;
    
    result.rgb = in1.rgb * (1.0 - in2.a) + in2.rgb * (1.0 - in1.a);
    result.a = in1.a + in2.a - 2.0 * in1.a * in2.a;
    
    return result;
}
