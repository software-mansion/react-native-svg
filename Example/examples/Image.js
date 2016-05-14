import React, {
    Component
} from 'react';

import Svg, {
    Image,
    Defs,
    Circle,
    ClipPath,
    Text
} from 'react-native-svg';

class ImageExample extends Component{
    static title = 'Image';

    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Image
                x="5%"
                y="5%"
                width="90%"
                height="90%"
                href={require('../image.jpg')}
            />
        </Svg>;
    }
}

class ClipImage extends Component{
    static title = 'Clip Image';

    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Defs>
                <ClipPath id="clip">
                    <Circle cx="50%" cy="50%" r="40%"/>
                </ClipPath>
            </Defs>
            <Image
                x="5%"
                y="5%"
                width="90%"
                height="90%"
                href={require('../image.jpg')}
                clipPath="url(#clip)"
            />
            <Text
                x="50"
                y="50"
                textAnchor="middle"
                fontWeight="bold"
                fontSize="16"
                fill="red"
            >HOGWARTS</Text>
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Image
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        href={require('../image.jpg')}
    />
</Svg>;

const samples = [ImageExample, ClipImage];

export {
    icon,
    samples
};
