{
  function makeResult(alignment, shift) {
    return {
      alignmentBaseline: alignment || null,
      baselineShift: shift || null
    };
  }
}

VerticalAlign
  = parts:VerticalAlignPart+ {
      let alignment = null;
      let shift = null;
      for (const p of parts) {
        if (p.type === "alignment") alignment = p.value;
        if (p.type === "shift") shift = p.value;
      }
      return makeResult(alignment, shift);
    }

VerticalAlignPart
  = _ align:AlignmentBaseline { return { type: "alignment", value: align }; }
  / _ shift:BaselineShift { return { type: "shift", value: shift }; }

AlignmentBaseline
  = "baseline" / "middle" / "central" / "text-top" / "text-bottom" / "top" / "bottom" / "alphabetic" / "ideographic" / "mathematical" / "center"

BaselineShift
  = "sub" / "super" / Length

Length
  = sign:"-"? int:[0-9]+ frac:("." [0-9]+)? unit:("px" / "em" / "rem" / "%" )? {
      return (sign || "") + int.join("") + (frac ? "." + frac[1].join("") : "") + (unit || "");
    }

_ = [ \t\r\n]*