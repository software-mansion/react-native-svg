import React from 'react';
import { BaseProps } from '../types';
import { SvgProps } from '../elements/Svg';
import { encodeSvg, getBoundingClientRect } from './utils';
import { createComponent } from './CreateWebComponent';

export class SvgComponent extends React.Component<BaseProps & SvgProps> {
  elementRef = React.createRef<SVGSVGElement & BaseProps & SvgProps>();

  toDataURL(
    callback: (data: string) => void,
    options: { width?: number; height?: number } = {}
  ) {
    const ref = this.elementRef.current;

    if (ref === null) {
      return;
    }

    const rect = getBoundingClientRect(ref);

    const width = Number(options.width) || rect.width;
    const height = Number(options.height) || rect.height;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.appendChild(ref.cloneNode(true));

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0);
      callback(canvas.toDataURL().replace('data:image/png;base64,', ''));
    };

    img.src = `data:image/svg+xml;utf8,${encodeSvg(
      new window.XMLSerializer().serializeToString(svg)
    )}`;
  }

  render() {
    const SvgComponent = createComponent<SvgProps & BaseProps>('svg');
    return <SvgComponent {...this.props} ref={this.elementRef} />;
  }
}
