import { View, Text, Pressable, ScrollView, TextInput, Dimensions } from "react-native";
import { Image } from "react-native";
import React from "react";
import { router, usePathname } from "expo-router";
import Accordion from "@/components/Accordion";
import data from "./data";

const { width, height } = Dimensions.get('window');

const HomePage = () => {
  const pathname = usePathname();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  return (
    <View className="flex-1 h-full bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{paddingBottom: 100}} showsVerticalScrollIndicator={true}>
        <View className="bg-[#FFF2E4] w-full h-full flex-1 px-6 py-6">
          <View className="w-full h-48 mb-0 justify-center">
            <Text className="text-[#3F2305] text-4xl" adjustsFontSizeToFit={false}>
              <Text className="font-regular">Hello,</Text>
              {'\n'}
              <Text className="font-bold">{getGreeting()}!</Text>
            </Text>
          </View>
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
                Knowing your hair type and hair damage level is crucial for effective hair care.

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
                Using right hair care products based on your hair type can significantly improve your hair health.

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
      <View className="absolute bottom-5 self-center h-16 w-11/12 bg-[#3F2305] rounded-full flex-row items-center justify-around px-2 py-2 shadow-lg border-2 border-[#FFF2E4]">
                <Pressable 
                    onPress={() => router.push('/homepage')}
                    className="items-center justify-center"
                    style={{ width: 44, height: 44 }}>
                    <View className={`items-center justify-center ${pathname === '/homepage' ? 'bg-white rounded-full' : ''}`} style={{ width: 44, height: 44 }}>
                        <Image
                        source={require('../assets/images/house 1.png')}
                            style={{ width: 24, height: 24, tintColor: pathname === '/homepage' ? '#3F2305' : '#FFFFFF' }}
                            resizeMode="contain"/>
                    </View>
                    </Pressable>

                <Pressable 
                    onPress={() => router.push('/hair-detection')}
                    className="items-center justify-center"
                    style={{ width: 44, height: 44 }}>
                    <View className={`items-center justify-center ${pathname === '/hair-detection' ? 'bg-white rounded-full' : ''}`} style={{ width: 44, height: 44 }}>
                    <Image
                        source={require('../assets/images/capture (1).png')}
                            style={{ width: 24, height: 24, tintColor: pathname === '/hair-detection' ? '#3F2305' : '#FFFFFF' }}
                            resizeMode="contain"/>
                    </View>
                    </Pressable>

                <Pressable 
                    onPress={() => router.push('/journal')}
                    className="items-center justify-center"
                    style={{ width: 44, height: 44 }}>
                    <View className={`items-center justify-center ${pathname === '/journal' ? 'bg-white rounded-full' : ''}`} style={{ width: 44, height: 44 }}>
                    <Image
                        source={require('../assets/images/agenda 1.png')}
                            style={{ width: 24, height: 24, tintColor: pathname === '/journal' ? '#3F2305' : '#FFFFFF' }}
                            resizeMode="contain"/>
                    </View>
                    </Pressable>

                <Pressable 
                    onPress={() => router.push('/favorites')}
                    className="items-center justify-center"
                    style={{ width: 44, height: 44 }}>
                    <View className={`items-center justify-center ${pathname === '/favorites' ? 'bg-white rounded-full' : ''}`} style={{ width: 44, height: 44 }}>
                    <Image
                        source={require('../assets/images/heart (1).png')}
                            style={{ width: 24, height: 24, tintColor: pathname === '/favorites' ? '#3F2305' : '#FFFFFF' }}
                            resizeMode="contain"/>
                    </View>
                    </Pressable>
      </View>
    </View>
  );
};

export default HomePage;