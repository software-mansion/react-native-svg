export default function({viewbox, width, height, preserveAspectRatio, x: dx, y: dy, dScale, dScaleX, dScaleY, shouldTransform}) {
    if (!viewbox || !width || !height) {
        return false;
    }

    if (typeof viewbox === 'string') {
        let parts = viewbox.trim().split(/\s+/);
        let vw = +parts[2];
        let vh = +parts[3];

        // width or height can`t be negative
        if (vw < 0 || vh < 0 || parts.length !== 4) {
            return false;
        }

        // width or height equals zero disable render
        if (!vw || !vh) {
            return {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0
            }
        }

        let vx = +parts[0] || 0;
        let vy = +parts[1] || 0;
        let preserve = preserveAspectRatio !== 'none';
        let scaleX = 1;
        let scaleY = 1;
        let x = 0;
        let y = 0;
        let sx = width / vw;
        let sy = height / vh;
        if (preserve) {
            scaleX = scaleY = Math.min(sx, sy);
            x = width / 2 - Math.min(vw, vh) * scaleX / 2 - vx * scaleX;
            y = 0 - vy * scaleX;

            if (sx < sy) {
                [x, y] = [y, x];
            }
        } else {
            scaleX = sx;
            scaleY = sy;
            x = -vx * sx;
            y = -vy * sy;
        }

        if (shouldTransform) {
            x += (+dx || 0);
            y += (+dy || 0);

            if (dScale) {
                scaleX *= (+dScale || 1);
                scaleY *= (+dScale || 1);
            } else {
                scaleX *= (+dScaleX || 1);
                scaleY *= (+dScaleY || 1);
            }
        }

        return {
            x,
            y,
            scaleX,
            scaleY
        };
    }
    return false;
}
