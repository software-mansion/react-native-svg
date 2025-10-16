import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, Text, View} from 'react-native';
import * as RNSVG from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

const address = ['ios', 'web'].includes(Platform.OS) ? 'localhost' : '10.0.2.2';
const wsUri = `ws://${address}:7123`;

export const TestingView = () => {
  const wrapperRef = useRef<ViewShot>(null);
  const [wsClient, setWsClient] = useState<WebSocket | null>(null);
  const [renderedContent, setRenderedContent] =
    useState<React.ReactElement | null>();
  const [readyToSnapshot, setReadyToSnapshot] = useState(false);
  const [resolution, setResolution] = useState({width: 0, height: 0}); // placeholder value, later updated by incoming render requests
  const [message, setMessage] = useState('⏳ Connecting to Jest server...');

  const connect = useCallback(() => {
    setMessage('⏳ Connecting to Jest server...');
    const startTime = Date.now();
    const MAX_TIMEOUT = 10000;
    let client = null;

    const attemptConnect = () => {
      client = new WebSocket(wsUri);
      setWsClient(client);

      client.onopen = () => {
        client.send(
          JSON.stringify({
            os: Platform.OS,
            version: Platform.Version,
            arch: isFabric() ? 'fabric' : 'paper',
            connectionTime: new Date(),
          }),
        );

        setMessage('✅ Connected to Jest server. Waiting for render requests.');
      };

      client.onerror = (err: any) => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= MAX_TIMEOUT) {
          setMessage(`❌ Failed to connect within ${MAX_TIMEOUT} milliseconds`);
          return;
        }

        console.error(
          `Error connecting to E2E WebSocket at ${wsUri}: ${
            err.message ?? ''
          }. Retrying...`,
        );
        setMessage(`🚨 Failed to connect: ${err.message ?? ''}. Retrying...`);
        setTimeout(attemptConnect, 500);
      };

      client.onmessage = ({data: rawMessage}) => {
        const message = JSON.parse(rawMessage);
        if (message.type === 'renderRequest') {
          setMessage(`✅ Rendering tests, please don't close this tab.`);
          const {width, height} = message;
          setResolution({width, height});
          setRenderedContent(
            createElementFromObject(
              message.data.type || 'SvgFromXml',
              message.data.props,
            ),
          );
          setReadyToSnapshot(true);
        }
      };

      client.onclose = event => {
        if (event.code === 1006 && event.reason) return;
        setMessage(
          `✅ Connection closed. You can close this tab safely. (${event.code})`,
        );
      };
    };

    attemptConnect();

    return () => {
      setWsClient(null);
      client.close();
    };
  }, [wsClient]);

  // Create initial connection when rendering the view
  useEffect(connect, []);

  // Whenever new content is rendered, send renderResponse with snapshot view
  useEffect(() => {
    if (!readyToSnapshot || !wrapperRef.current) {
      return;
    }
    wrapperRef.current.capture?.().then((value: string) => {
      wsClient?.send(
        JSON.stringify({
          type: 'renderResponse',
          data: value,
        }),
      );
      setReadyToSnapshot(false);
    });
  }, [wrapperRef, readyToSnapshot]);

  return (
    <View>
      <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>{message}</Text>
      <ViewShot
        ref={wrapperRef}
        style={{...resolution}}
        options={{result: 'base64'}}>
        {renderedContent}
      </ViewShot>
    </View>
  );
};

function isFabric(): boolean {
  // @ts-expect-error nativeFabricUIManager is not yet included in the RN types
  return !!global?.nativeFabricUIManager;
}

const createElementFromObject = (
  element: keyof typeof RNSVG,
  props: any,
): React.ReactElement => {
  const children: any[] = [];
  if (props.children) {
    if (Array.isArray(props.children)) {
      props?.children.forEach((child: {type: any; props: any}) =>
        children.push(createElementFromObject(child.type, child?.props)),
      );
    } else if (typeof props.children === 'object') {
      children.push(
        createElementFromObject(props.children.type, props.children?.props),
      );
    } else {
      children.push(props.children);
    }
  }
  return React.createElement(RNSVG[element] as any, {...props, children});
};
