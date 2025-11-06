{{
  function buildDropShadow(offsetX, offsetY, blurRadius, color) {
    return [
      {
        name: "feGaussianBlur",
        in: "SourceAlpha",
        stdDeviation: blurRadius || 0
      },
      {
        name: "feOffset",
        dx: offsetX,
        dy: offsetY,
        result: "offsetblur"
      },
      {
        name: "feFlood",
        floodColor: color || "transparent",
      },
      {
        name: "feComposite",
        in2: "offsetblur",
        operator: "in"
      },
      {
        name: "feMerge",
        children: [
          {
            name: "feMergeNode"
          },
          {
            name: "feMergeNode",
            in: "SourceGraphic"
          }
        ]
      }
    ];
  }
}}

start "filters or 'none'"
  = none
  / filtersList

none "'none'"
  = "none" { return null; }

filtersList "filters"
  = head:(function) tail:(_ function)* {
    const results = [head];
    tail.forEach(element => {
      if (Array.isArray(element[1])) {
        results.push(...element[1]);
      } else {
        results.push(element[1]);
      }
    });
    return results;
  }

function "filter"
  = grayscale
  / sepia
  / saturate
  / hueRotate
  / invert
  / opacity
  / brightness
  / contrast
  / blur
  / dropShadow

// Convert CSS shorthands to primitive representation
// https://www.w3.org/TR/filter-effects-1/#ShorthandEquivalents

grayscale "grayscale"
  = _ "grayscale(" _ value:numberPercentage _ ")" _ {
    return {
      name: "feColorMatrix",
      type: "matrix",
      values: [
        0.2126 + 0.7874 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 - 0.0722 * (1 - value), 0, 0,
        0.2126 - 0.2126 * (1 - value), 0.7152 + 0.2848 * (1 - value), 0.0722 - 0.0722 * (1 - value), 0, 0,
        0.2126 - 0.2126 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 + 0.9278 * (1 - value), 0, 0,
        0, 0, 0, 1, 0
      ]
    };
  }

sepia "sepia"
  = _ "sepia(" _ value:numberPercentage _ ")" _ {
    return {
      name: "feColorMatrix",
      type: "matrix",
      values: [
        0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value), 0, 0,
        0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value), 0, 0,
        0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value), 0, 0,
        0, 0, 0, 1, 0
      ]
    };
  }

saturate "saturate"
  = _ "saturate(" _ value:numberPercentage _ ")" _ {
    return {
      name: "feColorMatrix",
      type: "saturate",
      values: [value]
    };
  }

hueRotate "hue-rotate"
  = _ "hue-rotate(" _ value:(angleZero) _ ")" _ {
    return {
      name: "feColorMatrix",
      type: "hueRotate",
      values: [value]
    };
  }

invert "invert"
  = _ "invert(" _ value:numberPercentage _ ")" _ {
    return {
      name: "feComponentTransfer",
      children: [
        {
          name: "feFuncR",
          type: "table",
          tableValues: [value, 1 - value]
        },
        {
          name: "feFuncG",
          type: "table",
          tableValues: [value, 1 - value]
        },
        {
          name: "feFuncB",
          type: "table",
          tableValues: [value, 1 - value]
        }
      ]
    };
  }

opacity "opacity"
  = _ "opacity(" _ value:numberPercentage _ ")" _ {
    return {
      name: "feComponentTransfer",
      children: [
        {
          name: "feFuncA",
          type: "table",
          tableValues: [0, value]
        }
      ]
    };
  }

brightness "brightness"
  = _ "brightness(" _ value:numberPercentage _ ")" _ {
    return {
      name: "feComponentTransfer",
      children: [
        {
          name: "feFuncR",
          type: "linear",
          slope: value
        },
        {
          name: "feFuncG",
          type: "linear",
          slope: value
        },
        {
          name: "feFuncB",
          type: "linear",
          slope: value
        }
      ]
    };
  }

contrast "contrast"
  = _ "contrast(" _ value:numberPercentage _ ")" _ {
    return {
      name: "feComponentTransfer",
      children: [
        {
          name: "feFuncR",
          type: "linear",
          slope: value,
          intercept: -(0.5 * value) + 0.5
        },
        {
          name: "feFuncG",
          type: "linear",
          slope: value,
          intercept: -(0.5 * value) + 0.5
        },
        {
          name: "feFuncB",
          type: "linear",
          slope: value,
          intercept: -(0.5 * value) + 0.5
        }
      ]
    };
  }

blur "blur"
  = _ "blur(" _ value:NUM IDENTIFIER? _ ")" _ {
    return {
      name: "feGaussianBlur",
      stdDeviation: value
    };
  }

dropShadow "drop-shadow"
  = _ "drop-shadow(" _ offsetX:NUM IDENTIFIER? _ offsetY:NUM IDENTIFIER? _ blurRadius:NUM? IDENTIFIER? _ color:COLOR? _ ")" _ {
    return buildDropShadow(offsetX, offsetY, blurRadius, color);
  }
  / _ "drop-shadow(" _ color:COLOR _ offsetX:NUM IDENTIFIER? _ offsetY:NUM IDENTIFIER? _ blurRadius:NUM? IDENTIFIER? _ ")" _ {
    return buildDropShadow(offsetX, offsetY, blurRadius, color);
  }


numberPercentage "number or percentage"
  = value:NUM "%" {
    return value / 100;
  }
  / value:NUM

angleZero "angle or zero"
  = angle
  / zero

angle "angle"
  = value:NUM "deg"? {
    return value;
  }
  / value:NUM "grad" {
    return value * 180 / 200;
  }
  / value:NUM "rad" {
    return value * 180 / Math.PI;
  }
  / value:NUM "turn" {
    return value * 360;
  }

zero "zero"
  = "0"

_ "whitespace"
  = [ \t\n\r]*

IDENTIFIER "identifier"
  = [a-z\-]+ {
    return text();
  }

COLOR "color"
  = "#" [0-9a-fA-F]+ { return text(); }
  / "rgb(" _ r:NUM _ "," _ g:NUM _ "," _ b:NUM _ ")" { return text(); }
  / "rgba(" _ r:NUM _ "," _ g:NUM _ "," _ b:NUM _ "," _ a:NUM _ ")" { return text(); }
  / IDENTIFIER { return text(); }

NUM
  = [+-]? ([0-9]* "." [0-9]+ / [0-9]+) ("e" [+-]? [0-9]+)? {
    return parseFloat(text());
  }
