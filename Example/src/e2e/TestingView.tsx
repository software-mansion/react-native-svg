import React, {Component, useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import * as RNSVG from 'react-native-svg';

const wsUri = 'ws://10.0.2.2:7123';

const TestingView = () => {
    const [renderedContent, setRenderedContent] = useState(<></>);
    const [wsClient, setWsClient] = useState<WebSocket>(new WebSocket(wsUri));
    const svgWrapperRef = useRef<RNSVG.Svg>(null);

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
            const message = JSON.parse(rawMessage)
            if (message.type == "renderRequest") {
                setRenderedContent(
                    createElementFromObject(message.data.type, message.data.props),
                );
            }
        };
        wsClient.onclose = event => {
            console.log(`E2E WebSocket connection has been closed (${event.code})`);
        };
    }, [wsClient]);

    useEffect(() => {
        svgWrapperRef.current?.toDataURL((base64RenderedImage) => {
            wsClient.send(JSON.stringify({
                type: "renderResponse",
                data: base64RenderedImage
            }))
        })
    }, [renderedContent])
    return <RNSVG.Svg ref={svgWrapperRef}>{renderedContent}</RNSVG.Svg>;
};

class TestingViewWrapper extends Component {
    static title = 'E2E Testing';

    render() {
        return <TestingView/>;
    }
}

const samples = [TestingViewWrapper];
const icon = (
    <RNSVG.Svg height="30" width="30" viewBox="0 0 20 20">
        <RNSVG.Circle
            cx="10"
            cy="10"
            r="8"
            stroke="purple"
            strokeWidth="1"
            fill="pink"
        />
    </RNSVG.Svg>
);

function isFabric(): boolean {
    // @ts-expect-error nativeFabricUIManager is not yet included in the RN types
    return !!global?.nativeFabricUIManager;
}

export {samples, icon};

const createElementFromObject = (
    element: keyof typeof RNSVG,
    props: any,
): any => {
    const children: any[] = [];
    if (props.children) {
        if (Array.isArray(props.children)) {
            props?.children.forEach((child: { type: any; props: any }) =>
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
    return React.createElement(RNSVG[element] as any, {...props, children,});
};
