import React, {
    Children,
    cloneElement,
    Component,
    ART
} from 'react-native';
let {Group} = ART;
let map = {};

// TODO: more details should be handled(different Svg namespace、(remove, add, update) Defs children)
class Defs extends Component{
    static displayName = 'Defs';
    static get = uid => {
        return map[uid];
    };

    static set = (uid, element) => {
        map[uid] = element;
    };

    componentWillMount = () => {
        this.getDefines(this.props.children);
    };

    componentWillReceiveProps = nextProps => {
        this.getDefines(nextProps);
    };

    getDefines = children => {
        Children.map(children, child => {
            let {props: {id}} = child;
            if (id) {
                console.log(id + ':' + this.props.svgId);
                map[id + ':' + this.props.svgId] = cloneElement(child, {
                    id: null
                });
            }
        });
    };

    render() {
        return <Group />;
    }
}

export default Defs;
