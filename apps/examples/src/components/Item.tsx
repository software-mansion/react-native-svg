import React from 'react';
import {Platform, Pressable, View, Text, TouchableOpacity} from 'react-native';
import {commonStyles} from '../commonStyles';

export interface ItemProps {
  icon?: any;
  title: string;
  onPress: () => void;
  wasClicked?: boolean;
}

export function Item({icon, title, onPress, wasClicked}: ItemProps) {
  const Button = Platform.OS === 'macos' ? Pressable : TouchableOpacity;
  return (
    <Button
      style={[commonStyles.button, wasClicked && commonStyles.visitedItem]}
      onPress={onPress}>
      {icon && (
        <>
          <View>{icon}</View>
          <Text>{'   '}</Text>
        </>
      )}

      <Text style={commonStyles.title}>{title}</Text>
    </Button>
  );
}
