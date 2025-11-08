import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import Chevron from '../app/Chevron';
import { Category } from '../app/data';

type AccordionProps = {
  value: Category;
};

const Accordion = ({ value }: AccordionProps) => {
  const [open, setOpen] = useState(false);

  const progress = useSharedValue(0);

  const toggle = () => {
    setOpen(!open);
    progress.value = withTiming(!open ? 1 : 0, { duration: 300 });
  };

  // animation
  const heightAnimation = useAnimatedStyle(() => ({
    maxHeight: interpolate(progress.value, [0, 1], [0, value.content.length * 200]), // 24 = approx height per item
    overflow: 'scroll',
  }));

  return (
    <View className="my-4 border-[#5B3E20] border-t-2 border-b-2">
      <Pressable
        className="flex-row justify-between items-center px-4 py-3"
        onPress={toggle}>
        
        <View className="flex-row items-center">
        <Text className="flex-1 text-xl text-[#3F2305] font-semibold whitespace-normal mt-2">
          {value.title}
        </Text>
        <Chevron progress={progress}/>
        </View>

      </Pressable>

      <Animated.View style={heightAnimation} className="text-xl mb-2">
        {value.content.map((v, i) => (
          <View key={i} className="py-[-5] px-4">
            <Text>{v}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default Accordion;