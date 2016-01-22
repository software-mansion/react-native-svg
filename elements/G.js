import React, {
    ART,
    Component,
    Children,
    cloneElement
} from 'react-native';

let {
    Group
} = ART;

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

class G extends Component{
    static displayName = 'G';

    constructor() {
        super(...arguments);
        this.children = Children.map(this.props.children, child => cloneElement(child, {
            id: null,
            ...this.props,
            ...transformProps,
            children: child.children,
            ...child.props
        }));
    };

    render() {
        return <Group
            {...this.props}
        >{this.children}</Group>;
    }
}

export default G;
