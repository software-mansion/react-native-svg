import React, {Component} from 'react';

import G from './G';
import extractViewbox from '../lib/extract/extractViewbox';
class ViewBox extends Component{
    static displayName = 'ViewBox';

    render() {
        let viewbox = extractViewbox(this.props);
        let scaleX = 1;
        let scaleY = 1;
        let x = 0;
        let y = 0;
        if (viewbox) {
            scaleX = viewbox.scaleX;
            scaleY = viewbox.scaleY;
            x = viewbox.x;
            y = viewbox.y;
        }

        return <G
            {...this.props}
            x={x}
            y={y}
            scaleX={scaleX}
            scaleY={scaleY}
            preserveAspectRatio={null}
            viewbox={null}
        >
            {(!scaleX || !scaleY) ? null : this.props.children}
        </G>;
    }
}

export default ViewBox;
