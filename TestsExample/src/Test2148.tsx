import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {SvgFromUri} from 'react-native-svg';

export default function App() {
  const [error, setError] = useState<Error>();
  return (
    <View style={{flex: 1, backgroundColor: 'red', padding: 50}}>
      <SvgFromUri
        uri={
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.svgrepo.com%2Fsvg%2F5154%2Fhand-pointer&psig=AOvVaw2e3ud_ho3oPjy1VSLw0nch&ust=1717666569513000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLixjuCUxIYDFQAAAAAdAAAAABAY'
        }
        width={24}
        height={24}
        onError={setError}
      />
      <Text style={{marginTop: 50, color: '#fff'}}>{error?.message}</Text>
    </View>
  );
}
