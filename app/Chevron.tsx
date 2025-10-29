import {Text, View,Image } from 'react-native';
import React, { useState } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

type chevronProps = {
    progress: Animated.SharedValue<number>
};

const Chevron = ({progress}: chevronProps) => {
    const iconAnimate = useAnimatedStyle(() => ({
        transform: [{rotate: `${progress.value * -180}deg`}]
    }))
    return (
        <Animated.View style={iconAnimate}>
            <Text style={{ fontSize: 24, color: '#5B3E20' }}>▼</Text>
        </Animated.View>
    )
};

export default Chevron;