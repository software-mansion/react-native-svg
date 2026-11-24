import * as React from 'react';
import {Button, Text, View} from 'react-native';
import Svg, {Circle, G, Path, Rect, Text as SvgText} from 'react-native-svg';

const DRAWINGS = 20;
const RECTS_PER_DRAWING = 30;
const MOUNT_DELAY_MS = 1500;
const SHAPES = ['Rect', 'Circle', 'Path', 'G', 'Text'] as const;

type Shape = (typeof SHAPES)[number];

function Drawing({index}: {index: number}) {
  return (
    <Svg width={64} height={64}>
      {Array.from({length: RECTS_PER_DRAWING}, (_, rect) => (
        <Rect
          key={rect}
          x={(rect % 6) * 10}
          y={Math.floor(rect / 6) * 12}
          width={8}
          height={10}
          fill={`hsl(${(index * 18 + rect * 12) % 360}, 70%, 55%)`}
        />
      ))}
    </Svg>
  );
}

function ManyElements() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), MOUNT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={{alignItems: 'center'}}>
      <Text testID="many-elements-state">
        {mounted ? `${DRAWINGS * RECTS_PER_DRAWING} rects mounted` : 'Waiting'}
      </Text>
      {mounted ? (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', width: 320}}>
          {Array.from({length: DRAWINGS}, (_, index) => (
            <Drawing key={index} index={index} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function LayoutListeners() {
  const [listening, setListening] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [counts, setCounts] = React.useState<Record<Shape, number>>({
    Rect: 0,
    Circle: 0,
    Path: 0,
    G: 0,
    Text: 0,
  });
  const listener = (shape: Shape) =>
    listening
      ? () => setCounts(current => ({...current, [shape]: current[shape] + 1}))
      : undefined;
  return (
    <View style={{alignItems: 'center'}}>
      <Svg width={300} height={120}>
        <Rect
          x={10 + offset}
          y={10}
          width={40}
          height={40}
          fill="tomato"
          onLayout={listener('Rect')}
        />
        <Circle
          cx={90 + offset}
          cy={30}
          r={20}
          fill="teal"
          onLayout={listener('Circle')}
        />
        <Path
          d={`M${130 + offset} 10 h40 v40 h-40 z`}
          fill="gold"
          onLayout={listener('Path')}
        />
        <G onLayout={listener('G')}>
          <Rect x={190 + offset} y={10} width={40} height={40} fill="purple" />
        </G>
        <SvgText
          x={10 + offset}
          y={90}
          fontSize={20}
          fill="black"
          onLayout={listener('Text')}>
          Layout
        </SvgText>
      </Svg>
      <Text testID="layout-event-counts">
        {SHAPES.map(shape => `${shape} ${counts[shape]}`).join(', ')}
      </Text>
      <Button
        title={listening ? 'Remove onLayout' : 'Add onLayout'}
        onPress={() => setListening(current => !current)}
      />
      <Button title="Move" onPress={() => setOffset(current => current + 10)} />
    </View>
  );
}

export default function Test3135() {
  const [showListeners, setShowListeners] = React.useState(false);
  return (
    <View style={{flex: 1, paddingTop: 80}}>
      <Button
        title={showListeners ? 'Show many elements' : 'Show layout listeners'}
        onPress={() => setShowListeners(current => !current)}
      />
      {showListeners ? <LayoutListeners /> : <ManyElements />}
    </View>
  );
}
