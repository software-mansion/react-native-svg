## react-native-svg

[![Version](https://img.shields.io/npm/v/react-native-svg.svg)](https://www.npmjs.com/package/react-native-svg)
[![NPM](https://img.shields.io/npm/dm/react-native-svg.svg)](https://www.npmjs.com/package/react-native-svg)

`react-native-svg` is built to provide a SVG interface to react native on both iOS and Android.

[Check out the demo](https://expo.io/@msand/svgexample) [Source](https://github.com/peterlazar1993/react-native-svg-example/commit/8944e14d2dd1b36cc41fe089ac547cdc9149c111).

## Features

1. Supports most SVG elements and properties (Rect, Circle, Line, Polyline, Polygon, G ...).
2. Easy to convert SVG code into ReactNative code.

### Installation

#### Automatic

*With Expo, this is pre-installed. Jump ahead to [Usage](#Usage)*

1. Install library from `npm`

    ```bash
    npm install react-native-svg --save
    ```

    # NOTICE:

    - react-native-svg >= 3.2.0 only supports react-native >= 0.29.0
    - react-native-svg >= 4.2.0 only supports react-native >= 0.32.0
    - react-native-svg >= 4.3.0 only supports react-native >= 0.33.0
    - react-native-svg >= 4.4.0 only supports react-native >= 0.38.0 and react >= 15.4.0
    - react-native-svg >= 4.5.0 only supports react-native >= 0.40.0 and react >= 15.4.0
    - react-native-svg >= 5.1.8 only supports react-native >= 0.44.0 and react == 16.0.0-alpha.6
    - react-native-svg >= 5.2.0 only supports react-native >= 0.45.0 and react == 16.0.0-alpha.12
    - react-native-svg >= 5.3.0 only supports react-native >= 0.46.0 and react == 16.0.0-alpha.12
    - react-native-svg >= 5.4.1 only supports react-native >= 0.47.0 and react == 16.0.0-alpha.12
    - react-native-svg >= 5.5.1 only supports react-native >= 0.50.0 and react == 16.0.0

2. Link native code

    ```bash
    react-native link react-native-svg
    ```

    * A bug in react-native currently links the tvOS library into the iOS project as well.

        Until the fix is released:
        https://github.com/facebook/react-native/issues/13783
        https://github.com/facebook/react-native/commit/a63fd378a47173cc9f750e9980f18dc12dd7ea51

        Follow the instructions here: https://github.com/react-native-community/react-native-svg/issues/544

    * If `cocoapods` is used and if error `RNSVGImage.m:12:9: 'React/RCTImageLoader.h' file not found` occurs:

        Add the following entry in Podfile:

        ```ruby
            pod 'React', :path => '../node_modules/react-native', :subspecs => [
                [...]
                'RCTImage', # !!!!!
            ]
        ```

        and run `pod install` from `ios` folder


#### Manual

##### Android

1. `npm install react-native-svg --save`

2. Append the following lines to `android/settings.gradle`:

	```
	include ':react-native-svg'
	project(':react-native-svg').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-svg/android')
	```

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

	```
    compile project(':react-native-svg')
	```

4. Open up `android/app/src/main/java/[...]/MainApplication.java
  - Add `import com.horcrux.svg.SvgPackage;` to the imports at the top of the file
  - Add `new SvgPackage()` to the list returned by the `getPackages()` method. Add a comma to the previous item if there's already something there.

##### iOS

[Manual linking](http://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking)

To install react-native-svg on iOS visit the link referenced above or do the following:

1. Open your project in XCode and drag the RNSVG.xcodeproj file (located in .../node_modules/react-native-svg/ios) into the Libraries directory shown in XCode.
2. Expand the RNSVG.xcodeproj file you just added to XCode until you see: libRNSVG.a (located in RNSVG.xcodeproj > Products )
3. Drag libRNSVG.a into the Link Binary With Libraries section (located in Build Phases which may be found at the top of the XCode window)

###### CocoaPods

Alternatively, you can use [CocoaPods](https://cocoapods.org/) to manage your native (Objective-C and Swift) dependencies:

1. Add RNSVG to your Podfile
```
pod 'RNSVG', :path => '../node_modules/react-native-svg'
```

### <a name="Usage">Usage</a>

Here's a simple example. To render output like this:

![SVG example](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/svg.png)

Use the following code:

```javascript
import 'react';
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

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

[Try this on Snack](https://snack.expo.io/r1hCVAaEZ)

### Common props:

Name            | Default    | Description
----------------|------------|--------------
fill            | '#000'     | The fill prop refers to the color inside the shape.
fillOpacity     | 1          | This prop specifies the opacity of the color or the content the current object is filled with.
fillRule        | nonzero    | The fillRule prop determines what side of a path is inside a shape, which determines how fill will paint the shape, can be `nonzero` or `evenodd`
stroke          | 'none'     | The stroke prop controls how the outline of a shape appears.
strokeWidth     | 1          | The strokeWidth prop specifies the width of the outline on the current object.
strokeOpacity   | 1          | The strokeOpacity prop specifies the opacity of the outline on the current object.
strokeLinecap   | 'square'   | The strokeLinecap prop specifies the shape to be used at the end of open subpaths when they are stroked. Can be either `'butt'`, `'square'` or `'round'`.
strokeLinejoin  | 'miter'    | The strokeLinejoin prop specifies the shape to be used at the corners of paths or basic shapes when they are stroked. Can be either `'miter'`, `'bevel'` or `'round'`.
strokeDasharray | []         | The strokeDasharray prop controls the pattern of dashes and gaps used to stroke paths.
strokeDashoffset| null       | The strokeDashoffset prop specifies the distance into the dash pattern to start the dash.
x               | 0          | Translate distance on x-axis.
y               | 0          | Translate distance on y-axis.
rotation          | 0          | Rotation degree value on the current object.
scale           | 1          | Scale value on the current object.
origin          | 0, 0       | Transform origin coordinates for the current object.
originX         | 0          | Transform originX coordinates for the current object.
originY         | 0          | Transform originY coordinates for the current object.


### Supported elements:

#### Svg

```html
<Svg
    height="100"
    width="100"
>
    <Rect x="0" y="0" width="100" height="100" fill="black" />
    <Circle cx="50" cy="50" r="30" fill="yellow" />
    <Circle cx="40" cy="40" r="4" fill="black" />
    <Circle cx="60" cy="40" r="4" fill="black" />
    <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
</Svg>
```

### Rect

The <Rect> element is used to create a rectangle and variations of a rectangle shape:


```html
<Svg
    width="200"
    height="60"
>
    <Rect
        x="25"
        y="5"
        width="150"
        height="50"
        fill="rgb(0,0,255)"
        strokeWidth="3"
        stroke="rgb(0,0,0)"
    />
</Svg>
```

![Rect](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/rect.png)

  Code explanation:

  * The width and height props of the <Rect> element define the height and the width of the rectangle.
  * The x prop defines the left position of the rectangle (e.g. x="25" places the rectangle 25 px from the left margin).
  * The y prop defines the top position of the rectangle (e.g. y="5" places the rectangle 5 px from the top margin).

##### Circle

The <Circle> element is used to create a circle:

```html
<Svg
    height="100"
    width="100"
>
    <Circle
        cx="50"
        cy="50"
        r="50"
        fill="pink"
    />
</Svg>
```

![Rect](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/circle.png)

  Code explanation:

  * The cx and cy props define the x and y coordinates of the center of the circle. If cx and cy are omitted, the circle's center is set to (0,0)
  * The r prop defines the radius of the circle

#### Ellipse

The <Ellipse> element is used to create an ellipse.

An ellipse is closely related to a circle. The difference is that an ellipse has an x and a y radius that differs from each other, while a circle has equal x and y radius.

```html
<Svg
    height="100"
    width="110"
>
    <Ellipse
        cx="55"
        cy="55"
        rx="50"
        ry="30"
        stroke="purple"
        strokeWidth="2"
        fill="yellow"
    />
</Svg>
```
![Rect](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/ellipse.png)

Code explanation:

* The cx prop defines the x coordinate of the center of the ellipse
* The cy prop defines the y coordinate of the center of the ellipse
* The rx prop defines the horizontal radius
* The ry prop defines the vertical radius

#### Line

The <Line> element is an SVG basic shape, used to create a line connecting two points.

```html
<Svg
    height="100"
    width="100"
>
    <Line
        x1="0"
        y1="0"
        x2="100"
        y2="100"
        stroke="red"
        strokeWidth="2"
    />
</Svg>
```

![Rect](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/line.png)

Code explanation:

* The x1 prop defines the start of the line on the x-axis.
* The y1 prop defines the start of the line on the y-axis.
* The x2 prop defines the end of the line on the x-axis.
* The y2 prop defines the end of the line on the y-axis.

#### Polygon

The <Polygon> element is used to create a graphic that contains at least three sides. Polygons are made of straight lines, and the shape is "closed" (all the lines connect up).

```html
<Svg
    height="100"
    width="100"
>
    <Polygon
        points="40,5 70,80 25,95"
        fill="lime"
        stroke="purple"
        strokeWidth="1"
    />
</Svg>
```

![Rect](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/polygon.png)

Code explanation:

* The points prop defines the x and y coordinates for each corner of the polygon

#### Polyline

The <Polyline> element is used to create any shape that consists of only straight lines:

```html
<Svg
    height="100"
    width="100"
>
    <Polyline
        points="10,10 20,12 30,20 40,60 60,70 95,90"
        fill="none"
        stroke="black"
        strokeWidth="3"
    />
</Svg>
```

![Rect](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/polyline.png)

Code explanation:

* The points prop defines the x and y coordinates for each point of the polyline

#### Path

The <Path> element is used to define a path.

The following commands are available for path data:

  * M = moveto
  * L = lineto
  * H = horizontal lineto
  * V = vertical lineto
  * C = curveto
  * S = smooth curveto
  * Q = quadratic Bézier curve
  * T = smooth quadratic Bézier curveto
  * A = elliptical Arc
  * Z = closepath

`Note:` All of the commands above can also be expressed with lower letters. Capital letters means absolutely positioned, lower cases means relatively positioned.

```html
<Svg
    height="100"
    width="100"
>
    <Path
        d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
        fill="none"
        stroke="red"
    />
</Svg>
```

![Rect](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/path.png)


#### Text

The <Text> element is used to define text.

```html
<Svg
    height="60"
    width="200"
>
    <Text
        fill="none"
        stroke="purple"
        fontSize="20"
        fontWeight="bold"
        x="100"
        y="20"
        textAnchor="middle"
    >STROKED TEXT</Text>
</Svg>
```

![Text](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/text.png)

#### TSpan

The <TSpan> element is used to draw multiple lines of text in SVG. Rather than having to position each line of text absolutely, the <TSpan> element makes it possible to position a line of text relatively to the previous line of text.

```html
<Svg
    height="160"
    width="200"
>
    <Text y="20" dx="5 5">
        <TSpan x="10" >tspan line 1</TSpan>
        <TSpan x="10" dy="15">tspan line 2</TSpan>
        <TSpan x="10" dx="10" dy="15">tspan line 3</TSpan>
    </Text>
    <Text x="10" y="60" fill="red" fontSize="14">
        <TSpan dy="5 10 20" >12345</TSpan>
        <TSpan fill="blue" dy="15" dx="0 5 5">
            <TSpan>6</TSpan>
            <TSpan>7</TSpan>
        </TSpan>
        <TSpan dx="0 10 20" dy="0 20" fontWeight="bold" fontSize="12">89a</TSpan>
    </Text>
    <Text y="140" dx="0 5 5" dy="0 -5 -5">delta on text</Text>
</Svg>
```

![TSpan](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/tspan.png)

#### TextPath

In addition to text drawn in a straight line, SVG also includes the ability to place text along the shape of a <Path> element. To specify that a block of text is to be rendered along the shape of a <Path>, include the given text within a <TextPath> element which includes an href attribute with a reference to a <Path> element.

```html
<Svg
    height="100"
    width="200"
>
    <Defs>
        <Path
            id="path"
            d={path}
        />
    </Defs>
    <G y="20">
        <Text
            fill="blue"

        >
            <TextPath href="#path" startOffset="-10%">
                We go up and down,
                <TSpan fill="red" dy="5,5,5">then up again</TSpan>
            </TextPath>
        </Text>
        <Path
            d={path}
            fill="none"
            stroke="red"
            strokeWidth="1"
        />
    </G>
</Svg>
```

![TextPath](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/text-path.png)

#### G

The <G> element is a container used to group other SVG elements. Transformations applied to the g element are performed on all of its child elements, and any of its props are inherited by its child elements. It can also group multiple elements to be referenced later with the [&lt;Use /&gt;](#use) element.

```html
<Svg
    height="100"
    width="200"
>
    <G
        rotation="50"
        origin="100, 50"
    >
        <Line
            x1="60"
            y1="10"
            x2="140"
            y2="10"
            stroke="#060"
        />

        <Rect
            x="60"
            y="20"
            height="50"
            width="80"
            stroke="#060"
            fill="#060"
        />

        <Text
            x="100"
            y="75"
            stroke="#600"
            fill="#600"
            textAnchor="middle"
        >
            Text grouped with shapes</Text>
    </G>
</Svg>
```
![G](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/g.png)

#### Use

The <Use> element can reuse an SVG shape from elsewhere in the SVG document, including <G> elements and <Symbol> elements. The reused shape can be defined inside the [&lt;Defs&gt;](#defs) element (which makes the shape invisible until used) or outside.

```html
<Svg
    height="100"
    width="300"
>
    <Defs>
        <G id="shape">
            <G>
                <Circle cx="50" cy="50" r="50" />
                <Rect x="50" y="50" width="50" height="50" />
                <Circle cx="50" cy="50" r="5" fill="blue" />
            </G>
        </G>
    </Defs>
    <Use href="#shape" x="20" y="0"/>
    <Use href="#shape" x="170"y="0" />
</Svg>
```

This example shows a <G> element defined inside a [&lt;Defs&gt;](#defs) element. This makes the <G> invisible unless referenced by a <Use> element.

Before the <G> element can be referenced, it must have an ID set on it via its id prop. The <Use> element references the <G> element via its `href` prop. Notice the # in front of the ID in the prop value.

The <Use> element specifies where to show the reused shapes via its x and y props. Notice that the shapes inside the <G> element are located at 0,0. That is done because their position is added to the position specified in the <Use> element.

![use](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/use.png)


#### Symbol

The SVG <Symbol> element is used to define reusable symbols. The shapes nested inside a <Symbol> are not displayed unless referenced by a <Use> element.

```html
<Svg
    height="150"
    width="110"
>
    <Symbol id="symbol" viewBox="0 0 150 110" width="100" height="50">
        <Circle cx="50" cy="50" r="40" strokeWidth="8" stroke="red" fill="red"/>
        <Circle cx="90" cy="60" r="40" strokeWidth="8" stroke="green" fill="white"/>
    </Symbol>

    <Use
        href="#symbol"
        x="0"
        y="0"
    />
    <Use
        href="#symbol"
        x="0"
        y="50"
        width="75"
        height="38"
    />
    <Use
        href="#symbol"
        x="0"
        y="100"
        width="50"
        height="25"
    />
</Svg>
```

![Symbol](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/symbol.png)

#### Defs

The <Defs> element is used to embed definitions that can be reused inside an SVG image. For instance, you can group SVG shapes together and reuse them as a single shape.

#### Image

The <Image> element allows a raster image to be included in an Svg componenet.

```html
<Svg
    height="100"
    width="100"
>
    <Defs>
        <ClipPath id="clip">
            <Circle cx="50%" cy="50%" r="40%"/>
        </ClipPath>
    </Defs>
    <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="red"
    />
    <Rect
        x="5%"
        y="5%"
        width="50%"
        height="90%"
    />

    <Image
        x="5%"
        y="5%"
        width="50%"
        height="90%"
        preserveAspectRatio="xMidYMid slice"
        opacity="0.5"
        href={require('../image.jpg')}
        clipPath="url(#clip)"
    />
    <Text
        x="50"
        y="50"
        textAnchor="middle"
        fontWeight="bold"
        fontSize="16"
        fill="blue"
    >HOGWARTS</Text>
</Svg>
```

![Image](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/image.png)

#### ClipPath

The <ClipPath> SVG element defines a clipping path. A clipping path is used/referenced using the clipPath property

```html
<Svg
    height="100"
    width="100"
>
    <Defs>
        <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
            <Stop
                offset="0%"
                stopColor="#ff0"
                stopOpacity="1"
            />
            <Stop
                offset="100%"
                stopColor="#00f"
                stopOpacity="1"
            />
        </RadialGradient>
        <ClipPath id="clip">
            <G scale="0.9" x="10">
                <Circle cx="30" cy="30" r="20"/>
                <Ellipse cx="60" cy="70" rx="20" ry="10" />
                <Rect x="65" y="15" width="30" height="30" />
                <Polygon points="20,60 20,80 50,70" />
                <Text
                    x="50"
                    y="30"
                    fontSize="32"
                    fonWeight="bold"
                    textAnchor="middle"
                    scale="1.2"
                >Q</Text>
            </G>
        </ClipPath>
    </Defs>
    <Rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="url(#grad)"
        clipPath="url(#clip)"
    />
</Svg>
```

![ClipPath](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/clip-path.png)

#### LinearGradient

The <LinearGradient> element is used to define a linear gradient.
The <LinearGradient> element must be nested within a [&lt;Defs&gt;](#defs) tag. The [&lt;Defs&gt;](#defs) tag is short for definitions and contains definition of special elements (such as gradients).

Linear gradients can be defined as horizontal, vertical or angular gradients:

  * Horizontal gradients are created when y1 and y2 are equal and x1 and x2 differ
  * Vertical gradients are created when x1 and x2 are equal and y1 and y2 differ
  * Angular gradients are created when x1 and x2 differ and y1 and y2 differ

```html
<Svg
    height="150"
    width="300"
>
    <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="170" y2="0">
            <Stop offset="0" stopColor="rgb(255,255,0)" stopOpacity="0" />
            <Stop offset="1" stopColor="red" stopOpacity="1" />
        </LinearGradient>
    </Defs>
    <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
</Svg>
```

Code explanation:

  * The id prop of the <LinearGradient> tag defines a unique name for the gradient
  * The x1, x2, y1,y2 props of the <LinearGradient> tag define the start and end position of the gradient
  * The color range for a gradient can be composed of two or more colors. Each color is specified with a <Stop> tag. The offset prop is used to define where the gradient color begin and end
  * The fill prop links the ellipse element to the gradient

![LinearGradient](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/lineargradient.png)

*NOTICE:*
LinearGradient also supports percentage as prop:
```html
<LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0" />
    <Stop offset="100%" stopColor="red" stopOpacity="1" />
</LinearGradient>
```
This result is same as the example before. But it's recommend to use exact number instead; it has performance advantages over using percentages.

#### RadialGradient

The <RadialGradient> element is used to define a radial gradient. The <RadialGradient> element must be nested within a [&lt;Defs&gt;](#defs) tag. The [&lt;Defs&gt;](#defs) tag is short for definitions and contains definition of special elements (such as gradients).

```html
<Svg
    height="150"
    width="300"
>
    <Defs>
        <RadialGradient id="grad" cx="150" cy="75" rx="85" ry="55" fx="150" fy="75" gradientUnits="userSpaceOnUse">
            <Stop
                offset="0"
                stopColor="#ff0"
                stopOpacity="1"
            />
            <Stop
                offset="1"
                stopColor="#83a"
                stopOpacity="1"
            />
        </RadialGradient>
    </Defs>
    <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
</Svg>
```

Code explanation:

  * The id prop of the <radialGradient> tag defines a unique name for the gradient
  * The cx, cy and r props define the outermost circle and the fx and fy define the innermost circle
  * The color range for a gradient can be composed of two or more colors. Each color is specified with a <stop> tag. The offset prop is used to define where the gradient color begin and end
  * The fill prop links the ellipse element to the gradient

![RadialGradient](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/radialgradient.png)

#### Touch Events

Touch events are supported in react-native-svg. These include:

 - `disabled`
 - `onPress`
 - `onPressIn`
 - `onPressOut`
 - `onLongPress`
 - `delayPressIn`
 - `delayPressOut`
 - `delayLongPress`

You can use these events to provide interactivity to your react-native-svg components.

```html
<Circle
    cx="50%"
    cy="50%"
    r="38%"
    fill="red"
    onPress={() => alert('Press on Circle')}
/>
```

![TouchEvents](https://raw.githubusercontent.com/react-native-community/react-native-svg/master/screenShoots/touchevents.gif)

For more examples of touch in action, checkout the [TouchEvents.js examples](https://github.com/magicismight/react-native-svg-example/blob/master/examples/TouchEvents.js).

### Run example:

```bash

git clone https://github.com/magicismight/react-native-svg-example.git
cd react-native-svg-example
npm i

# run Android: react-native run-android
# run iOS: react-native run-ios

```


### TODO:
1. Add Native methods for elements.
2. Pattern element.
3. Mask element.
4. Marker element.
5. Load Image from URL.

### Known issues:
1. Unable to apply focus point of RadialGradient on Android.

### Thanks:

* [w3schools.com SVG Tutorial](http://www.w3schools.com/graphics/svg_intro.asp)
* [SVG Tutorial](http://tutorials.jenkov.com/svg/index.html)
* [MDN](https://developer.mozilla.org/en/docs/Web/SVG)
