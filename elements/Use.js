import React, {
    Component,
    PropTypes,
    ART,
    cloneElement
} from 'react-native';
let {Group} = ART;
import Defs from './Defs';
import transformFilter from '../lib/transformFilter';
let idReg = /^#(.+)/;
class Use extends Component{
    static displayName = 'Use';
    static propType = {
        href: PropTypes.string
    };

    render() {
        let href = this.props.href;
        if (href) {
            let matched = href.match(idReg);
            if (matched) {
                let template = Defs.get(matched[1] + ':' + this.props.svgId);
                if (template) {
                    let props = {
                        ...this.props,
                        href: null
                    };
                    return cloneElement(template, props);
                }
            }

        }
        return <Group />;
    }
}

export default Use;
