import type { ComponentType, ReactElement } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import renderer from 'react-test-renderer';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  ForeignObject,
  G,
  Image,
  Line,
  Mask,
  Path,
  Rect,
  Text,
  TextPath,
  TSpan,
  Use,
} from '../src';

type OnLayout = (event: LayoutChangeEvent) => void;
type LayoutProps = { onLayout?: OnLayout };

const elements: Array<[string, (props: LayoutProps) => ReactElement]> = [
  ['Circle', (props) => <Circle r="10" {...props} />],
  [
    'ClipPath',
    (props) => (
      <Defs>
        <ClipPath id="clip" {...props}>
          <Rect width="10" height="10" />
        </ClipPath>
      </Defs>
    ),
  ],
  ['Ellipse', (props) => <Ellipse rx="10" ry="5" {...props} />],
  [
    'ForeignObject',
    (props) => <ForeignObject width="10" height="10" {...props} />,
  ],
  ['G', (props) => <G {...props} />],
  ['Image', (props) => <Image href="https://example.com/a.png" {...props} />],
  ['Line', (props) => <Line x2="10" y2="10" {...props} />],
  [
    'Mask',
    (props) => (
      <Defs>
        <Mask id="mask" {...props}>
          <Rect width="10" height="10" />
        </Mask>
      </Defs>
    ),
  ],
  ['Path', (props) => <Path d="M0 0L10 10" {...props} />],
  ['Rect', (props) => <Rect width="10" height="10" {...props} />],
  ['Text', (props) => <Text {...props}>Text</Text>],
  [
    'TextPath',
    (props) => (
      <Text>
        <TextPath href="#path" {...props}>
          Text
        </TextPath>
      </Text>
    ),
  ],
  [
    'TSpan',
    (props) => (
      <Text>
        <TSpan {...props}>Text</TSpan>
      </Text>
    ),
  ],
  ['Use', (props) => <Use href="#path" {...props} />],
];

const Scene = ({
  element: Element,
  onLayout,
}: {
  element: ComponentType<LayoutProps>;
  onLayout?: OnLayout;
}) => (
  <Svg width="100" height="100">
    <Element onLayout={onLayout} />
  </Svg>
);

const hostNodesWithProp = (tree: renderer.ReactTestRenderer, prop: string) =>
  tree.root.findAll(
    (node) => typeof node.type === 'string' && node.props[prop] !== undefined
  );

const render = (element: ComponentType<LayoutProps>, onLayout?: OnLayout) => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<Scene element={element} onLayout={onLayout} />);
  });
  return tree;
};

const rerender = (
  tree: renderer.ReactTestRenderer,
  element: ComponentType<LayoutProps>,
  onLayout?: OnLayout
) => {
  renderer.act(() => {
    tree.update(<Scene element={element} onLayout={onLayout} />);
  });
};

describe.each(elements)('%s', (_name, element) => {
  it('tells native it has a layout listener when onLayout is set', () => {
    const onLayout = jest.fn();
    const tree = render(element, onLayout);

    const nodes = hostNodesWithProp(tree, 'onSvgLayout');
    expect(nodes).toHaveLength(1);
    expect(nodes[0].props.onSvgLayout).toBe(onLayout);
    expect(nodes[0].props.hasLayoutListener).toBe(true);
  });

  it('tells native nothing about layout when onLayout is not set', () => {
    const tree = render(element);

    expect(hostNodesWithProp(tree, 'onSvgLayout')).toHaveLength(0);
    expect(hostNodesWithProp(tree, 'hasLayoutListener')).toHaveLength(0);
  });

  it('follows onLayout as it is added after mount and removed again', () => {
    const tree = render(element);

    rerender(tree, element, jest.fn());
    const added = hostNodesWithProp(tree, 'hasLayoutListener');
    expect(added).toHaveLength(1);
    expect(added[0].props.hasLayoutListener).toBe(true);

    rerender(tree, element);
    expect(hostNodesWithProp(tree, 'hasLayoutListener')).toHaveLength(0);
    expect(hostNodesWithProp(tree, 'onSvgLayout')).toHaveLength(0);
  });
});
