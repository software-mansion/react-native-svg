import React, {Fragment} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Examples, Sample} from './types';

export default function composeComponents(
  components: Sample[] | Examples,
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
        {Array.isArray(components)
          ? components.map((Component, index) => (
              <Fragment key={index}>
                <ComponentTitle title={Component.title} />
                <Component />
                {index !== components.length - 1 && <Separator />}
              </Fragment>
            ))
          : null}
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
