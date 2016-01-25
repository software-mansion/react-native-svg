/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    ScrollView,
    PixelRatio,
    TouchableHighlight,
    TouchableOpacity,
    Animated,
    Easing
} from 'react-native';

import {
    Svg,
    Circle,
    Line
} from 'react-native-art-svg';
import * as examples from './examples';
import Modal from 'react-native-root-modal';
const hairline = 1 / PixelRatio.get();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop: 20,
        alignItems: 'center',
        overflow: 'hidden'
    },
    content: {
        alignSelf: 'stretch',
        alignItems: 'center',
        borderTopWidth: hairline,
        borderTopColor: '#ccc',
        borderBottomWidth: hairline,
        borderBottomColor: '#ccc'
    },
    welcome: {
        padding: 10,
        color: '#f60',
        fontSize: 18,
        fontWeight: 'bold'
    },
    link: {
        marginHorizontal: 10,
        alignSelf: 'stretch'
    },
    title: {
        marginLeft: 10
    },
    cell: {
        height: 30,
        paddingHorizontal: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: hairline,
        borderTopColor: '#ccc',
        marginTop: -hairline,
        backgroundColor: 'transparent'
    },
    modal: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    close: {
        position: 'absolute',
        right: 20,
        top: 40
    },
    scroll: {
        position: 'absolute',
        top: 30,
        right: 10,
        bottom: 20,
        left: 10,
        backgroundColor: '#fff'
    },
    scrollContent: {
        borderTopWidth: hairline,
        borderTopColor: '#ccc'
    },
    example: {
        paddingVertical: 25,
        alignSelf: 'stretch',
        alignItems: 'center',
        borderBottomWidth: hairline,
        borderBottomColor: '#ccc'
    },
    sampleTitle: {
        marginHorizontal: 15,
        fontSize: 16,
        color: '#666'
    }
});

const names = ['Svg', 'Stroking', 'Path', 'Line', 'Rect', 'Polygon', 'Polyline', 'Circle', 'Ellipse', 'G', 'Text', 'Use', 'Symbol', 'Gradients'];

class ArtSvgExample extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            modal: false,
            scale: new Animated.Value(0)
        };
    }

    getSamples = (samples) => {
        return samples.map((Sample, i) => <View
            style={styles.example}
            key={`sample-${i}`}
        >
            <Text style={styles.sampleTitle}>
                {Sample.title}
            </Text>
            <Sample />
        </View>);
    };

    show = (name) => {
        if (this.state.modal) {
            return;
        }

        let example = examples[name];
        if (example) {
            let samples = example.samples;
            this.state.scale.setValue(0);
            Animated.spring(this.state.scale, {
                toValue: 1
            }).start();

            this.setState({
                modal: true,
                content: <View>
                    {this.getSamples(samples)}
                </View>
            });
        }
    };

    hide = () => {
        this.state.scale.setValue(1);
        Animated.timing(this.state.scale, {
            toValue: 0,
            easing: Easing.in(Easing.back(2))
        }).start(({finished}) => finished && this.setState({
            modal: false,
            content: null
        }));
    };

    getExamples = () => {
        return names.map(name => {
            var icon;
            let example = examples[name];
            if (example) {
                icon = example.icon;
            }
            return <TouchableHighlight
                style={styles.link}
                underlayColor="#ccc"
                key={`example-${name}`}
                onPress={() => this.show(name)}
            >
                <View
                    style={styles.cell}
                >
                    {icon}
                    <Text style={styles.title}>{name}</Text>
                </View>
            </TouchableHighlight>
        });
    };

    render() {
        return <View style={styles.container}>
            <Animated.Modal
                visible={this.state.modal}
                style={[styles.modal, {
                    transform: [{scale: this.state.scale}]
                }]}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                >
                    {this.state.content}
                </ScrollView>
                <View
                    style={styles.close}
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.hide}
                    >
                        <Svg
                            height="20"
                            width="20"
                        >
                            <Circle
                                cx="10"
                                cy="10"
                                r="10"
                                fill="red"
                            />
                            <Line
                                x1="4"
                                y1="4"
                                x2="16"
                                y2="16"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                            <Line
                                x1="4"
                                y1="16"
                                x2="16"
                                y2="4"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                        </Svg>
                    </TouchableOpacity>
                </View>
            </Animated.Modal>
            <Text style={styles.welcome}>
                SVG by ART!
            </Text>
            <View style={styles.content}>
                {this.getExamples()}
            </View>
        </View>;
    }
}

AppRegistry.registerComponent('ArtSvgExample', () => ArtSvgExample);
