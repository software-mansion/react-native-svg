import SvgPath from 'svgpath';
import BoundingBox from './BoundingBox';

export default function(d) {
    let pathDriver = new SvgPath(d);
    let boundingBox = new BoundingBox();
    pathDriver
        .abs()
        .unarc()
        .unshort()
        .iterate((seg, index, x, y) => {
            switch(seg[0]) {
                case 'M':
                case 'L':
                    boundingBox.addPoint(
                        seg[1],
                        seg[2]
                    );
                    break;
                case 'H':
                    boundingBox.addX(seg[1]);
                    break;
                case 'V':
                    boundingBox.addY(seg[1]);
                    break;
                case 'Q':
                    boundingBox.addQuadraticCurve(
                        x,
                        y,
                        seg[1],
                        seg[2],
                        seg[3],
                        seg[4]
                    );
                    break;
                case 'C':
                    boundingBox.addBezierCurve(
                        x,
                        y,
                        seg[1],
                        seg[2],
                        seg[3],
                        seg[4],
                        seg[5],
                        seg[6]
                    );
                    break;
            }
        });

    return {
        width: boundingBox.width(),
        height: boundingBox.height(),
        x1: boundingBox.x1,
        y1: boundingBox.y1,
        x2: boundingBox.x2,
        y2: boundingBox.y2
    };
}
