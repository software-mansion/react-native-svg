import React from "react";
import Path from "./Path";
import extractPolyPoints from "../lib/extract/extractPolyPoints";
import Shape from "./Shape";

export default class extends Shape {
    static displayName = "Polygon";

    static defaultProps = {
        points: "",
    };

    setNativeProps = props => {
        let { points } = props;
        if (points) {
            if (Array.isArray(points)) {
                points = points.join(",");
            }
            props.d = `M${extractPolyPoints(points)}`;
        }
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;
        let { points } = props;

        if (Array.isArray(points)) {
            points = points.join(",");
        }

        return (
            <Path
                ref={ele => {
                    this.root = ele;
                }}
                {...props}
                d={`M${extractPolyPoints(points)}z`}
            />
        );
    }
}
