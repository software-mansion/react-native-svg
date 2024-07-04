import React, {Component, useEffect, useRef, useState} from 'react';
import {
    Svg,
    Circle,
    Ellipse,
    G,
    Text,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use, Image, Marker, Mask, Pattern, ClipPath, Stop, RadialGradient, LinearGradient, Defs
} from 'react-native-svg';
import {Platform} from 'react-native';
import {deserialize} from "./asd";

const wsUri = 'ws://10.0.2.2:7123';
const tags = {
    svg: Svg,
    circle: Circle,
    ellipse: Ellipse,
    g: G,
    text: Text,
    tspan: TSpan,
    textPath: TextPath,
    path: Path,
    polygon: Polygon,
    polyline: Polyline,
    line: Line,
    rect: Rect,
    use: Use,
    image: Image,
    symbol: Symbol,
    defs: Defs,
    linearGradient: LinearGradient,
    radialGradient: RadialGradient,
    stop: Stop,
    clipPath: ClipPath,
    pattern: Pattern,
    mask: Mask,
    marker: Marker
};
const TestingView = () => {
    const [renderedContent, setRenderedContent] = useState(<></>);
    const [wsClient, setWsClient] = useState<WebSocket>(new WebSocket(wsUri));
    const svgWrapperRef = useRef<Svg>(null);

    useEffect(() => {
        wsClient.onopen = () => {
            wsClient.send(
                JSON.stringify({
                    os: Platform.OS,
                    version: Platform.Version,
                    arch: isFabric() ? 'fabric' : 'paper',
                }),
            );
        };
        //todo: find out why there is 1005 close when closing WS on Jest side
        wsClient.onerror = err => {
            console.log(err);
            if (!err) {
                // when gracefully stopping WS, the err is null however the callback is still being called for some reason
                return;
            }
            console.error(
                `Error while connecting to E2E WebSocket server at ${wsUri}: ${err.message}. Reopen this tab to retry.`,
            );
        };
        wsClient.onmessage = ({data: rawMessage}) => {
            console.log(rawMessage)

            const message = JSON.parse(rawMessage)
            if (message.type == "renderRequest") {
                //todo: create element from message.data
                //setRenderedContent(element)
            }
        };
        wsClient.onclose = event => {
            console.log(`E2E WebSocket connection has been closed (${event.code})`);
        };
    }, [wsClient]);

    return <Svg ref={svgWrapperRef}>{renderedContent}</Svg>;
};

class TestingViewWrapper extends Component {
    static title = 'E2E Testing';

    render() {
        return <TestingView/>;
    }
}

const samples = [TestingViewWrapper];
const icon = (
    <Svg height="30" width="30" viewBox="0 0 20 20">
        <Circle cx="10" cy="10" r="8" stroke="purple" strokeWidth="1" fill="pink"/>
    </Svg>
);

function isFabric(): boolean {
    // @ts-expect-error nativeFabricUIManager is not yet included in the RN types
    return !!global?.nativeFabricUIManager;
}

export {samples, icon};

const createElementFromObject = (element: string, props: any): any => {
    const children: any[] = [];
    if (props.children) {
        if (Array.isArray(props.children)) {
            props?.children.forEach((child: { type: any; props: any; }) =>
                children.push(createElementFromObject(child.type, child?.props)),
            );
            console.log(children);
        } else if (typeof props.children === 'object') {
            children.push(
                createElementFromObject(props.children.type, props.children?.props),
            );
        } else {
            children.push(props.children);
        }
    }
    // @ts-ignore
    return React.createElement(tags[element], {...props, children});
};
