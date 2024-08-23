import {SafeAreaView} from 'react-native';
import {SvgFromXml} from 'react-native-svg';

export default function App() {
  return (
    <SafeAreaView>
      <SvgFromXml
        xml={`<svg><text x="10" y="32" fontSize="32">&amp; &lt; &gt;</text></svg>`}
      />
    </SafeAreaView>
  );
}
