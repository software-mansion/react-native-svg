import extractSpan from './extractSpan';
import extractTextContent from './extractTextContent';

export default function (props) {
    let {children, line} = props;
    let extractedProps = extractSpan(props);

    if (typeof children === 'string') {
        line = children;
        children = null;
    } else {
        children = extractTextContent(props.children);
        line = null;
    }
    console.log(extractedProps);
    return {
        ...extractedProps,
        children,
        line
    };
};
