import React from 'react';
import Svg, {Line, Text} from 'react-native-svg';

const testCases = [
  {
    label: 'baseline',
    alignmentBaseline: 'baseline',
    baselineShift: '0',
  },
  {label: 'middle', alignmentBaseline: 'middle', baselineShift: '0'},
  {label: 'central', alignmentBaseline: 'central', baselineShift: '0'},
  {
    label: 'text-top',
    alignmentBaseline: 'text-top',
    baselineShift: '0',
  },
  {
    label: 'text-bottom',
    alignmentBaseline: 'text-bottom',
    baselineShift: '0',
  },
  {label: 'sub', alignmentBaseline: 'baseline', baselineShift: 'sub'},
  {label: 'super', alignmentBaseline: 'baseline', baselineShift: 'super'},
  {label: '15px shift', alignmentBaseline: 'baseline', baselineShift: '15px'},
  {
    label: '-15px shift',
    alignmentBaseline: 'baseline',
    baselineShift: '-15px',
  },
];

export default () => {
  return (
    <Svg height="500" width="200">
      {testCases.map((t, i) => {
        const y = 50 + i * 50;
        const verticalAlign = `${t.alignmentBaseline} ${t.baselineShift}`;

        return (
          <React.Fragment key={i}>
            <Line
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="darkgray"
              strokeDasharray="4,4"
            />
            <Text
              x="50"
              y={y}
              fontSize="20"
              verticalAlign={verticalAlign}
              transform="translate(20)"
              fill="black">
              {t.label}
            </Text>
          </React.Fragment>
        );
      })}
    </Svg>
  );
};
