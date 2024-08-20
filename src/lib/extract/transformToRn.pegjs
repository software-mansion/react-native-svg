start "transform functions"
  = transformFunctions

transformFunctions "transformFunctions"
  = head:(function) tail:(_ function)* {
    const results = Array.isArray(head) ? head : [head];
    tail.forEach(element => {
      if (Array.isArray(element[1])) {
        results.push(...element[1]);
      } else {
        results.push(element[1]);
      }
    });
    return results;
  }

function "transform function"
  = matrix
  / translate
  / scale
  / rotate
  / skewX
  / skewY

matrix "matrix"
  = _ "matrix(" _ a:NUM spaceOrComma b:NUM spaceOrComma c:NUM spaceOrComma d:NUM spaceOrComma e:NUM spaceOrComma f:NUM spaceOrComma g:NUM spaceOrComma h:NUM spaceOrComma i:NUM _ ")" _ {
    return { matrix: [a, b, c, d, e, f, g, h, i]};
  }

translate "translate"
  = _ "translate(" _ x:NUM spaceOrComma y:NUM? _ ")" _ {
    if (y == undefined) {
        return { translate: x };
    }
    return { translate: [x, y] };
  }

scale "scale"
  = _ "scale(" _ x:NUM spaceOrComma y:NUM? _ ")" _ {
    if (y == undefined) {
        return { scale: x };
    }
    return [
        { scaleX: x },
        { scaleY: y }
    ];
  }

rotate "rotate"
  = _ "rotate(" _ x:NUM yz:twoNumbers? _ ")" _ {
    if (yz !== null) {
        return { rotate: `${x}deg` };
    }
    return [
        { rotate: `${x}deg` }
    ];
  }

twoNumbers "x, y"
    = spaceOrComma y:NUM spaceOrComma z:NUM {
        return [y, z];
    }

skewX "skewX"
  = _ "skewX(" _ x:NUM _ ")" _ {
    return [
        { skewX: `${x}deg` }
    ];
  }

skewY "skewY"
  = _ "skewY(" _ y:NUM _ ")" _ {
    return [
        { skewY: `${y}deg` }
    ];
  }


spaceOrComma "space or comma"
  = [ \t\n\r,]*

_ "whitespace"
  = [ \t\n\r]*

NUM
  = [+-]? ([0-9]* "." [0-9]+ / [0-9]+) ("e" [+-]? [0-9]+)? {
    return parseFloat(text());
  }
