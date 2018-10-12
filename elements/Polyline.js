import React from "react";
import PropTypes from "prop-types";
import Path from "./Path";
import { pathProps } from "../lib/props";
import extractPolyPoints from "../lib/extract/extractPolyPoints";
import Shape from "./Shape";

export default class extends Shape {
    static displayName = "Polyline";
    static propTypes = {
        ...pathProps,
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
            .isRequired,
    };

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
                {...this.props}
                d={`M${extractPolyPoints(points)}`}
            />
        );
    }
}
