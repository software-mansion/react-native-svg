import extractTextContent from './extractTextContent';
import extractSpan from './extractSpan';

const anchors = {
    end: 1,
    middle: 2,
    start: 0
};

export default function(props) {
    let children = extractTextContent(props.children);
    let extractedProps = extractSpan(props);
    let firstSpan = children[0];
    let alignment;
    let {dx, dy} = extractedProps;
    let maxDeltaLength = Math.max(dx.length, dy.length);

    if (firstSpan && firstSpan.props.hasOwnProperty('textAnchor')) {
        alignment = anchors[firstSpan.props.textAnchor];
    } else if (anchors[props.textAnchor]) {
        alignment = anchors[props.textAnchor];
    }

    if (!alignment) {
        alignment = 0;
    }

    for (let i = 0; i < maxDeltaLength; i++) {
        console.log(i);
    }

    console.log(extractedProps);

    return {
        alignment,
        children,
        fontFamily: 'Helvetica Neue',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'normal',
        ...extractedProps
    }
}
