import React, { useEffect, useState } from 'react';
import SvgXml, { SvgProps } from './SvgXml.web';
import { UriProps } from './commonTypes';
import { fetchText } from './utils';

const err = console.error.bind(console);
const SvgUri = React.forwardRef<HTMLOrSVGElement, UriProps>(
  (props: UriProps, forwardRef) => {
    const { onError = err, uri, onLoad, fallback } = props;
    const [xml, setXml] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    useEffect(() => {
      uri
        ? fetchText(uri)
            .then((data) => {
              setXml(data);
              isError && setIsError(false);
              onLoad?.();
            })
            .catch((e) => {
              onError(e);
              setIsError(true);
            })
        : setXml(null);
    }, [onError, uri, onLoad]);
    if (isError) {
      return fallback ?? null;
    }
    return <SvgXml ref={forwardRef} xml={xml} override={props as SvgProps} />;
  }
);

export default SvgUri;
