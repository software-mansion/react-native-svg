import React, {useState} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {commonStyles} from './utils/commonStyles';
import {Examples, NavigationProp} from './utils/types';

export type ListScreenProps = {
  navigation: NavigationProp;
  examples: Examples;
};

export function ListScreen({navigation, examples}: ListScreenProps) {
  const [wasClicked, setWasClicked] = useState<string[]>([]);

  return (
    <FlatList
      removeClippedSubviews={false}
      data={Object.keys(examples) as (keyof typeof examples)[]}
      style={commonStyles.list}
      contentInsetAdjustmentBehavior="scrollableAxes"
      numColumns={Platform.OS === 'macos' ? 2 : 1}
      scrollEnabled={Platform.OS !== 'macos'}
      renderItem={({item: name}) => (
        <Item
          icon={examples[name].icon}
          title={name}
          onPress={() => {
            navigation.navigate(name as any);
            if (!wasClicked.includes(name)) {
              setTimeout(() => setWasClicked([...wasClicked, name]), 500);
            }
          }}
          wasClicked={wasClicked.includes(name)}
        />
      )}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
}

function ItemSeparator() {
  return <View style={commonStyles.separator} />;
}
type ItemProps = {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  wasClicked?: boolean;
};
function Item({icon, title, onPress, wasClicked}: ItemProps) {
  const Button = Platform.OS === 'macos' ? Pressable : TouchableOpacity;
  return (
    <Button
      style={[commonStyles.button, wasClicked && commonStyles.visitedItem]}
      onPress={onPress}>
      {icon && <View style={{marginRight: 12}}>{icon}</View>}
      <Text style={commonStyles.title}>{title}</Text>
    </Button>
  );
}
