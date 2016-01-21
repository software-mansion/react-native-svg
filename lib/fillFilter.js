import rgba from './rgba';
export default function (props) {
    return rgba(props.fill === undefined ? '#000' : props.fill, props.fillOpacity);
}
