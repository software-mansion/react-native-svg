import Shape from './Shape';
export default class extends Shape {

    render() {
        return <image {...this.props} />;
    }
}
