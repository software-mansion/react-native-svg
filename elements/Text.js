import React, {
    Component
} from 'react-native';
import Defs from './Defs';
import createReactNativeComponentClass from 'react-native/Libraries/ReactNative/createReactNativeComponentClass';
import extractProps from '../lib/extract/extractProps';
import extractText from '../lib/extract/extractText';
import {TextAttributes} from '../lib/attributes';
import numberProp from '../lib/numberProp';

class Text extends Component{
    static displayName = 'Text';
    static propTypes = {
        x: numberProp,
        y: numberProp,
        dx: numberProp,
        dy: numberProp
    };
    render() {
        let {props} = this;

        let x = 0;
        if (props.x) {
            x = props.dx ? +props.x + (+props.dx) : +props.x;
        }
        let y = 0;
        if (props.y) {
            y = props.dy ? +props.y + (+props.dy) : +props.y;
        }

        if (this.props.id) {
            return <Defs.Item
                id={this.props.id}
                svgId={this.props.svgId}
                visible={true}
                text={true}
            >
                <Text {...this.props} id={null} />
            </Defs.Item>;
        }
        // TODO: support percent gradients
        return (
            <NativeText
                {...extractProps({...props, x, y})}
                {...extractText(props)}
            />
        );
    }
}

let NativeText = createReactNativeComponentClass({
    validAttributes: TextAttributes,
    uiViewClassName: 'RNSVGText'
});

export default Text;
