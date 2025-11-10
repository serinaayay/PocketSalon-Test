import { View, Text, Pressable, ScrollView, TextInput, Dimensions } from "react-native";
import { Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import Accordion from "@/components/Accordion";
import data from "./data";

const { width, height } = Dimensions.get('window');

const HomePage = () => {
  return (
    <View className="flex-1 h-full bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{paddingBottom: 100}} showsVerticalScrollIndicator={true}>
        <View className="bg-[#FFF2E4] w-full h-full flex-1 px-6 py-6">
          <Image
            source={require('../assets/images/Hello_Good_morning.png')}
            className="w-64 h-48 mb-0"
            resizeMode="contain"/>
          <Image
            source={require('../assets/images/Select_a_Category.png')}
            className="w-48 h-40 -mt-24 -mb-10"
            resizeMode="contain"/>
          
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4" contentContainerStyle={{ paddingLeft: 8 }}>
              <View className="flex-row space-x-20">
                <View className="items-center w-40">
                  <Pressable className="active:opacity-70" onPress={() => router.push('/hair-detection')}>
                    <View className="w-24 h-24 rounded-full bg-[#3F2305] justify-center items-center">
                      <Image source={require('../assets/images/capture (2).png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Detect</Text>
                </View>

                <View className="items-center w-40">
                    <Pressable className="active:opacity-70" onPress={() => router.push('/hair-damage-causes')}>
                    <View className="w-24 h-24 rounded-full bg-[#3F2305] justify-center items-center">
                      <Image source={require('../assets/images/question.png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Causes</Text>
                </View>

                <View className="items-center w-40">
                  <Pressable className="active:opacity-70" onPress={() => router.push('/healthy-hair-guide')}>
                    <View className="w-24 h-24 rounded-full bg-[#3F2305] justify-center items-center">
                      <Image source={require('../assets/images/hairdresser.png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Healthy Hair Guide</Text>
                </View>

                <View className="items-center w-40">
                  <Pressable className="active:opacity-70" onPress={() => router.push('/natural-remedies')}>
                    <View className="w-24 h-24 rounded-full bg-[#3F2305] justify-center items-center">
                      <Image source={require('../assets/images/healthy.png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Natural Remedies</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          <View className=" mt-6">
            <View className="bg-[#3F2305] rounded-xl p-4 mb-7 w-11/12 self-center">
              <Text className="text-white text-2xl font-bold mb-1">Did you know?</Text>
              <Text className="text-white text-xs mb-2">
                Did you know that knowing your hair type and hair damage level is crucial for effective hair care? 
                By understanding these factors, you can choose the right products and treatments to maintain healthy hair!
              </Text>
              <View className="flex-row justify-end">
                <Pressable className="bg-[#F2EAD3] px-4 py-3 rounded-lg flex-row items-center w-50 justify-center align-middle" onPress={() => router.push('/hair-detection')}>
                  <Text className="text-[#3F2305] text-xl font-extrabold">Start hair analysis</Text>
                </Pressable>
              </View>
            </View>
            <View className="bg-[#3F2305] rounded-xl p-4 w-11/12 self-center">
              <Text className="text-white text-2xl font-bold mb-1">Did you know?</Text>
              <Text className="text-white text-xs mb-2">
                Did you know that using right hair care products based on your hair type can significantly improve your hair health? 
                Different hair types have different needs, and using products tailored to your hair type can help maintain moisture, reduce damage, and enhance overall appearance!
              </Text>
              <View className="flex-row justify-end">
                <Pressable className="bg-[#F2EAD3] px-4 py-3 rounded-lg flex-row items-center w-50 justify-center"
                onPress={() => router.push('/healthy-hair-guide')}>
                    <Text className="text-[#3F2305] text-xl font-extrabold">Read more</Text>
                </Pressable>
              </View>
            </View>

            <View className="flex items-center justify-center mt-20">
              <Text className="text-[#3F2305] text-4xl font-bold text-center wrap-1 mb-5">Frequently Asked Questions (FAQs)</Text>
                {data.map((value, index) => {
                  return <Accordion value = {value} key = {index} />
                } )}
            </View>

            <Text className="text-[#3F2305] text-3xl font-bold text-center wrap-1 mb-5 mt-5">PocketSalon Chatbot</Text>
            <Pressable 
              onPress={() => router.push('/chatbot')}
              className="rounded-xl border-2 border-[#6C4E31] px-4 py-2 flex-row items-center self-center">
                <TextInput
                    placeholder="Still have other concerns? Ask me!"
                    placeholderTextColor="#000000ff"
                    className="flex-1 text-md"
                    editable={false}
                    pointerEvents="none"/>
                </Pressable>
          </View>
        </View>
      </ScrollView>
      <View className="absolute left-2 right-0 bottom-2 mb-10 ml-3 h-16 w-11/12 self-center bg-[#3F2305] rounded-full flex-row items-center px-2 py-2 shadow-lg">
            <View className="flex-1 flex-row justify-around">
                <View className="flex-col items-center">
                    <Pressable className="2 justify-center"
                    onPress={() => router.push('/homepage')}>
                        <Image
                        source={require('../assets/images/house 1.png')}
                        className="w-8 h-8"/>
                    </Pressable>
                </View>

                <View className="flex-col items-center">
                    <Pressable className="2 justify-center"
                    onPress={() => router.push('/hair-detection')}>
                    <Image
                        source={require('../assets/images/capture (1).png')}
                        className="w-9 h-9"/>
                    </Pressable>
                </View>

                <View className="flex-col items-center">
                    <Pressable className="2 justify-center"
                    onPress={() => router.push('/journal')}>
                    <Image
                        source={require('../assets/images/agenda 1.png')}
                        className="w-9 h-9"/>
                    </Pressable>
                </View>

                <View className="flex-col items-center">
                    <Pressable className="2 justify-center"
                    onPress={() => router.push('/favorites')}>
                    <Image
                        source={require('../assets/images/heart (1).png')}
                        className="w-9 h-9"/>
                    </Pressable>
                </View>

            </View>
      </View>
    </View>
  );
};

export default HomePage;