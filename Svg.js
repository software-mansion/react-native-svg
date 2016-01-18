import {
    ART
} from 'react-native';
import Circle from './Circle';
import Ellipse from './Ellipse';
import Polygon from './Polygon';
import Polyline from './Polyline';

let {
    Surface,
    Shape,
    Group
} = ART;

export {
    Surface as Svg,
    Circle,
    Ellipse,
    Group,
    Shape as Path,
    Polygon,
    Polyline
};

export default Surface;
