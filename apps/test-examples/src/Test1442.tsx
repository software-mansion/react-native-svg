import React, {useState} from 'react';
import {ImageLoadEventData, Platform, Image as RNImage} from 'react-native';
import {Svg, Image} from 'react-native-svg';

export default function Test1442() {
  return <TestWithStrictSize />;
}

function TestRNImage() {
  const [state, setState] = useState<ImageLoadEventData>();
  console.log(`${Platform.OS} state:`, state);

  return (
    <RNImage
      style={{
        width: state?.source?.width || '100%',
        height: state?.source?.height || '100%',
      }}
      source={{
        uri: 'https://image-placeholder.com/images/actual-size/75x75.png',
      }}
      onLoad={e => {
        setState(e.nativeEvent.source as any);
        console.log(
          `RNImage:${Platform.OS} load PNG image from url with strict size`,
          e.nativeEvent,
        );
      }}
    />
  );
}
function TestWithStrictSize(): React.JSX.Element {
  const [state, setState] = useState<ImageLoadEventData | undefined>();
  console.log(`${Platform.OS} state:`, state);
  return (
    <Svg>
      <Image
        width={state?.source?.width || '100%'}
        height={state?.source?.height || '100%'}
        href={'https://image-placeholder.com/images/actual-size/75x75.png'}
        onLoad={e => {
          setState(e.nativeEvent);
          console.log(
            `Image:${Platform.OS} load PNG image from url with strict size`,
            e.nativeEvent,
          );
        }}
      />
    </Svg>
  );
}

const PNGImageFromUrl = () => {
  return (
    <Svg>
      <Image
        opacity="1"
        width={100}
        height={100}
        href={'https://static.thenounproject.com/png/1563361-200.png'}
        onLoad={e =>
          console.log(`${Platform.OS} load png image from url`, e.nativeEvent)
        }
      />
    </Svg>
  );
};

const PNGImageFromFile = () => {
  return (
    <Svg>
      <Image
        opacity="1"
        width={100}
        height={100}
        href={require('../assets/arrow.png')}
        onLoad={e =>
          console.log(`${Platform.OS} load png image from file`, e.nativeEvent)
        }
      />
    </Svg>
  );
};

const JPEGImageFromUrl = () => {
  return (
    <Svg>
      <Image
        opacity="1"
        width={'100%'}
        height={'100%'}
        href={
          'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=6561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
        onLoad={e =>
          console.log(`${Platform.OS} load JPEG image from url`, e.nativeEvent)
        }
      />
    </Svg>
  );
};

const JPEGImageFromFile = () => {
  return (
    <Svg>
      <Image
        opacity="1"
        width={'100%'}
        height={'100%'}
        href={require('../assets/earth.jpg')}
        onLoad={e =>
          console.log(`${Platform.OS} load JPEG image from file`, e.nativeEvent)
        }
      />
    </Svg>
  );
};
