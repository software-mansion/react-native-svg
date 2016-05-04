import {
    Component,
    PropTypes
} from 'react-native';

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class Image extends Component{
    static displayName = 'Image';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType,
        href: PropTypes.string
        //preserveAspectRatio: PropTypes.string
    };


    render() {
        return null;
    }
}

export default Image;
