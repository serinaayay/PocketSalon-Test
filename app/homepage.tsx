import { View, Text, Pressable, ScrollView } from "react-native";
import { Image } from "react-native";
import React from "react";
import { router } from "expo-router";

const HomePage = () => {
  return (
    <View className="flex-1 bg-transparent">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="bg-[#FFEAD2] rounded-xl w-full flex-1 px-6 py-6">
          <Image
            source={require('../assets/images/Hello_Good_morning.png')}
            className="w-64 h-48 mb-0"
            resizeMode="contain"
          />
          <Image
            source={require('../assets/images/Select_a_Category.png')}
            className="w-48 h-40 -mt-24 -mb-10"
            resizeMode="contain"
          />
          {/* Detect */}
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4" contentContainerStyle={{ paddingLeft: 8 }}>
              <View className="flex-row space-x-20">
                <View className="items-center w-40">
                  <Pressable className="active:opacity-70" onPress={() => router.push('/hair-detection')}>
                    <View className="w-24 h-24 rounded-full bg-[#6C4E31] justify-center items-center">
                      <Image source={require('../assets/images/camera.png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Detect</Text>
                </View>

                <View className="items-center w-40">
                  <Pressable className="active:opacity-70">
                    <View className="w-24 h-24 rounded-full bg-[#6C4E31] justify-center items-center">
                      <Image source={require('../assets/images/question.png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Causes</Text>
                </View>

                <View className="items-center w-40">
                  <Pressable className="active:opacity-70">
                    <View className="w-24 h-24 rounded-full bg-[#6C4E31] justify-center items-center">
                      <Image source={require('../assets/images/hairdresser.png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Healthy Hair Guide</Text>
                </View>

                <View className="items-center w-40">
                  <Pressable className="active:opacity-70" onPress={() => router.push('/natural-remedies')}>
                    <View className="w-24 h-24 rounded-full bg-[#6C4E31] justify-center items-center">
                      <Image source={require('../assets/images/healthy.png')} className="w-14 h-14"/>
                    </View>
                  </Pressable>
                  <Text className="text-xl text-[#5B3E20] mt-1 text-center">Natural Remedies</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          {/* Info Cards */}
          <View className=" mt-6">
            <View className="bg-[#5B3E20] rounded-xl p-4 mb-4 w-11/12 self-center">
              <Text className="text-white text-2xl font-bold mb-1">Info</Text>
              <Text className="text-white text-xs mb-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut ornare mi, vitae blandit odio...
              </Text>
              <View className="flex-row justify-end">
                <Pressable className="bg-[#FFE4C4] px-4 py-2 rounded-lg flex-row items-center w-32 justify-center">
                  <Text className="text-[#6C4E31] text-lg font-bold mr-2">Try now!</Text>
                  <Text className="text-[#6C4E31] text-lg">→</Text>
                </Pressable>
              </View>
            </View>
            <View className="bg-[#5B3E20] rounded-xl p-4 w-11/12 self-center">
              <Text className="text-white text-2xl font-bold mb-1">Info</Text>
              <Text className="text-white text-xs mb-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Maecenas ut ornare mi, vitae blandit odio...
              </Text>
              <View className="flex-row justify-end">
                <Pressable className="bg-[#FFE4C4] px-4 py-2 rounded-lg flex-row items-center w-32 justify-center"
                onPress={() => router.push('/hair-detection')}>
                  
                  <Text className="text-[#6C4E31] text-m font-bold mr-2">Read more</Text>
                  <Text className="text-[#6C4E31] text-lg">→</Text>
                </Pressable>
              </View>
            </View>
          </View>
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

export default HomePage;