import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {SvgProps, SvgUri} from '../../../src';
import {SvgCssUri} from 'react-native-svg/css';

const svgDataUri =
  'data:image/svg+xml;base64,' +
  btoa(`
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" fill="pink">
     <ellipse cx="30" cy="30" rx="30" ry="15" fill="yellow" />
    </svg>
    `);

const cssSvgDataUri =
  'data:image/svg+xml;base64,' +
  btoa(`
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <style>
        .small { font: italic 13px sans-serif; }
      </style>
      <rect x="0" y="0" width="100" height="100" fill="yellow" />
      <text x="20" y="35" class="small">CSS Styled</text>
    </svg>
`);

const calculateWidth = (svgProps: SvgProps, desiredHeight: number) => {
  let originalHeight = svgProps.height;
  let originalWidth = svgProps.width;
  if (originalWidth && originalHeight) {
    return (Number(originalWidth) / Number(originalHeight)) * desiredHeight;
  }
};

const ExampleWithSvgUri = () => {
  const [width, setWidth] = useState(0);
  const height = 12;

  const handleLoad = (svgProps: SvgProps) => {
    const calculatedWidth = calculateWidth(svgProps, height);
    if (calculatedWidth) {
      setWidth(calculatedWidth);
    }
  };
  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 24, color: '#fff'}}>SvgUri component</Text>

      <Text style={{marginTop: 10, color: '#fff'}}>Original Size ✅</Text>
      <SvgUri style={{backgroundColor: 'blue'}} uri={svgDataUri} />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Set different height ❌
      </Text>
      <SvgUri
        style={{backgroundColor: 'red'}}
        uri={svgDataUri}
        height={height}
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Preserve Aspect Ratio Meet ❌
      </Text>
      <SvgUri
        style={{backgroundColor: 'red'}}
        uri={svgDataUri}
        height={height}
        preserveAspectRatio="xMinYMid meet"
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Preserve Aspect Ratio Slice ❌
      </Text>
      <SvgUri
        style={{backgroundColor: 'red'}}
        uri={svgDataUri}
        height={height}
        preserveAspectRatio="xMinYMid slice"
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Preserve Aspect Ratio None ❌
      </Text>
      <SvgUri
        style={{backgroundColor: 'red'}}
        uri={svgDataUri}
        height={height}
        preserveAspectRatio="none"
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Auto calculate width ✅
      </Text>
      <SvgUri
        style={{backgroundColor: 'green'}}
        uri={svgDataUri}
        height={height}
        width={width}
        onLoad={handleLoad}
      />
    </View>
  );
};

const ExampleWithSvgCssUri = () => {
  const [width, setWidth] = useState(0);
  const height = 25;
  const handleLoad = (svgProps: SvgProps) => {
    const calculatedWidth = calculateWidth(svgProps, height);
    if (calculatedWidth) {
      setWidth(calculatedWidth);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 24, color: '#fff'}}>SvgCssUri component</Text>

      <Text style={{marginTop: 10, color: '#fff'}}>Original Size ✅</Text>
      <SvgCssUri style={{backgroundColor: 'blue'}} uri={cssSvgDataUri} />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Set different height ❌
      </Text>
      <SvgCssUri
        style={{backgroundColor: 'red'}}
        height={height}
        uri={cssSvgDataUri}
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Preserve Aspect Ratio Meet ❌
      </Text>
      <SvgCssUri
        style={{backgroundColor: 'red'}}
        height={height}
        uri={cssSvgDataUri}
        preserveAspectRatio="xMinYMid meet"
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Preserve Aspect Ratio Slice ❌
      </Text>
      <SvgCssUri
        style={{backgroundColor: 'red'}}
        height={height}
        uri={cssSvgDataUri}
        preserveAspectRatio="xMinYMid slice"
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Preserve Aspect Ratio None ❌
      </Text>
      <SvgCssUri
        style={{backgroundColor: 'red'}}
        height={height}
        uri={cssSvgDataUri}
        preserveAspectRatio="none"
      />

      <Text style={{marginTop: 10, color: '#fff'}}>
        Auto calculate width ✅
      </Text>
      <SvgCssUri
        style={{backgroundColor: 'green'}}
        height={height}
        uri={cssSvgDataUri}
        width={width}
        onLoad={handleLoad}
      />
    </View>
  );
};

export default () => {
  return (
    <View style={{flex: 1, padding: 10, flexDirection: 'row'}}>
      <ExampleWithSvgUri />
      <ExampleWithSvgCssUri />
    </View>
  );
};
