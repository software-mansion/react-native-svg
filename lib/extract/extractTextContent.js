import React, {
    Children
} from 'react';

import TSpan from '../../elements/TSpan';
const newLine = /\n/g;

export default function(children) {
    let spans = [];

    Children.forEach(children, function (child = '') {
        let span;
        if (typeof child === 'string') {
            span = <TSpan>{child.replace(newLine, ' ')}</TSpan>;
        } else if (child.type === TSpan) {
            span = child;
        } else {
            // give warning about the illegal child type
            return;
        }

        spans.push(span);
    });

    return spans;
}
