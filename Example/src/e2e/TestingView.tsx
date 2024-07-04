import React, {Component, ReactNode, useEffect, useRef, useState} from 'react';
import {Svg, Circle} from 'react-native-svg';
import {Platform} from 'react-native';

const wsUri = 'ws://10.0.2.2:7123';

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
      console.log(rawMessage);
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
    return <TestingView />;
  }
}

const samples = [TestingViewWrapper];
const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="10" r="8" stroke="purple" strokeWidth="1" fill="pink" />
  </Svg>
);

function isFabric(): boolean {
  // @ts-expect-error nativeFabricUIManager is not yet included in the RN types
  return !!global?.nativeFabricUIManager;
}

export {samples, icon};
