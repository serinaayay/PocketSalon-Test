import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, FlatList} from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const myData = [
      { id: 'breakage', title: 'Heat Damage', description: 'Overuse of hair styling tools, such as curling or flat irons and hair dryers, increases risks of damaging the hair cuticle from high heat.' },
      { id: 'breakage', title: 'Over Washing', description: 'Having an oily scalp does not mean washing your hair more often than you need to! Overwashing removes the hair\'s natural sebum which helps in keeping our hair moisturized.'},
      { id: 'breakage', title: 'Aggressive Brushing', description: 'Aggressive brushing while your hair is wet is a key cause of hair breakage, especially if you brush while hair is still tangled. Instead, use a wide-tooth comb to detangle, and comb later on. ' }
    ];

const categories = [
  { key: "breakage", label: "Breakage" },
  { key: "color damage", label: "Color Damage" },
  { key: "hair loss", label: "Hair Loss" },
];

const MyFlatList = () => {
      return (
        <FlatList
          data={myData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      );
    };

const hairDmgCauses = () => {
  const [selectedCategory, setSelectedCategory] = useState("breakage");
  const filteredRemedies = myData.filter(r => r.id === selectedCategory);

  return (
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
        {/* Header */}
        <Text className="text-4xl font-extrabold text-[#3F2305] mt-20 text-center mb-7">Hair Damage Causes</Text>

        {/* Category Selector */}
        <View className="flex-row justify-center mb-6">
          {categories.map(cat => (
            <Pressable
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              className={`px-2 py-2 mx-2 rounded-lg border-2 border-[#3F2305] ${selectedCategory === cat.key ? 'bg-[#74512D]' : 'bg-[#F2EAD3]'}`}>
              <Text className={`text-lg font-bold ${selectedCategory === cat.key ? 'text-white' : 'text-[#5B3E20]'}`}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Cards */}
        {filteredRemedies.map((remedy, idx) => (
          <View
            key={idx}
            className="flex-row bg-[#3F2305] rounded-lg mx-4 mt-2 mb-4 p-4 shadow-xl">
          
          <View className="flex-1 flex-row">
            <View className="w-24 h-24 bg-gray-300 rounded-md mt-2 mr-4"/>
            {/* Replace above View with <Image source={remedy.image} className="w-16 h-16 rounded-md mr-4" /> if you have images */}
            <View className="flex-1 mb-5">
              <Text className="text-white text-2xl font-bold">{remedy.title}</Text>
              <Text className="text-white text-md text-wrap-pretty w-72">{remedy.description}</Text>
            </View>
          </View>            
          </View>
        ))}
      </ScrollView>


      <View className="absolute left-2 right-0 bottom-2 mb-10 ml-3 h-16 w-11/12 self-center bg-[#3F2305] rounded-full flex-row items-center px-2 py-2 shadow-lg">
        {/* Home Icon */}
                    <View className="flex-1 flex-row justify-around">
                        <View className="flex-col items-center">
                            <Pressable className="2 justify-center"
                            onPress={() => router.push('/homepage')}>
                                <Image
                                source={require('../assets/images/house 1.png')}
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
                                source={require('../assets/images/agenda 1.png')}
                                className="w-9 h-9"/>
                        </View>
            </View>
      </View>
    </View>
  );
};

export default hairDmgCauses; 