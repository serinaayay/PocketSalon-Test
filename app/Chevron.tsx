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
            <Image source={require('../assets/images/chevron-down-arrow.png')} className="w-10 h-10 mr-3"/>
        </Animated.View>
    )
};

export default Chevron;