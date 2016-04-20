前半个月捣腾了一下React Native ART
现在手上闲下来了和大家分享一下React Native中的ART使用心得


### React Native ART  究竟是什么?

所谓ART，是一个在React中绘制矢量图形的JS类库。这个类库抽象了一系统的通用接口，统一了SVG，canvas，VML这类矢量图形在React中的书写格式。你可以通过ART将SVG，canvas，VML的矢量图形拿到React中使用，也可以把ART反转回去。（虽然有很多局限性，后面会讲到）
React Native ART 是[react-art](https://github.com/reactjs/react-art)在React Native中的移植版，接口几乎完全一致，
React Native中的ART很早之前就已经开源了iOS版，最近又在0.18.0中开源了Android版本
因为缺少官方文档，一直不为人所知。

### 为什么要在React Native中使用 ART?

我在前端页面切片的时候比较喜欢用SVG，有条件我都尽量让设计师出AI的设计稿或者把图标导成SVG的
因为SVG和图片相比，优点太多太多：可以代码复用，可以无损放大，通过合理导出的svg代码比同等压缩过的图片文件大小要小很多，而且svg代码还可以通过gzip压缩
最近在做一个原生内嵌的React Native项目，设计师是按照原生APP的标准把每个图标切了3个尺寸给我，感谢React Native中强大的打包工具，可以很方便的使用这写图标。所以项目开始也没想着要用SVG（当时android的ART还没开源，这也是一个重要因素）。
在整个项目完成之后，看了一下，所有图片在经过压缩之后加起来有200多K，大小还可以接受。
但是在项目后期优化过程中，发现一个使用图片图标非常致命的问题：

*<Image />元素在iOS下不是同步渲染的，即使是使用的本地图片资源！*
更过分的是具有相同`source`的多个Image也不能在同一帧里面渲染出来的，如下的5个图标，在iOS下它们不会同时被渲染出来，这样造成的影响是在打开一个列表的时候，看见这些图标一个接一个无序的跳出来，这个效果如果在iphone4s，5s下看相当的明显，很恶心，完全不能忍受！想过各种方法也没办法绕过去。
![0_1453948316450_upload-02d66234-742f-4272-ac8e-11b87cfbee64](/uploads/files/1453948291567-upload-02d66234-742f-4272-ac8e-11b87cfbee64)

首屏的如下几个图标以及返回按钮和logo，还有TabBar里面的图标在iOS下都是在界面出现的若干帧之后再无序的跳出来，这样的效果很不好，一点都没有原生APP的感觉，有一种hybird的既视感。
![0_1453945350760_icons.png](/uploads/files/1453945326062-icons.png)
![0_1453946171360_upload-3df0c88a-2f35-4e7a-a076-e822afed6325](/uploads/files/1453946146528-upload-3df0c88a-2f35-4e7a-a076-e822afed6325)

后来等到了0.18.0，Android的ART对外开源了，我想到为什么不用SVG图标尝试一下呢？
然后让设计师把这个图标：
![0_1453949196676_upload-f3a4ad35-8bf5-4f67-b74e-5caa5415057f](/uploads/files/1453949171789-upload-f3a4ad35-8bf5-4f67-b74e-5caa5415057f)
重新切成SVG给我，然后再把SVG转成ART。
在iOS下完美渲染！所有图标和界面文字一起出现，不管是放5个还是100个。而且对界面的整体渲染速度也没有任何能感知到的影响。
在安卓下也是同样的完美，而且生成的ART代码要比图片小了很多。
```
<Surface
    width={50}
    height={50}
>
    <Group scale={0.23}>
        <Shape
            fill={`${this.props.active ? '#ff5942' : '#ccc'}`}
            d={`M46.31,0H3.69C1.63,0,0,1.63,0,3.69v42.63C0,48.37,1.63,50,3.69,50h42.63c2.05,0,3.69-1.63,3.69-3.69V3.69
C50,1.63,48.37,0,46.31,0z M44.5,22.92l-7.76,7.65l1.8,10.61c0.18,1.07-0.29,2.14-1.21,2.77c-0.51,0.34-1.1,0.52-1.69,0.52
c-0.49,0-0.98-0.12-1.42-0.35l-9.23-4.75l-9.23,4.75c-0.44,0.24-0.94,0.35-1.42,0.35c-0.6,0-1.19-0.17-1.69-0.52
c-0.92-0.63-1.38-1.69-1.21-2.77l1.8-10.61l-7.76-7.65c-0.77-0.76-1.04-1.86-0.69-2.87c0.35-1.01,1.25-1.73,2.34-1.9l10.6-1.55
l4.6-9.43c0.49-1,1.52-1.62,2.66-1.62c1.15,0,2.18,0.64,2.66,1.62l4.6,9.43l10.59,1.55c1.09,0.16,1.99,0.9,2.34,1.9
C45.53,21.06,45.27,22.16,44.5,22.92z`}
        />
    </Group>
</Surface>
```
这里面的路径代码是通过PS CC直接导出的，没有做任何优化，如果再优化一番可以再缩小一半。SVG代码优化后面再做介绍。
下面正式进入正题

### 如何在React Native中使用 ART？


##### 安装 ART
安装ART很简单
安卓里面根本不用安装，0.18.0里面自带，直接在js引入既可
```
import React, {ART} from 'react-native';
const {Surface, Group, Shape} = ART;
```
iOS里面的ART是可选的，你需要手动导入xcodeproj文件，以及加入静态链接库
但是也很简单：[教程](http://browniefed.com/blog/2015/05/03/getting-react-art-running-on-react-native/)

#### 使用ART

请大家原谅我，其实我是标题党，我不会在这里详细的讲解ART的用法，而是讲一个基于ART的SVG库:[react-native-art-svg](https://github.com/magicismight/react-native-art-svg)

为什么我不在这里讲ART呢？原因如下
上面那段代码是ART代码和设计师给我svg代码其实有一些差异，还要把SVG转换一次，很不友好，因为ART的元素和SVG元素名称和用法都不太一样
在SVG代码里面，画布元素是<svg>而ART里面是<Surface>
绘制路径的元素在SVG里面是<path>，而ART里面的Path又是另外一个东西，在ART里面需要<Shape>
这都不是最麻烦的地方，一些基础的SVG图形<circle>、<rect>、<polygon>...等等的元素ART都是不支持的。
前端切图，不管是网页还是React Native的界面，设计稿和图标都是设计师给我们的（部分连设计都一起做了的大神除外）
而设计师给我们的矢量图标要么是AI原图要么是SVG，但是最终到我们手里，导出来必定是SVG。
所以ART虽然通过抽象接口来统一了SVG，canvas，VML在React中的使用，但是ART提供的接口还是相当不友好的。然后我就萌发了一个想法，为什么不再把ART封装一层，把语法封装成和SVG的语法呢？
然后[react-native-art-svg](https://github.com/magicismight/react-native-art-svg)就诞生了，支持SVG所有常用的元素和属性，svg代码拿过来几乎可以直接使用(后面会添加直接导入svg代码的功能)

预览图如下:
![art-svg](https://github.com/magicismight/react-native-art-svg/raw/master/screenShoots/art-svg.gif)

安装很简单，因为是纯JavaScript的类库，直接一行搞定
`npm i react-native-art-svg --save`

通过如下代码在js中引入
```
import Svg, {
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
} from 'react-native-art-svg';
```

上面的ART代码等同于如下的代码
```
<Svg
    width={50}
    height={50}
>
    <G scale={0.23}>
        <Path
            fill={`${this.props.active ? '#ff5942' : '#ccc'}`}
            d={`M46.31,0H3.69C1.63,0,0,1.63,0,3.69v42.63C0,48.37,1.63,50,3.69,50h42.63c2.05,0,3.69-1.63,3.69-3.69V3.69
C50,1.63,48.37,0,46.31,0z M44.5,22.92l-7.76,7.65l1.8,10.61c0.18,1.07-0.29,2.14-1.21,2.77c-0.51,0.34-1.1,0.52-1.69,0.52
c-0.49,0-0.98-0.12-1.42-0.35l-9.23-4.75l-9.23,4.75c-0.44,0.24-0.94,0.35-1.42,0.35c-0.6,0-1.19-0.17-1.69-0.52
c-0.92-0.63-1.38-1.69-1.21-2.77l1.8-10.61l-7.76-7.65c-0.77-0.76-1.04-1.86-0.69-2.87c0.35-1.01,1.25-1.73,2.34-1.9l10.6-1.55
l4.6-9.43c0.49-1,1.52-1.62,2.66-1.62c1.15,0,2.18,0.64,2.66,1.62l4.6,9.43l10.59,1.55c1.09,0.16,1.99,0.9,2.34,1.9
C45.53,21.06,45.27,22.16,44.5,22.92z`}
        />
    </G>
</Svg>
```
这段代码从SVG转过来可省心多了，只需要改一下元素的大小写，把元素名称改成大写字母开头的既可，属性名称改成驼峰式的命名方式。

通用属性列表：
属性名称         | 默认值     | 描述
----------------|------------|--------------
fill            | '#000'     | 内部填充规则(填充颜色，填充渐变图形)
fillOpacity     | 1          | 填充的透明度
stroke          | 'none'     | 描边颜色
strokeWidth     | 1          | 描边的宽度
strokeOpacity   | 1          | 描边的透明度
strokeLinecap   | 'square'   | 描边线段端点显示方式
strokeLinejoin  | 'miter'    | 描边线段连接处的显示方式
strokeDasharray | []         | 描边线段断点显示规则
x               | 0          | 当前图形x轴偏移量
y               | 0          | 当前图形y轴偏移量
rotate          | 0          | 当前图形旋转值
scale           | 1          | 当前图形的缩放值
origin          | 0, 0       | 变形原点(x,y,rotate,scale的变形原点坐标)
originX         | 0          | 变形原点x轴坐标
originY         | 0          | 变形原点y轴坐标

可以看到，几乎所有SVG的常用属性都可以支持
不支持fillRule，因为官方认为[fillRule不是SVG,canvas和VML公用的属性，他们不对这类独有的属性进行支持](https://github.com/facebook/react-native/pull/5477)
暂不支持clipPath,因为ART官方还[未完成](https://github.com/facebook/react-native/blob/master/Libraries/ART/ARTGroup.m#L16)

支持的元素列表：

##### Svg

Svg为所有矢量图形的画布元素，所有Svg内的矢量图形都会绘制在Svg内部
并且Svg支持viewbox和preserveAspectRatio属性(关于这两个属性的[详解](http://tutorials.jenkov.com/svg/svg-viewport-view-box.html))

```
<Svg
    height="100"
    width="100"
>
    <Rect x="0" y="0" width="100" height="100" fill="black" />
    <Circle cx="50" cy="50" r="30" fill="yellow" />
    <Circle cx="40" cy="40" r="4" fill="black" />
    <Circle cx="60" cy="40" r="4" fill="black" />
    <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
</Svg>;
```

上面的代码会绘制如下的图形
![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/svg.png)
其中height和width定义了Svg元素的宽高

*注意*
在react-native-art-svg中，所有元素的数字类型的属性都可以直接用字符串表示，如:
下面两段属性声明都可以正常使用，这样写起来很方便
`height="100"`
`height={100}`

#### 矩形：Rect

<Rect>元素可以在画布上绘制一个矩形，矩形位置和大小通过x,y,width,height属性共同定义
```
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
![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/rect.png)

上面的代码绘制了一个左上角位于画布25,5，宽150，高50的矩形
并且使用蓝色(rgb(0,0,255))填充(fill)内部背景
用黑色(rgb(0,0,0))进行描边(stroke)，描边宽度(strokeWidth)为3

#### 圆型：Circle

<Circle>元素可以在画布上绘制一个圆形，圆型需要cx,cy,r三个属性，分别对应圆形x轴坐标，y轴坐标以及半径

```
<Svg
    height="100"
    width="110"
>
    <Circle
        cx="50"
        cy="50"
        r="50"
        fill="pink"
    />
</Svg>
```

![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/circle.png)

#### 椭圆：Ellipse
<Ellipse>元素可以在画布上绘制一个椭圆，椭圆和圆形类似，只是把圆形的r属性替换成了分别对应水平半径和垂直半径的rx,ry属性，rx == ry的椭圆是一个圆形

```
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

#### 直线：Line
<Line>元素可以在画布上画一条从x1,y1到x2,y2的直线

```
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

![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/line.png)

#### 多边形：Polygon
<Polygon>元素可以在画布上画一个由多个点收尾相接组合而成的多边形，每个点的坐标由空格分开定义在points属性中

```
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

![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/polygon.png)

#### 多边线：Polyline
<Polyline>元素和多边形类型，只是多边形的最后一个点和第一个点是相连的，组成的是一个闭合的图形，多边线的最后一个点和第一个点没有连接

```
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
![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/polyline.png)

#### 路径：Path
<Path>的`d`属性内定义了一系列的路径坐标以及绘制规则命令，上面的所有图形都可以通过Path绘制而成

* M = 把绘制点移动到某个位置
* L = 从当前绘制点画一条直线到某个坐标
* H = 从当前绘制点沿着x轴水平画线
* V = 从当前绘制点沿着y轴垂直画线
* C = 从当前绘制点画一条曲线到某个坐标
* S = 从当前绘制点画一条平滑的曲线到某个坐标
* Q = 从当前绘制点画一条贝赛尔曲线到某个坐标
* T = 从当前绘制点画一条平滑的贝赛尔曲线到某个坐标
* A = 从当前绘制点画一条椭圆曲线到某个点
* Z = 闭合当前路径

*注意:* 上面所有的命令都可以使用小写字母，大写字母的命令是使用的坐标是绝对值，小写字母的命令的坐标是相对值

```
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
![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/path.png)

#### 文字：Text
<Text>元素可以在画布上绘制文字图形
```
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
        textAnchor="center"
    >STROKED TEXT</Text>
</Svg
```
![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/text.png)


### SVG进阶元素使用

#### 分组：G
<G>元素可以把它内部的子元素组合成一个分组，G元素内所有的子元素都将继承除(id，变形属性之外的所有属性)

下面两段代是相同的
```
<Svg
    height="60"
    width="200"
>
    <G width="100" height="30" fill="blue" x="0">
        <Rect y="0" />
        <Rect y="30" />
    </G>
</Svg>
<Svg
    height="60"
    width="200"
>
    <G>
        <Rect width="100" height="30" fill="blue" x="0" y="0" />
        <Rect width="100" height="30" fill="blue" x="0" y="0" />
    </G>
</Svg>
```

G元素的变形属性不会被继承

```
<Svg
    height="100"
    width="200"
>
    <G
        rotate="50"
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
            textAnchor="center"
        >
            Text grouped with shapes</Text>
    </G>
</Svg>
```

![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/g.png)

#### 定义：Defs
<Defs>元素内的所有图形都不会被绘制在画布上，<Defs>元素用于定义一些代码复用相关的元素，下面使用其他元素解释<Defs>元素的用法

#### 复用：Use

使用<Use>元素可以进行代码复用，可以将<Defs>元素中定义的元素`复制一份`绘制在当前<Use>元素的位置

```
<Svg
    height="100"
    width="300"
>
    <Defs>
        <G id="shape">
            <Circle cx="50" cy="50" r="50" />
            <Rect x="50" y="50" width="50" height="50" />
            <Circle cx="50" cy="50" r="5" fill="blue" />
        </G>
    </Defs>
    <Use href="#shape" x="20" y="0"/>
    <Use href="#shape" x="170"y="0" />
</Svg>
```

![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/use.png)

*注意：*Use元素使用href指定复用对象(SVG中是使用的xlink:href=)，属性值为`#`+需要复用元素的id，也可以复用<Defs>外面具有id属性的元素，Use元素上的属性将覆盖被复用元素的属性

#### 标记：Symbol
使用<Symbol>元素可以更快捷的定义元素，使用<Defs>元素定义可复用元素时，每个子元素对应一个可复用元素，如果需要复用多个元素组成的图形时通常使用<Symbol>元素进行定义，<Symbol>自身也不会被绘制在画布上，而且可以给Symbol指定viewbox和preserveAspectRatio属性，更为方便的对图形进行缩放

```
<Svg
    height="150"
    width="110"
>
    <Symbol id="symbol" viewbox="0 0 150 110" width="100" height="50">
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

![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/symbol.png)

### 渐变填充

#### LinearGradient：线性渐变
<LinearGradient>可以定义一个线性渐变的填充规则，改元素必须定义在<Defs>元素内。
线性渐变可以被定义为水平渐变、垂直渐变和带角度的渐变
通过调整x1,y1设置渐变开始点，x2,y2设置渐变结束点
使用<Stop>元素定义渐变的变色点

```
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

*注意*：<LinearGradient>和<RadialGradient>的x1,y2,x2,y2属性均可以使用百分比
下面<LinearGradient>绘制的结果等同于上面代码的绘制结果

```
<LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0" />
    <Stop offset="100%" stopColor="red" stopOpacity="1" />
</LinearGradient>
```

![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/lineargradient.png)

#### RadialGradient：径向渐变
<RadialGradient>可以定义一个线性渐变的填充规则，和<LinearGradient>一样改元素必须定义在<Defs>元素内。
cx,cu,rx,ry属性定义了最外层渐变椭圆的位置坐标和大小，fx和fy属性定义了最内层渐变椭圆的位置坐标
```
<Svg
    height="150"
    width="300"
>
    <Defs>
        <RadialGradient id="grad" cx="150" cy="75" rx="85" ry="55" fx="150" fy="75">
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
![Svg](https://raw.githubusercontent.com/magicismight/react-native-art-svg/master/screenShoots/radialgradient.png)


### 总结

好了，差不多就这些了。
上面包含了大多数`react-native-art-svg`类库的用法，想看更具体的例子请fork之后运行Example下面的示例工程。

让我们再回到在文章开头的那个项目中去，通过几番折腾，终于把项目中的所有图片都换成了矢量图形，在iOS下再也没有出现图片闪动或图片不能和界面同时渲染的问题了。
而且SVG代码再经过一番优化之后，把200多K的图片变成了30多K的矢量代码。完美！

我再顺带讲一下SVG代码优化：
1. 优先使用基础图形！
优先使用<Rect><Circle><Line><Polygon><Polyline><Ellipse>之类的基础图形
能够使用这些元素绘制的图形就尽量使用这些元素来绘制，因为同样一个图形使用<Path>命令生成的代码要比其他基础元素生成的代码多很多倍
2. 让设计师在画图的时候全部使用`局中描边`，因为只有局中描边导出的SVG代码会保留原始设计稿中的图形信息，用外层描边或内侧描边生成的SVG代码都是通过<path>元素绘制的，这样就会使得SVG代码成倍的增加。
