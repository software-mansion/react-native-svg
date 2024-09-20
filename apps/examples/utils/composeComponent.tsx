import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {Fragment} from 'react';

// it takes an array of components [SvgExample, SvgOpacity, SvgViewbox, SvgLayout]
// these components have prop .title
// e.g. SvgExample.title = 'SVG TEST';

/**
 * Composes a single component from an array of components.
 * @param {Array} components - The array of React component types to compose.
 * @returns {React.Component} A new component that renders all the given components.
 */
export default function composeComponents(components: any[]) {
  return function ComposedComponent() {
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 25,
        }}>
        {components.map((Component, index) => (
          <Fragment key={index}>
            {Component.title && (
              <Text
                style={{
                  marginHorizontal: 20,
                  textAlign: 'center',
                  marginBottom: 5,
                }}>
                {Component.title}
              </Text>
            )}
            <Component />
            {index !== components.length - 1 && <Separator />}
          </Fragment>
        ))}
      </ScrollView>
    );
  };
}

function Separator() {
  return (
    <>
      <View style={{height: 25}} />
      <View style={{height: 1, width: '100%', backgroundColor: 'gray'}}></View>
      <View style={{height: 25}} />
    </>
  );
}
