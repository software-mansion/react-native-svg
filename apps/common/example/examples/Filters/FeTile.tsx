import Svg, {FeTile, Filter, Image} from 'react-native-svg';

function MDNExample() {
  return (
    <Svg width="200" height="200">
      <Filter id="tile">
        <FeTile in="SourceGraphic" x="50" y="50" width="100" height="100" />
        <FeTile />
      </Filter>

      <Image
        href="https://live.mdnplay.dev/en-US/docs/Web/SVG/Reference/Element/feTile/mdn_logo_only_color.png"
        x="10%"
        y="10%"
        width="80%"
        height="80%"
        filter="url(#tile)"
      />
    </Svg>
  );
}

const icon = (
  <Svg width="30" height="30">
    <Filter id="tile">
      <FeTile in="SourceGraphic" x="7.5" y="7.5" width="15" height="15" />
      <FeTile />
    </Filter>

    <Image
      href="https://live.mdnplay.dev/en-US/docs/Web/SVG/Reference/Element/feTile/mdn_logo_only_color.png"
      x="3"
      y="3"
      width="24"
      height="24"
      filter="url(#tile)"
    />
  </Svg>
);

const samples = [MDNExample];

export {icon, samples};
