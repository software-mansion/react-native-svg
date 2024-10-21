import React, {Fragment} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Sample} from './types';

export default function composeComponents(
  components: Sample[],
  renderInView?: boolean,
) {
  const Wrapper = renderInView ? View : ScrollView;
  return function ComposedComponent() {
    return (
      <Wrapper
        {...(renderInView
          ? {style: {alignItems: 'center'}}
          : {
              contentContainerStyle: {
                alignItems: 'center',
                paddingVertical: 25,
              },
            })}>
        {components.map((Component, index) => (
          <Fragment key={index}>
            <ComponentTitle title={Component.title} />
            <Component />
            {index !== components.length - 1 && <Separator />}
          </Fragment>
        ))}
      </Wrapper>
    );
  };
}

function ComponentTitle({title}: {title?: string}) {
  if (!title) return null;
  return (
    <Text
      style={{
        marginHorizontal: 20,
        textAlign: 'center',
        marginBottom: 5,
      }}>
      {title}
    </Text>
  );
}

function Separator() {
  return (
    <View
      style={{
        height: 1,
        marginVertical: 24,
        width: '100%',
        backgroundColor: 'gray',
      }}
    />
  );
}
