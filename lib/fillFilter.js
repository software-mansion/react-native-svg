let noneFill = ['transparent', 'none'];
export default function (props) {
    let fill = props.fill;
    if (noneFill.indexOf('fill') !== -1) {
        return null;
    }
    return fill;
}
