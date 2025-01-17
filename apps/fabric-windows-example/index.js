/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from '../common/noNavigationApp';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);


AppRegistry.registerComponent("Example", () => App);
