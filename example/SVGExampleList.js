'use strict';
import React from 'react';
import {RectPage} from './examples/Rect';
import {Welcome} from './Welcome';
// import {SettingsPage} from './SettingsPage';
// import {TemplateExamplePage} from './examples/TemplateExamplePage';
// import {CheckBoxExamplePage} from './examples/CheckBoxExamplePage';
// import {ConfigExamplePage} from './examples/ConfigExamplePage';
// import {DatePickerExamplePage} from './examples/DatePickerExamplePage';
// import {TimePickerExamplePage} from './examples/TimePickerExamplePage';
// import {SketchExamplePage} from './examples/SketchExamplePage';
// import {SliderExamplePage} from './examples/SliderExamplePage';
// import {PermissionsExamplePage} from './examples/PermissionsExamplePage';
// import {PickerExamplePage} from './examples/PickerExamplePage';
// import {PrintExamplePage} from './examples/PrintExamplePage';
// import {DeviceInfoExamplePage} from './examples/DeviceInfoExamplePage';
// import {TextExamplePage} from './examples/TextExamplePage';
// import {TextInputExamplePage} from './examples/TextInputExamplePage';
// import {SwitchExamplePage} from './examples/SwitchExamplePage';
// import {ViewExamplePage} from './examples/ViewExamplePage';
// import {ImageExamplePage} from './examples/ImageExamplePage';
// import {PressableExamplePage} from './examples/PressableExamplePage';
// import {FlatListExamplePage} from './examples/FlatListExamplePage';
// import {ScrollViewExamplePage} from './examples/ScrollViewExample';
// import {WebViewExamplePage} from './examples/WebViewExamplePage';
// import {SensitiveInfoExamplePage} from './examples/SensitiveInfoExamplePage';
// import {PopupExamplePage} from './examples/PopupExamplePage';
// import {FlyoutExamplePage} from './examples/FlyoutExamplePage';

interface ISVGExample {
  key: string;
  component: React.ElementType;
}

export const SVGExampleList: Array<ISVGExample> = [
{
    key: 'Welcome',
    component: Welcome,
  },
  {
    key: 'Rect',
    component: RectPage,
  },
];

export default SVGExampleList;
