### react-native-art-svg

------------------------

`react-native-art-svg` is built to provide a SVG interface to react native on both iOS and Android which is based on *ART*

#### Features

1. Supports most of SVG elements and properties(Rect, Circle, Line, Polyline, Polygon, G ...).
2. 100% based on ReactNative`s ART library
3. Easy to convert SVG code into ReactNative code.

![example](./screenShoots/art-svg.gif)

#### Install

`npm install react-native-art-svg`

##### On iOS we should add import `ART` library into your project

To add ART.xcodeproj find the file located in react-native/Libraries/ART/ART.xcodeproj and just drag it over to the Libraries section in XCode. That should look like so

![Add ART.xcodeproj to Libraries](./screenShoots/addXcodeproj.png)

Next we’ll link the binary.

With the root project selected on the left, select `Build Phases` from the center view. There will be a section called “Link Binary With Libraries”, expand it, press the + and select `libART.a`

Like so

![Link binary](./screenShoots/linkBinary.png)

([Getting react art running on react native](http://browniefed.com/blog/2015/05/03/getting-react-art-running-on-react-native/))

##### On android

react-native\`s `ART` for android is shipped within react-native@0.18.0

#### Usage

There is an easy example

```
import Svg,{
    Circle
} from 'react-native-art-svg';

class SvgExample extends Component {
    render() {
        return (
            <Svg
                height="100"
                width="100"
            >
                <Circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="blue"
                    strokeWidth="2.5"
                    fill="green"
                />
                <Rect
                    x="15"
                    y="15"
                    width="70"
                    height="70"
                    stroke="red"
                    strokeWidth="2"
                    fill="yellow"
                />
            </Svg>
        );
    }
}

```

This will draw a graphics like this
![SVG example](./screenShoots/svg.png)

#### Common props:

Name            | Default    | Description
----------------|------------|--------------
fill            | '#000'     | The fill prop refers to the color inside the shape.
stroke          | 'none'     | The stroke prop controls how the outline of a shape appears.
strokeWidth     | 1          | The strokeWidth prop specifies the width of the outline on the current object.
strokeOpacity   | 1          | The strokeOpacity prop specifies the opacity of the outline on the current object.
strokeLinecap   | 'square'   | The strokeLinecap prop specifies the shape to be used at the end of open subpaths when they are stroked.
strokeLinejoin  | 'miter'    | The strokeLinejoin prop specifies the shape to be used at the corners of paths or basic shapes when they are stroked.
strokeDasharray | '[]'       | The strokeDasharray prop controls the pattern of dashes and gaps used to stroke paths.
strokeDashoffset| null       | The strokeDashoffset prop specifies the distance into the dash pattern to start the dash.
x               | 0          | Translate distance on x-axis.
y               | 0          | Translate distance on y-axis.
rotate          | 0          | Rotation degree value on the current object.
scale           | 1          | Scale value on the current object.
origin          | 0, 0       | Transform origin coordinates for the current object.
originX         | 0          | Transform originX coordinates for the current object.
originY         | 0          | Transform originY coordinates for the current object.


#### Supported elements:


#### Run example:

```

cd ./Example
npm install

```

#### TODO:

1. fillRule="evenodd" ([ART do not support fillRule](https://github.com/facebook/react-native/pull/5477))
2. clipPath ([wait for official supports](https://github.com/facebook/react-native/blob/master/Libraries/ART/ARTGroup.m#L16))
3. textPath ([wait for official supports](https://github.com/facebook/react-native/blob/master/Libraries/ART/ARTText.m#L56))
4. pattern ([wait for official supports](https://github.com/facebook/react-native/blob/master/Libraries/ART/ReactNativeART.js#L332))
5. [animations](https://github.com/gorangajic/react-svg-morph)

#### Thanks:

[SVG bounding Algorithm](https://github.com/icons8/svg-path-bounding-box)
[Circle drawing with svg arc path](http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334)
