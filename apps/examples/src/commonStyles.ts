import {StyleSheet} from 'react-native';

const hairline = StyleSheet.hairlineWidth;

export const commonStyles = StyleSheet.create({
  welcome: {
    padding: 10,
    color: '#f60',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    height: 40,
  },
  title: {
    marginLeft: 10,
  },
  cell: {
    height: 40,
    paddingHorizontal: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: hairline,
    borderTopColor: '#ccc',
    marginTop: -hairline,
  },
  example: {
    paddingVertical: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderBottomWidth: hairline,
    borderBottomColor: '#ccc',
  },
  sampleTitle: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#666',
  },
});
