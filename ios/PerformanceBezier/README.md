iOS UIBezierPath Performance
=====

This code dramatically improves performance for common UIBezierPath operations, and it also
brings UIBezierPath API closer to its NSBezierPath counterpart. For full background of this
repo, checkout [the blogpost explaining what this framework does](http://blog.getlooseleaf.com/post/110511009139/improving-uibezierpath-performance-and-api).

This code was originally part of [Loose Leaf](https://getlooseleaf.com/). Additional components and
libraries from the app [have also been open sourced](https://getlooseleaf.com/opensource/).

## What is this?

This framework adds caching into every UIBezierPath so that common operations can
be performed in constant time. It also adds some missing NSBezierPath methods to the
UIBezierPath class.

After linking this framework into your project, all Bezier paths will automatically be upgraded
to use this new caching. No custom UIBezierPath allocation or initialization is required.

For example, by default there is no O(1) way to retrieve elements from a UIBezierPath. In order to
retrieve the first point of the curve, you must CGPathApply() and interate over the entire path
to retrieve that single point. This framework changes that. For many algorithms, this can 
dramatically affect performance.

## Are you using PerformanceBezier?

Let me know! I'd love to know where PerformanceBezier is using and how it's affecting your apps. Ping me
at [@adamwulf](https://twitter.com/adamwulf)!

Also - If you like PerformanceBezier, then you'll _love_ [ClippingBezier](https://github.com/adamwulf/ClippingBezier) - an easy way to find intersecting points, lines, and shapes between two UIBezierPaths.

## Documentation

View the header files for full documentation.

## Building the framework

This library will generate a proper static framework bundle that can be used in any iOS7+ project.

## Including in your project

1. Link against the built framework.
2. Add "-ObjC++ -lstdc++" to the Other Linker Flags in the project's Settings
3. #import &lt;PerformanceBezier/PerformanceBezier.h&gt;

## JRSwizzle

This framework includes and uses the [JRSwizzle](https://github.com/rentzsch/jrswizzle) library, which is
licensed under the MIT license.

## License

<a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/3.0/us/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/">Creative Commons Attribution 3.0 United States License</a>.

For attribution, please include:

1. Mention original author "Adam Wulf for Loose Leaf app"
2. Link to https://getlooseleaf.com/opensource/
3. Link to https://github.com/adamwulf/PerformanceBezier



## Support this framework

This framework is created by Adam Wulf ([@adamwulf](https://twitter.com/adamwulf)) as a part of the [Loose Leaf app](https://getlooseleaf.com).

[Buy the app](https://itunes.apple.com/us/app/loose-leaf/id625659452?mt=8&uo=4&at=10lNUI&ct=github) to show your support! :)
