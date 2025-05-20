import {View, Text, Image, Pressable, ScrollView, Dimensions} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { colorScheme } from 'nativewind';

const { width, height } = Dimensions.get('window');

// Map hair types to images
const hairTypeImages: { [key: string]: any } = {
  Straight: require('../assets/images/like.png'),
  Curly: require('../assets/images/curly.png'),
  Wavy: require('../assets/images/wavy-hair.png'),
  Kinky: require('../assets/images/coily.png'),
};

const hairTypeDescriptions: { [key: string]: string } = {
    Straight: "Your hair type is straight! Straight hair is easy to style and looks great with minimal effort. By using healthy and lightweight hair care products and regular trims, you can keep your hair light and fresh!",
    Curly: "Your hair type is curly! Curly hairs have distinct loops or ringlets and tends to be voluminous but can be prone to frizz and dryness. Maintaining and following a consistent, specialized care method to combat dryness and maintain definition will give you healthier curls with lasting definition!",
    Wavy: "You have wavy hair! Wavy hairs are also known as Type 2 hair. It naturally forms loose, S-shaped waves and a mix of straight and curly textures. With the proper hair care, your waves can stay defined, soft, and frizz-free! ",
    Kinky: "You have coily/kinky hair! Coily hairs are known as Type 3 hair as they exhibit closed curls or zig-zag patterns and are beautifully dense and full of texture. Carefully following a tailored routine will help strengthen your coils, elevate their definition, and showcase their natural elegance!",
  };

const ResultsScreen = () => {
    const params = useLocalSearchParams();
    const hairType = params.hair_type as string | undefined;
    const confidence = params.confidence as string | number | undefined;
    return (
        <View className="flex-1 bg-[#FFEAD2]">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
                <Text className="text-[#5B3E20] text-3xl font-light my-8 mx-8">
                    your hair is {"\n"}looking <Text className="font-semibold">great! </Text>
                </Text>
                <Text className="text-xl font-light text-[#5B3E20] mx-8 mt-5 mb-4">
                    Your hair type is..
                </Text>

                {/* Hair Type Row */}
                <View className="flex-row items-center my-3 mx-8">
                    <View className="items-center" style={{ width: width * 0.28 }}>
                        <View 
                            className="items-center justify-center bg-[#DDB184] rounded-full mr-5"
                            style={{ 
                                width: width * 0.30,
                                height: width * 0.30,
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                          {hairType && hairTypeImages[hairType] && (
                            <Image
                              source={hairTypeImages[hairType]}
                              style={{ width: '70%', height: '70%', resizeMode: 'contain' }}
                            />
                          )}
                        </View>
                        <Text className="text-base font-semibold mt-2 text-[#2D2D2D] mr-4">{hairType || 'Hair Type'}</Text>
                    </View>
                    {/* Hair Type description */}
                    <View className="bg-[#7A5E42] rounded-[15px] justify-center shadow-lg"
                        style={{ 
                            width: width * 0.6,
                            minHeight: height * 0.10,
                            marginLeft: width * 0.02
                        }}>
                        <Text className="text-white text-sm font-medium p-4 text-justify">
    
                            {hairType ? hairTypeDescriptions[hairType] : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                        </Text>
                    </View>
                </View>

                <View className="mx-8 my-8">
                    <Text className="text-m font-m mb-4 mr-5 text-[#5B3E20]">Confidence: {confidence ? `${(parseFloat(confidence as string) * 100).toFixed(2)}%` : ''}</Text>
                </View>

                {/* Hair Damage Row */}
                <View className="mx-8 my-4">
                    <Text className="text-xl font-light mb-4 text-[#5B3E20]">Hair Damage Check!</Text>
                    <View className="flex-row">
                        <View className="items-center" style={{ width: width * 0.28 }}>
                            <View 
                                className="items-center justify-center bg-[#DDB184] rounded-full mr-4"
                                style={{ 
                                    width: width * 0.30,
                                    height: width * 0.30,
                                }}/>
                            <Text className="text-base font-semibold mt-2 text-[#2D2D2D] mr-4">[Damage Type]</Text>
                        </View>
                        {/* Hair Damage description */}
                        <View 
                            className="bg-[#7A5E42] rounded-[15px] justify-center shadow-lg"
                            style={{ 
                                width: width * 0.6,
                                minHeight: height * 0.16,
                                marginLeft: width * 0.02
                            }}>
                            <Text className="text-white text-sm font-medium p-4 text-justify">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut ornare mi, vitae blandit odio. 
                                Nulla efficitur, dolor non vulputate malesuada, libero est rutrum urna, in pharetra arcu tortor in neque. 
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Product Recommendations Row */}
                <View className="mx-8 my-16">
                    <Text className="text-xl font-black mb-4 text-[#5B3E20] text-center">What Hair Products Can You Use?</Text>
                    <View className="w-full flex items-center">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="w-64 bg-[#B39473] rounded-xl shadow-lg mx-4 p-4 items-center">
                          <View className="w-full aspect-square bg-[#a88c6b] rounded-lg mb-4 flex justify-center items-center">
                            <Text className="text-white text-lg font-bold text-center">Product Name</Text>
                          </View>
                          <Text className="text-white text-sm text-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut ornare mi, vitae blandit odio. Nulla efficitur, dolor non vulputate malesuada, libero est rutrum urna, in pharetra arcu tortor in neque.
                          </Text>
                        </View>
                        {/* ...other product cards */}
                      </ScrollView>
                    </View>
                </View>
                <Text className="text-xl font-black mb-6 text-[#5B3E20] text-center">Natural Remedies for [Hair Damage]</Text>
                {/* Natural Remedies Section */}
                <View className="mx-8 mb-16">
                    <View className="bg-[#8B6842] rounded-xl p-4 mb-4 w-full shadow-lg">
                        <Text className="text-white text-lg font-bold mb-1">Product Name</Text>
                        <Text className="text-white text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut ornare mi, vitae blandit odio. Nulla efficitur, dolor non vulputate malesuada, libero est rutrum urna, in pharetra arcu tortor in neque.</Text>
                    </View>
                    {/* Add more remedy cards as needed */}
                </View>
            </ScrollView>

            <View className="absolute left-2 right-0 bottom-2 mb-10 ml-3 h-16 w-11/12 self-center bg-[#6C4E31] rounded-full flex-row items-center px-2 py-2 shadow-lg">
            {/* Home Icon */}
            <View className="flex-1 flex-row justify-around">
                <View className="flex-col items-center">
                    <Pressable className="2 justify-center"
                    onPress={() => router.push('/homepage')}>
                        <Image
                        source={require('../assets/images/home.png')}
                        className="w-8 h-8"/>
                    </Pressable>
                </View>
            {/* Detect Icon */}
                <View className="flex-col items-center">
                    <Pressable className="2 justify-center"
                    onPress={() => router.push('/hair-detection')}>
                    <Image
                        source={require('../assets/images/camera.png')}
                        className="w-9 h-9"/>
                    </Pressable>
                </View>
            {/* About Us Icon */}
                <View className="flex-col items-center">
                    <Image
                        source={require('../assets/images/about-us.png')}
                        className="w-9 h-9"/>
                </View>
            {/* Settings Icon */}
                <View className="flex-col items-center">
                    <Image
                        source={require('../assets/images/setting.png')}
                        className="w-8 h-8"/>
                </View>
            </View>
            </View>
        </View>
    );
};

export default ResultsScreen;