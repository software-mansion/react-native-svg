# Copied from Reanimated https://github.com/software-mansion/react-native-reanimated/blob/c6d68151644056476518241b0087b1ed900b39b6/packages/react-native-reanimated/scripts/reanimated_utils.rb
def rnsvg_try_to_parse_react_native_package_json(node_modules_dir)
  react_native_package_json_path = File.join(node_modules_dir, 'react-native/package.json')
  if !File.exist?(react_native_package_json_path)
    return nil
  end
  return JSON.parse(File.read(react_native_package_json_path))
end

def rnsvg_find_config()
  result = {
    :react_native_version => nil,
    :react_native_minor_version => nil,
    :react_native_node_modules_dir => nil,
  }

  react_native_node_modules_dir = File.join(File.dirname(`cd "#{Pod::Config.instance.installation_root.to_s}" && node --print "require.resolve('react-native/package.json')"`), '..')
  react_native_json = rnsvg_try_to_parse_react_native_package_json(react_native_node_modules_dir)

  if react_native_json == nil
    # user configuration, just in case
    node_modules_dir = ENV["REACT_NATIVE_NODE_MODULES_DIR"]
    react_native_json = rnsvg_try_to_parse_react_native_package_json(node_modules_dir)
  end

  if react_native_json == nil
    raise '[RNSVG] Unable to recognize your `react-native` version. Please set environmental variable with `react-native` location: `export REACT_NATIVE_NODE_MODULES_DIR="<path to react-native>" && pod install`.'
  end

  result[:react_native_version] = react_native_json['version']
  result[:react_native_minor_version] = react_native_json['version'].split('.')[1].to_i
  if result[:react_native_minor_version] == 0 # nightly
    result[:react_native_minor_version] = 1000
  end
  result[:react_native_node_modules_dir] = File.expand_path(react_native_node_modules_dir)

  return result
end
