import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

// Test 1: Overlapping circles should UNION (no hole at overlap)
// Per SVG spec, clipPath children combine via UNION, so overlap should be solid green
const unionTest = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <clipPath id="clip-union">
      <circle cx="35" cy="50" r="25"/>
      <circle cx="65" cy="50" r="25"/>
    </clipPath>
  </defs>
  <rect width="100" height="100" fill="lightgray"/>
  <rect x="0" y="0" width="100" height="100" fill="green" clip-path="url(#clip-union)"/>
</svg>`;

// Test 2: clip-rule="evenodd" - overlapping circles as single path
// evenodd: overlap region becomes a HOLE (XOR-like behavior)
// Same geometry as UNION test: circles at (35,50) and (65,50) with r=25
const evenoddTest = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <clipPath id="clip-evenodd">
      <path clip-rule="evenodd" d="M35,25 a25,25 0 1,1 0,50 a25,25 0 1,1 0,-50 M65,25 a25,25 0 1,1 0,50 a25,25 0 1,1 0,-50"/>
    </clipPath>
  </defs>
  <rect width="100" height="100" fill="lightgray"/>
  <rect x="0" y="0" width="100" height="100" fill="blue" clip-path="url(#clip-evenodd)"/>
</svg>`;

// Test 3: clip-rule="nonzero" - same overlapping circles as single path
// nonzero: overlap region stays FILLED (OR-like behavior)
const nonzeroTest = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <clipPath id="clip-nonzero">
      <path clip-rule="nonzero" d="M35,25 a25,25 0 1,1 0,50 a25,25 0 1,1 0,-50 M65,25 a25,25 0 1,1 0,50 a25,25 0 1,1 0,-50"/>
    </clipPath>
  </defs>
  <rect width="100" height="100" fill="lightgray"/>
  <rect x="0" y="0" width="100" height="100" fill="red" clip-path="url(#clip-nonzero)"/>
</svg>`;

// Test 4: Multiple overlapping evenodd children (donuts)
// Each child: concentric circles with evenodd → donut with center hole
// Children overlap → union (solid where rings overlap, each keeps its center hole)
const multiEvenoddTest = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <clipPath id="clip-multi-evenodd">
      <path clip-rule="evenodd" d="M35,50 m-22,0 a22,22 0 1,0 44,0 a22,22 0 1,0 -44,0 m14,0 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0"/>
      <path clip-rule="evenodd" d="M65,50 m-22,0 a22,22 0 1,0 44,0 a22,22 0 1,0 -44,0 m14,0 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0"/>
    </clipPath>
  </defs>
  <rect width="100" height="100" fill="lightgray"/>
  <rect x="0" y="0" width="100" height="100" fill="purple" clip-path="url(#clip-multi-evenodd)"/>
</svg>`;

export default function Test2198() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ClipPath Tests (PR #2198)</Text>
      <View style={styles.row}>
        <View style={styles.testCase}>
          <SvgXml xml={unionTest} />
          <View style={styles.caption}>
            <Text style={styles.label}>UNION</Text>
            <Text style={styles.sublabel}>Overlap = solid</Text>
          </View>
        </View>
        <View style={styles.testCase}>
          <SvgXml xml={evenoddTest} />
          <View style={styles.caption}>
            <Text style={styles.label}>evenodd</Text>
            <Text style={styles.sublabel}>Center = hole</Text>
          </View>
        </View>
        <View style={styles.testCase}>
          <SvgXml xml={nonzeroTest} />
          <View style={styles.caption}>
            <Text style={styles.label}>nonzero</Text>
            <Text style={styles.sublabel}>Center = filled</Text>
          </View>
        </View>
        <View style={styles.testCase}>
          <SvgXml xml={multiEvenoddTest} />
          <View style={styles.caption}>
            <Text style={styles.label}>multi-eo</Text>
            <Text style={styles.sublabel}>Holes + union</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  testCase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  caption: {
    width: 80,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sublabel: {
    fontSize: 10,
    color: '#666',
  },
});
