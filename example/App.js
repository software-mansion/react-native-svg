import * as React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {AppTheme} from 'react-native-windows';
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import SVGExampleList from './SVGExampleList';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  navItem: {
    flexGrow: 1,
    flexShrink: 1,
    height: '100%',
    alignSelf: 'stretch',
  },
});

// @ts-ignore
function ScreenWrapper({navigation}) {
  const state = useNavigationState((state) => state);
  const Component = SVGExampleList[state.index].component;
  return (
    <View style={styles.container}>
      <Button title="Menu" onPress={() => navigation.openDrawer()} />
      <View style={styles.navItem}>
        <Component />
      </View>
    </View>
  );
}

// @ts-ignore
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close"
        onPress={() => props.navigation.closeDrawer()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  let screens = renderScreens();
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} drawerType="permanent" />
      )}>
      {screens}
    </Drawer.Navigator>
  );
}

function renderScreens() {
  const items = [];
  for (var i = 0; i < SVGExampleList.length; i++) {
    items.push(renderScreen(i));
  }

  return items;
}

function renderScreen(i: number) {
  return (
    <Drawer.Screen
      name={SVGExampleList[i].key}
      key={SVGExampleList[i].key}
      component={ScreenWrapper}
    />
  );
}

export default function App() {
  return (
    <NavigationContainer
      theme={AppTheme.currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MyDrawer />
    </NavigationContainer>
  );
}
