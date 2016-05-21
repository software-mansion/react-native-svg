import React, {Component, PropTypes} from 'react';
import {set, remove} from '../lib/extract/extractClipping';
import createNativeComponent from '../lib/createNativeComponent';

class ClipPath extends Component{
    static displayName = 'ClipPath';
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    constructor() {
        super(...arguments);
        this.id = this.props.id + ':' + this.props.svgId;
    }

    componentWillReceiveProps = nextProps => {
        let id = nextProps.id + ':' + nextProps.svgId;
        if (id !== this.id) {
            remove(this.id);
        }
    };

    componentWillUnmount = () => {
        remove(this.id);
    };

    render() {
        set(this.id, this.id);
        return <RNSVGClipPath
            name={this.id}
        >{this.props.children}</RNSVGClipPath>;
    }
}

const RNSVGClipPath = createNativeComponent('RNSVGClipPath');

export default ClipPath;

