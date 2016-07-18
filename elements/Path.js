import React, {PropTypes} from 'react';
import Defs from './Defs';
import SerializablePath from '../lib/SerializablePath';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {PathAttributes} from '../lib/attributes';
import mergeContext from '../lib/mergeContext';
import Shape from './Shape';
import {pathProps, numberProp} from '../lib/props';

class Path extends Shape {
    static displayName = 'Path';

    static propTypes = {
        d: PropTypes.string,
        ...pathProps
    };

    static contextTypes = {
        ...pathProps,
        isInGroup: PropTypes.bool,
        svgId: numberProp
    };


    _dimensions = null;

    componentWillReceiveProps = nextProps => {
        if (nextProps.d !== this.props.d) {
            this._dimensions = null;
        }
    };

    setNativeProps = (...args) => {
        this.getNativeElement().setNativeProps(...args);
    };

    getNativeElement = () => {
        return this.refs.root || this.root;
    };

    render() {
        let props = mergeContext(this.props, this.context);

        if (props.id) {
            return <Defs.Item
                id={props.id}
                svgId={props.svgId}
                visible={true}
            >
                <Path
                    ref={ele => this.root = ele.refs.root}
                    {...props}
                    id={null}
                />
            </Defs.Item>;
        }

        let d = new SerializablePath(props.d).toJSON();
        return (
            <RNSVGPath
                ref="root"
                {...this.extractProps(props)}
                d={d}
            />
        );
    }
}

const RNSVGPath = createReactNativeComponentClass({
    validAttributes: PathAttributes,
    uiViewClassName: 'RNSVGPath'
});

export default Path;
