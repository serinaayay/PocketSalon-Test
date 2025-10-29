import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, Animated, TextInput} from "react-native";
import { router } from "expo-router";
import { Svg, Circle, G} from "react-native-svg";
const { width, height } = Dimensions.get('window');

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);


const journal = () => {
  const size = width * 0.40;
  const strokeWidth = 18;
  const center = size / 2;
  const max = 100;
  const delay = 0;
  const duration = 500;
  const radius = (size - strokeWidth) / 2;
  const percentage = 75;
  const circumference = 2 * Math.PI * radius;
const circleRef = React.useRef<Circle | null>(null)


  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const animation = (toValue: any) => {
    return Animated.timing(animatedValue,{
      toValue,
      duration,
      delay,
      useNativeDriver: true
    }).start();
  }
  React.useEffect(() => {
    animation(percentage)
    
    animatedValue.addListener(v =>{
      if (circleRef?.current) {
        const maxPercentage = 100 * v.value / max;
        const strokeDashoffset = circumference - (circumference * maxPercentage) / 100; 
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    })
    return () => {
      animatedValue.removeAllListeners();
    }
  });


  return (
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
        {/* Header */}
        <Text className="text-[40px] font-extrabold text-[#3F2305] mt-20 text-center mb-32">Your Hair Journey</Text>
        {/* test chart */}
        
      <View className="flex-row justify-end items-center mr-7 py-3">
        <View className="flex-1 bg-[#3F2305] rounded-md mt-2 mr-4 ml-4">
          <Text className="text-white text-lg font-medium mb-1 ml-3 align-left">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing 
            elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. 
            Placerat in id cursus mi pretium tellus duis.
          </Text>
        </View>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation='-90' origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke = {'green'}
            strokeWidth={strokeWidth}
            fill={"transparent"}
            strokeOpacity={0.5}/>
          
          <AnimatedCircle 
            ref={circleRef}
            cx={center}
            cy={center}
            r={radius}
            stroke = {'green'}
            strokeWidth={strokeWidth}
            fill={"transparent"}
            strokeDasharray = {circumference}
            strokeDashoffset={circumference / 2}
            strokeLinecap="round"/>
          </G>
        </Svg>
      </View>
      </ScrollView>
      <View className="absolute left-2 right-0 bottom-2 mb-10 ml-3 h-16 w-11/12 self-center bg-[#3F2305] rounded-full flex-row items-center px-2 py-2 shadow-lg">
        {/* Home Icon */}
                    <View className="flex-1 flex-row justify-around">
                        <View className="flex-col items-center">
                            <Pressable className="2 justify-center"
                            onPress={() => router.push('/homepage')}>
                                <Image
                                source={require('../assets/images/home_icon.png')}
                                className="w-8 h-8"/>
                            </Pressable>
                        </View>
                    {/* Detect Icon */}
                        <View className="flex-col items-center">
                            <Pressable className="2 justify-center"
                            onPress={() => router.push('/hair-detection')}>
                            <Image
                                source={require('../assets/images/capture (1).png')}
                                className="w-9 h-9"/>
                            </Pressable>
                        </View>
                    {/* Journal Icon */}
                        <View className="flex-col items-center">
                            <Image
                                source={require('../assets/images/like.png')}
                                className="w-9 h-9"/>
                        </View>
            </View>
      </View>
    </View>
  );
};

export default journal; 