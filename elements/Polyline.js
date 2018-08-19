import React, { Component } from "react";
import PropTypes from "prop-types";
import Path from "./Path";
import { pathProps } from "../lib/props";
import extractPolyPoints from "../lib/extract/extractPolyPoints";

export default class extends Component {
    static displayName = "Polyline";
    static propTypes = {
        ...pathProps,
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
            .isRequired
    };

    static defaultProps = {
        points: ""
    };

    setNativeProps = (...args) => {
        //noinspection JSUnresolvedFunction
        var points = [...args][0].points;
        if (points) {
            if (Array.isArray(points)) {
                points = points.join(",");
            }
            [...args][0].d = `M${extractPolyPoints(points)}`
        }
        this.root.setNativeProps(...args);
    };

    render() {
        let points = this.props.points;
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
