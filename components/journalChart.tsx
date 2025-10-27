import React from "react";
import { View, Text, Dimensions} from "react-native";
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
const { width, height } = Dimensions.get('window');

const journalChart = () => {
  const size = width - 100;
  const strokeWidth = 35;
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
    return (
        <View>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill = {'blue'}
            originX={center}
            originY={center}
            strokeWidth={strokeWidth}/>
        </Svg>


        </View>
    )
}

export default journalChart