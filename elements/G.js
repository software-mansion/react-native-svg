import React, {
    ART,
    Component,
    Children,
    cloneElement
} from 'react-native';

let {
    Group
} = ART;

import Defs from './Defs';

const transformProps = {
    scale: null,
    scaleX: null,
    scaleY: null,
    rotate: null,
    transform: null,
    x: null,
    y: null,
    originX: null,
    originY: null
};

import transformFilter from '../lib/transformFilter';

class G extends Component{
    static displayName = 'G';

    constructor() {
        super(...arguments);
        this.children = Children.map(this.props.children, child => cloneElement(child, {
            ...this.props,
            ...transformProps,
            ...child.props,
            id: null
        }));
    };

    render() {
        let element = <Group
            {...this.props}
            {...transformFilter(this.props)}
            id={null}
        >{this.children}</Group>;
        if (this.props.id) {
            Defs.set(this.props.id + ':' + this.props.svgId, <G {...this.props} id={null} />);
        }
        return element;
    }
}

export default G;
