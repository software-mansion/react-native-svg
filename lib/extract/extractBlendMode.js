
const blendModes = {
    'normal':           0,
    'multiply':         1,
    'screen':           2,
    'overlay':          3,
    'darken':           4,
    'lighten':          5,
    'color-dodge':      6,
    'color-burn':       7,
    'soft-light':       8,
    'hard-light':       9,
    'difference':       10,
    'exclusion':        11,
    'hue':              12,
    'saturation':       13,
    'color':            14,
    'luminosity':       15,
    'clear':            16,
    'copy':             17,
    'source-in':        18,
    'source-out':       19,
    'source-atop':      20,
    'destination-over': 21,
    'destination-in':   22,
    'destination-out':  23,
    'destination-atop': 24,
    'xor':              25,
    'plus-darker':      26,
    'plus-lighter':     27,
};

export default function(blendMode) {
    return +blendModes[blendMode];
}
