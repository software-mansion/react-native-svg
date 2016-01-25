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

    getChildren = () => {
        return Children.map(this.props.children, child => cloneElement(child, {
            ...this.props,
            ...transformProps,
            ...child.props,
            id: null
        }));
    };

    render() {
        if (this.props.id) {
            return <Defs.Item
                id={this.props.id}
                svgId={this.props.svgId}
                visible={true}
            >
                <G {...this.props} id={null} />
            </Defs.Item>;
        } else {
            return <Group
                {...this.props}
                {...transformFilter(this.props)}
                id={null}
            >{this.getChildren()}</Group>;
        }
    }
}

export default G;
