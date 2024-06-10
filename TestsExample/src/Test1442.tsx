import React from 'react';
import {Platform} from 'react-native';
import {Svg, Image} from 'react-native-svg';

export default function Test1442() {
  return <JPEGImageFromFile />;
}

const PNGImageFromUrl = () => {
  return (
    <Svg>
      <Image
        opacity="1"
        width={100}
        height={100}
        href={'https://static.thenounproject.com/png/1563361-200.png'}
        clipPath="url(#clip)"
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
        href={require('../images/arrow.png')}
        clipPath="url(#clip)"
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
        width={100}
        height={100}
        href={
          'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=6561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
        clipPath="url(#clip)"
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
        width={100}
        height={100}
        href={'../images/earth.jpg'}
        clipPath="url(#clip)"
        onLoad={e =>
          console.log(`${Platform.OS} load JPEG image from file`, e.nativeEvent)
        }
      />
    </Svg>
  );
};
