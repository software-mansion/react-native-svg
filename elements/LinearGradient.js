import React, {
    Component,
    PropTypes,
    ART,
    Children
} from 'react-native';
let {
    LinearGradient: ARTLinearGradient
} = ART;
import stopsOpacity from '../lib/stopsOpacity';
import Gradient from './Gradient';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class LinearGradient extends Gradient{
    static displayName = 'LinearGradient';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType,
        id: PropTypes.string
    };

    render() {
        let {
            x1,
            y1,
            x2,
            y2
        } = this.props;
        let gradientProps = [x1, y1, x2, y2];
        return super.render(
            gradientProps,
            function (factories, stops, boundingBox, opacity) {
                return new ARTLinearGradient(
                    stopsOpacity(stops, opacity),
                    factories[0](boundingBox.width),
                    factories[1](boundingBox.height),
                    factories[2](boundingBox.width),
                    factories[3](boundingBox.height)
                );
            },
            function (stops, opacity) {
                return new ARTLinearGradient(stopsOpacity(stops, opacity), ...gradientProps);
            }
        );
    }
}

export default LinearGradient;

