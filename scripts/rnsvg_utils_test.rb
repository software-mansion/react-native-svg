require 'json'
require 'fileutils'
require 'tmpdir'
require 'minitest/autorun'
require_relative 'rnsvg_utils'

# Only the installation root is needed from CocoaPods for these tests.
module Pod
  class Config
    attr_accessor :installation_root

    def self.instance
      @instance ||= new
    end
  end
end

class RNSVGUtilsTest < Minitest::Test
  def setup
    @root = Dir.mktmpdir('rnsvg resolution ')
    @previous_root = Pod::Config.instance.installation_root
    Pod::Config.instance.installation_root = @root
    @previous_fallback = ENV.delete('REACT_NATIVE_NODE_MODULES_DIR')
    @previous_node_options = ENV.delete('NODE_OPTIONS')
    @previous_node_path = ENV.delete('NODE_PATH')
  end

  def teardown
    Pod::Config.instance.installation_root = @previous_root
    ENV['REACT_NATIVE_NODE_MODULES_DIR'] = @previous_fallback
    ENV['NODE_OPTIONS'] = @previous_node_options
    ENV['NODE_PATH'] = @previous_node_path
    FileUtils.remove_entry(@root)
  end

  def write_package(directory, version)
    FileUtils.mkdir_p(directory)
    File.write(File.join(directory, 'package.json'), JSON.generate('version' => version))
  end

  def test_normal_react_native_package
    write_package(File.join(@root, 'node_modules/react-native'), '0.83.10')

    config = rnsvg_find_config

    assert_equal '0.83.10', config[:react_native_version]
    assert_equal 83, config[:react_native_minor_version]
    assert_equal File.realpath(File.join(@root, 'node_modules')), config[:react_native_node_modules_dir]
  end

  def test_symlinked_platform_fork_uses_the_package_resolved_by_node
    # Node follows the symlink to react-native-macos. A sibling react-native
    # package must not replace the package that Node actually resolved.
    packages = File.join(@root, 'packages')
    fork = File.join(packages, 'react-native-macos')
    write_package(fork, '0.83.0')
    write_package(File.join(packages, 'react-native'), '0.85.2')
    FileUtils.mkdir_p(File.join(@root, 'node_modules'))
    File.symlink(fork, File.join(@root, 'node_modules/react-native'))

    config = rnsvg_find_config

    assert_equal '0.83.0', config[:react_native_version]
    assert_equal 83, config[:react_native_minor_version]
    assert_equal File.realpath(packages), config[:react_native_node_modules_dir]
  end

  def test_explicit_fallback_when_node_resolution_returns_no_path
    fallback = File.join(@root, 'fallback/node_modules')
    write_package(File.join(fallback, 'react-native'), '0.82.1')
    ENV['REACT_NATIVE_NODE_MODULES_DIR'] = fallback
    receiver = Object.new
    receiver.define_singleton_method(:`) { |_command| '' }

    config = Dir.chdir(@root) { receiver.send(:rnsvg_find_config) }

    assert_equal '0.82.1', config[:react_native_version]
    assert_equal 82, config[:react_native_minor_version]
  end

  def test_nightly_version
    write_package(File.join(@root, 'node_modules/react-native'), '0.0.0-nightly-test')

    assert_equal 1000, rnsvg_find_config[:react_native_minor_version]
  end
end
