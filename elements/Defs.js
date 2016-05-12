import React, {Children, Component, cloneElement, PropTypes} from 'react';
import {NativeGroup} from './G';
let map = {};

import LinearGradient from './LinearGradient';
import RadialGradient from './RadialGradient';
import ClipPath from './ClipPath';
let onlyChild = Children.only;

class DefsItem extends Component{
    static displayName = 'DefsItem';
    static propType = {
        visible: PropTypes.bool
    };
    static defaultProps = {
        visible: false
    };

    constructor() {
        super(...arguments);
        this.id = this.props.id + ':' + this.props.svgId;
        map[this.id] = cloneElement(onlyChild(this.props.children), {
            id: null
        });
    }

    componentWillReceiveProps = nextProps => {
        let id = nextProps.id + ':' + nextProps.svgId;
        if (id !== this.id) {
            delete map[this.id];
        }
        map[id] = cloneElement(onlyChild(nextProps.children), {
            id: null
        });
    };

    componentWillUnmount = () => {
        delete map[this.id];
    };

    render() {
        return this.props.visible ? onlyChild(this.props.children) : <NativeGroup />;
    }
}

let idReg = /^#(.+)/;
class DefsUse extends Component{
    static displayName = 'DefsUse';
    static propType = {
        href: PropTypes.string
    };
    render() {
        let href = this.props.href;
        if (href) {
            let matched = href.match(idReg);
            if (matched) {
                let template = map[matched[1] + ':' + this.props.svgId];
                if (template) {
                    return cloneElement(template, {
                        ...this.props,
                        href: null
                    });
                }
            }
        }

        console.warn(`Invalid href: '${href}' for Use element.\n Please check if '${href}' if defined`);
        return <NativeGroup />;
    }
}

// TODO: defination scope, global or local?
class Defs extends Component{
    static displayName = 'Defs';
    static Item = DefsItem;
    static Use = DefsUse;

    shouldRender = false;
    getChildren = () => {
        return Children.map(this.props.children, child => {
            let {type} = child;

            if (type === LinearGradient || type === RadialGradient || type === ClipPath) {
                if (type === ClipPath) {
                    this.shouldRender = true;
                }

                return cloneElement(child, {
                    svgId: this.props.svgId
                });
            }
            if (child.props.id) {
                return <DefsItem
                    {...child.props}
                    svgId={this.props.svgId}
                >{child}</DefsItem>;
            }
        });
    };

    render() {
        let children = this.getChildren();
        return <NativeGroup opacity={this.shouldRender ? 1 : 0}>
            {children}
        </NativeGroup>;
    }
}

export default Defs;
