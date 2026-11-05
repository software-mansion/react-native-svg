import React, {useEffect, useRef, useState} from 'react';
import {Animated, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ClipPath, Defs, Mask, Path, Rect, Svg} from 'react-native-svg';

const W = 280;
const H = 56;
const PERIOD = 1200;

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function useNativeDriverSweep() {
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, {
          toValue: W,
          duration: PERIOD,
          useNativeDriver: true,
        }),
        Animated.timing(sweep, {
          toValue: 0,
          duration: PERIOD,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [sweep]);

  return sweep;
}

function useStateSweep() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (start === 0) {
        start = now;
      }
      const phase = ((now - start) % (PERIOD * 2)) / PERIOD;
      setWidth(W * (phase > 1 ? 2 - phase : phase));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return width;
}

type CaseProps = {
  title: string;
  expectation: string;
  children: React.ReactNode;
};

function Case({title, expectation, children}: CaseProps) {
  return (
    <View style={styles.case}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.expectation}>{expectation}</Text>
      {children}
    </View>
  );
}

function ClipPathRectCase() {
  const sweep = useNativeDriverSweep();

  return (
    <Case
      title="1. Rect width in ClipPath (Animated, native driver)"
      expectation="The repro from #2473. Must sweep; painted once and froze before the fix.">
      <Svg width={W} height={H}>
        <Defs>
          <ClipPath id="clip2473rect">
            <AnimatedRect x={0} y={0} width={sweep} height={H} />
          </ClipPath>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="#3b6cf5"
          clipPath="url(#clip2473rect)"
        />
      </Svg>
    </Case>
  );
}

function ClipPathPathCase() {
  const width = useStateSweep();

  return (
    <Case
      title="2. Path d in ClipPath (plain prop update)"
      expectation="A second renderable subclass, driven by a plain d prop rather than Animated. Must sweep.">
      <Svg width={W} height={H}>
        <Defs>
          <ClipPath id="clip2473path">
            <Path d={`M0 0 H ${width} V ${H} H 0 Z`} />
          </ClipPath>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="#8b5cf6"
          clipPath="url(#clip2473path)"
        />
      </Svg>
    </Case>
  );
}

function MaskCase() {
  const sweep = useNativeDriverSweep();

  return (
    <Case
      title="3. Rect width in Mask (control)"
      expectation="Mask draws its content, so this already worked. Must keep sweeping.">
      <Svg width={W} height={H}>
        <Defs>
          <Mask id="mask2473">
            <AnimatedRect x={0} y={0} width={sweep} height={H} fill="white" />
          </Mask>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="#10b981"
          mask="url(#mask2473)"
        />
      </Svg>
    </Case>
  );
}

function StaticClipCase() {
  return (
    <Case
      title="4. Static ClipPath (control)"
      expectation="Nothing changes, so the path cache should still hold. Must render a steady half-width bar.">
      <Svg width={W} height={H}>
        <Defs>
          <ClipPath id="clip2473static">
            <Rect x={0} y={0} width={W / 2} height={H} />
          </ClipPath>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill="#f59e0b"
          clipPath="url(#clip2473static)"
        />
      </Svg>
    </Case>
  );
}

export default function Test3023() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>ClipPath child invalidation</Text>
      <Text style={styles.subheading}>
        Cases 1 and 2 must animate. Case 3 must keep animating. Case 4 must stay
        still.
      </Text>
      <ClipPathRectCase />
      <ClipPathPathCase />
      <MaskCase />
      <StaticClipCase />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {padding: 16, gap: 20},
  heading: {fontSize: 18, fontWeight: '600'},
  subheading: {fontSize: 13, opacity: 0.7},
  case: {gap: 4},
  title: {fontSize: 14, fontWeight: '600'},
  expectation: {fontSize: 12, opacity: 0.7, lineHeight: 16},
});
