package com.horcrux.svg;

import android.graphics.Path;
import android.graphics.RectF;

class PathParser {
    static final PathParser singleton = new PathParser();

    private PathParser() {
    }

    static Path parseData(String data) {
        return singleton.parse(data);
    }

    static float mScale;

    private char prev_cmd = ' ';
    private Path mPath;
    private int i = 0;
    private int l = 0;
    private String s;

    private float mPenX = 0f;
    private float mPenY = 0f;
    private float mPenDownX;
    private float mPenDownY;
    private float mPivotX = 0f;
    private float mPivotY = 0f;
    private boolean mPenDown = false;

    Path parse(String data) {
        mPath = new Path();
        l = data.length();
        prev_cmd = ' ';
        s = data;
        i = 0;

        while (i < l) {
            skip_spaces();

            if (i >= l) {
                break;
            }

            boolean has_prev_cmd = prev_cmd != ' ';
            char first_char = s.charAt(i);

            if (!has_prev_cmd && first_char != 'M' && first_char != 'm') {
                // The first segment must be a MoveTo.
                throw new Error("UnexpectedData");
            }

            // TODO: simplify
            boolean is_implicit_move_to;
            char cmd;
            if (is_cmd(first_char)) {
                is_implicit_move_to = false;
                cmd = first_char;
                i += 1;
            } else if (is_number_start(first_char) && has_prev_cmd) {
                if (prev_cmd == 'Z' || prev_cmd == 'z') {
                    // ClosePath cannot be followed by a number.
                    throw new Error("UnexpectedData");
                }

                if (prev_cmd == 'M' || prev_cmd == 'm') {
                    // 'If a moveto is followed by multiple pairs of coordinates,
                    // the subsequent pairs are treated as implicit lineto commands.'
                    // So we parse them as LineTo.
                    is_implicit_move_to = true;
                    if (is_absolute(prev_cmd)) {
                        cmd = 'L';
                    } else {
                        cmd = 'l';
                    }
                } else {
                    is_implicit_move_to = false;
                    cmd = prev_cmd;
                }
            } else {
                throw new Error("UnexpectedData");
            }

            boolean absolute = is_absolute(cmd);
            switch (cmd) {
                case 'm': {
                    move(parse_list_number(), parse_list_number());
                    break;
                }
                case 'M': {
                    moveTo(parse_list_number(), parse_list_number());
                    break;
                }
                case 'l': {
                    line(parse_list_number(), parse_list_number());
                    break;
                }
                case 'L': {
                    lineTo(parse_list_number(), parse_list_number());
                    break;
                }
                case 'h': {
                    line(parse_list_number(), 0);
                    break;
                }
                case 'H': {
                    lineTo(parse_list_number(), mPenY);
                    break;
                }
                case 'v': {
                    line(0, parse_list_number());
                    break;
                }
                case 'V': {
                    lineTo(mPenX, parse_list_number());
                    break;
                }
                case 'c': {
                    curve(parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number());
                    break;
                }
                case 'C': {
                    curveTo(parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number());
                    break;
                }
                case 's': {
                    smoothCurve(parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number());
                    break;
                }
                case 'S': {
                    smoothCurveTo(parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number());
                    break;
                }
                case 'q': {
                    quadraticBezierCurve(parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number());
                    break;
                }
                case 'Q': {
                    quadraticBezierCurveTo(parse_list_number(), parse_list_number(), parse_list_number(), parse_list_number());
                    break;
                }
                case 't': {
                    smoothQuadraticBezierCurve(parse_list_number(), parse_list_number());
                    break;
                }
                case 'T': {
                    smoothQuadraticBezierCurveTo(parse_list_number(), parse_list_number());
                    break;
                }
                case 'a': {
                    arc(parse_list_number(), parse_list_number(), parse_list_number(), parse_flag(), parse_flag(), parse_list_number(), parse_list_number());
                    break;
                }
                case 'A': {
                    arcTo(parse_list_number(), parse_list_number(), parse_list_number(), parse_flag(), parse_flag(), parse_list_number(), parse_list_number());
                    break;
                }
                case 'z':
                case 'Z': {
                    close();
                    break;
                }
                default: {
                    throw new Error("UnexpectedData");
                }
            }


            if (is_implicit_move_to) {
                if (absolute) {
                    prev_cmd = 'M';
                } else {
                    prev_cmd = 'm';
                }
            } else {
                prev_cmd = cmd;
            }

        }

        return mPath;
    }

    private void move(float x, float y) {
        moveTo(x + mPenX, y + mPenY);
    }

    private void moveTo(float x, float y) {
        mPenDownX = mPivotX = mPenX = x;
        mPenDownY = mPivotY = mPenY = y;
        mPath.moveTo(x * mScale, y * mScale);
    }

    private void line(float x, float y) {
        lineTo(x + mPenX, y + mPenY);
    }

    private void lineTo(float x, float y) {
        setPenDown();
        mPivotX = mPenX = x;
        mPivotY = mPenY = y;
        mPath.lineTo(x * mScale, y * mScale);
    }

    private void curve(float c1x, float c1y, float c2x, float c2y, float ex, float ey) {
        curveTo(c1x + mPenX, c1y + mPenY, c2x + mPenX, c2y + mPenY, ex + mPenX, ey + mPenY);
    }

    private void curveTo(float c1x, float c1y, float c2x, float c2y, float ex, float ey) {
        mPivotX = c2x;
        mPivotY = c2y;
        cubicTo(c1x, c1y, c2x, c2y, ex, ey);
    }

    private void cubicTo(float c1x, float c1y, float c2x, float c2y, float ex, float ey) {
        setPenDown();
        mPenX = ex;
        mPenY = ey;
        mPath.cubicTo(c1x * mScale, c1y * mScale, c2x * mScale, c2y * mScale, ex * mScale, ey * mScale);
    }

    private void smoothCurve(float c1x, float c1y, float ex, float ey) {
        smoothCurveTo(c1x + mPenX, c1y + mPenY, ex + mPenX, ey + mPenY);
    }

    private void smoothCurveTo(float c1x, float c1y, float ex, float ey) {
        float c2x = c1x;
        float c2y = c1y;
        c1x = (mPenX * 2) - mPivotX;
        c1y = (mPenY * 2) - mPivotY;
        mPivotX = c2x;
        mPivotY = c2y;
        cubicTo(c1x, c1y, c2x, c2y, ex, ey);
    }

    private void quadraticBezierCurve(float c1x, float c1y, float c2x, float c2y) {
        quadraticBezierCurveTo(c1x + mPenX, c1y + mPenY, c2x + mPenX, c2y + mPenY);
    }

    private void quadraticBezierCurveTo(float c1x, float c1y, float c2x, float c2y) {
        mPivotX = c1x;
        mPivotY = c1y;
        float ex = c2x;
        float ey = c2y;
        c2x = (ex + c1x * 2) / 3;
        c2y = (ey + c1y * 2) / 3;
        c1x = (mPenX + c1x * 2) / 3;
        c1y = (mPenY + c1y * 2) / 3;
        cubicTo(c1x, c1y, c2x, c2y, ex, ey);
    }

    private void smoothQuadraticBezierCurve(float c1x, float c1y) {
        smoothQuadraticBezierCurveTo(c1x + mPenX, c1y + mPenY);
    }

    private void smoothQuadraticBezierCurveTo(float c1x, float c1y) {
        float c2x = c1x;
        float c2y = c1y;
        c1x = (mPenX * 2) - mPivotX;
        c1y = (mPenY * 2) - mPivotY;
        quadraticBezierCurveTo(c1x, c1y, c2x, c2y);
    }

    private void arc(float rx, float ry, float rotation, boolean outer, boolean clockwise, float x, float y) {
        arcTo(rx, ry, rotation, outer, clockwise, x + mPenX, y + mPenY);
    }

    private void arcTo(float rx, float ry, float rotation, boolean outer, boolean clockwise, float x, float y) {
        float tX = mPenX;
        float tY = mPenY;

        ry = Math.abs(ry == 0 ? (rx == 0 ? (y - tY) : rx) : ry);
        rx = Math.abs(rx == 0 ? (x - tX) : rx);

        if (rx == 0 || ry == 0 || (x == tX && y == tY)) {
            lineTo(x, y);
            return;
        }

        float rad = (float) Math.toRadians(rotation);
        float cos = (float) Math.cos(rad);
        float sin = (float) Math.sin(rad);
        x -= tX;
        y -= tY;

        // Ellipse Center
        float cx = cos * x / 2 + sin * y / 2;
        float cy = -sin * x / 2 + cos * y / 2;
        float rxry = rx * rx * ry * ry;
        float rycx = ry * ry * cx * cx;
        float rxcy = rx * rx * cy * cy;
        float a = rxry - rxcy - rycx;

        if (a < 0) {
            a = (float) Math.sqrt(1 - a / rxry);
            rx *= a;
            ry *= a;
            cx = x / 2;
            cy = y / 2;
        } else {
            a = (float) Math.sqrt(a / (rxcy + rycx));

            if (outer == clockwise) {
                a = -a;
            }
            float cxd = -a * cy * rx / ry;
            float cyd = a * cx * ry / rx;
            cx = cos * cxd - sin * cyd + x / 2;
            cy = sin * cxd + cos * cyd + y / 2;
        }

        // Rotation + Scale Transform
        float xx = cos / rx;
        float yx = sin / rx;
        float xy = -sin / ry;
        float yy = cos / ry;

        // Start and End Angle
        float sa = (float) Math.atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy);
        float ea = (float) Math.atan2(xy * (x - cx) + yy * (y - cy), xx * (x - cx) + yx * (y - cy));

        cx += tX;
        cy += tY;
        x += tX;
        y += tY;

        setPenDown();

        mPenX = mPivotX = x;
        mPenY = mPivotY = y;

        if (rx != ry || rad != 0f) {
            arcToBezier(cx, cy, rx, ry, sa, ea, clockwise, rad);
        } else {

            float start = (float) Math.toDegrees(sa);
            float end = (float) Math.toDegrees(ea);
            float sweep = Math.abs((start - end) % 360);

            if (outer) {
                if (sweep < 180) {
                    sweep = 360 - sweep;
                }
            } else {
                if (sweep > 180) {
                    sweep = 360 - sweep;
                }
            }

            if (!clockwise) {
                sweep = -sweep;
            }

            RectF oval = new RectF(
                    (cx - rx) * mScale,
                    (cy - rx) * mScale,
                    (cx + rx) * mScale,
                    (cy + rx) * mScale);

            mPath.arcTo(oval, start, sweep);
        }
    }

    private void close() {
        if (mPenDown) {
            mPenX = mPenDownX;
            mPenY = mPenDownY;
            mPenDown = false;
            mPath.close();
        }
    }

    private void arcToBezier(float cx, float cy, float rx, float ry, float sa, float ea, boolean clockwise, float rad) {
        // Inverse Rotation + Scale Transform
        float cos = (float) Math.cos(rad);
        float sin = (float) Math.sin(rad);
        float xx = cos * rx;
        float yx = -sin * ry;
        float xy = sin * rx;
        float yy = cos * ry;

        // Bezier Curve Approximation
        float arc = ea - sa;
        if (arc < 0 && clockwise) {
            arc += Math.PI * 2;
        } else if (arc > 0 && !clockwise) {
            arc -= Math.PI * 2;
        }

        int n = (int) Math.ceil(Math.abs(round(arc / (Math.PI / 2))));

        float step = arc / n;
        float k = (float) ((4 / 3.0) * Math.tan(step / 4));

        float x = (float) Math.cos(sa);
        float y = (float) Math.sin(sa);

        for (int i = 0; i < n; i++) {
            float cp1x = x - k * y;
            float cp1y = y + k * x;

            sa += step;
            x = (float) Math.cos(sa);
            y = (float) Math.sin(sa);

            float cp2x = x + k * y;
            float cp2y = y - k * x;

            float c1x = (cx + xx * cp1x + yx * cp1y);
            float c1y = (cy + xy * cp1x + yy * cp1y);
            float c2x = (cx + xx * cp2x + yx * cp2y);
            float c2y = (cy + xy * cp2x + yy * cp2y);
            float ex = (cx + xx * x + yx * y);
            float ey = (cy + xy * x + yy * y);

            mPath.cubicTo(c1x * mScale, c1y * mScale, c2x * mScale, c2y * mScale, ex * mScale, ey * mScale);
        }
    }

    private void setPenDown() {
        if (!mPenDown) {
            mPenDownX = mPenX;
            mPenDownY = mPenY;
            mPenDown = true;
        }
    }

    private double round(double val) {
        double multiplier = Math.pow(10, 4);
        return Math.round(val * multiplier) / multiplier;
    }

    private void skip_spaces() {
        while (i < l && Character.isWhitespace(s.charAt(i))) i++;
    }

    private boolean is_cmd(char c) {
        switch (c) {
            case 'M':
            case 'm':
            case 'Z':
            case 'z':
            case 'L':
            case 'l':
            case 'H':
            case 'h':
            case 'V':
            case 'v':
            case 'C':
            case 'c':
            case 'S':
            case 's':
            case 'Q':
            case 'q':
            case 'T':
            case 't':
            case 'A':
            case 'a':
                return true;
        }
        return false;
    }

    private boolean is_number_start(char c) {
        return (c >= '0' && c <= '9') || c == '.' || c == '-' || c == '+';
    }

    private boolean is_absolute(char c) {
        return Character.isUpperCase(c);
    }

    // By the SVG spec 'large-arc' and 'sweep' must contain only one char
    // and can be written without any separators, e.g.: 10 20 30 01 10 20.
    private boolean parse_flag() {
        skip_spaces();

        char c = s.charAt(i);
        switch (c) {
            case '0':
            case '1': {
                i += 1;
                if (i < l && s.charAt(i) == ',') {
                    i += 1;
                }
                skip_spaces();
                break;
            }
            default:
                throw new Error("UnexpectedData");
        }

        return c == '1';
    }

    private float parse_list_number() {
        if (i == l) {
            throw new Error("UnexpectedEnd");
        }

        float n = parse_number();
        skip_spaces();
        parse_list_separator();

        return n;
    }

    private float parse_number() {
        // Strip off leading whitespaces.
        skip_spaces();

        if (i == l) {
            throw new Error("InvalidNumber");
        }

        int start = i;

        char c = s.charAt(i);

        // Consume sign.
        if (c == '-' || c == '+') {
            i += 1;
            c = s.charAt(i);
        }

        // Consume integer.
        if (c >= '0' && c <= '9') {
            skip_digits();
            if (i < l) {
                c = s.charAt(i);
            }
        } else if (c != '.') {
            throw new Error("InvalidNumber");
        }

        // Consume fraction.
        if (c == '.') {
            i += 1;
            skip_digits();
            if (i < l) {
                c = s.charAt(i);
            }
        }

        if ((c == 'e' || c == 'E') && i + 1 < l) {
            char c2 = s.charAt(i + 1);
            // Check for `em`/`ex`.
            if (c2 != 'm' && c2 != 'x') {
                i += 1;
                c = s.charAt(i);

                if (c == '+' || c == '-') {
                    i += 1;
                    skip_digits();
                } else if (c >= '0' && c <= '9') {
                    skip_digits();
                } else {
                    throw new Error("InvalidNumber");
                }
            }
        }

        String num = s.substring(start, i);
        float n = Float.parseFloat(num);

        // inf, nan, etc. are an error.
        if (Float.isInfinite(n) || Float.isNaN(n)) {
            throw new Error("InvalidNumber");
        }

        return n;
    }

    private void parse_list_separator() {
        if (i < l && s.charAt(i) == ',') {
            i += 1;
        }
    }

    private void skip_digits() {
        while (i < l && Character.isDigit(s.charAt(i))) i++;
    }
}
