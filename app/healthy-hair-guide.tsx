import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions } from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const productList = [
  {
    name: "Davines OI Shampoo",
    description:
      "A gentle daily shampoo, ideal for any hair type, that cleanses and nourishes the hair, leaving it soft and manageable.",
    category: ["all", "straight", "wavy", "curly", "coily"],
    image: require('../assets/images/davines ol shampoo.jpg')
  },
  {
    name: "L'Oréal Paris EverPure Moisture Shampoo",
    description:
      "Keep your straight hair soft and hydrated with this sulfate-free formula infused with rosemary. It gently cleanses while preserving color and shine, leaving your hair smooth and frizz-free.",
    category: "straight",
    image: require('../assets/images/loreal everpure.png'),
  },
  {
    name: "Kérastase Discipline Bain Fluidealiste Gentle Shampoo",
    description:
      "A luxurious, gentle shampoo designed to tame frizz and smooth unruly hair. Perfect for straight and curly types, it leaves hair feeling silky, manageable, and full of movement without weighing it down.",
    category: ["straight", "curly"],
    image: require('../assets/images/kerastase.jpg'),
  },
  {
    name: "Human Nature Revitalizing Shampoo",
    description:
      "Made with 96.4% natural ingredients, this refreshing shampoo helps bring life back to dull, straight hair. It cleans deeply while keeping strands healthy and bouncy — all without harsh chemicals.",
    category: "straight",
    image: require('../assets/images/hhn revitalizing shampoo.jpg'),
  },
  {
    name: "Zenutrients Coco Honey Nourishing Shampoo",
    description:
      "Combining the moisture of coconut oil and the soothing properties of honey, this nourishing shampoo softens and strengthens straight hair. It helps reduce dryness while keeping your scalp healthy and hydrated.",
    category: "straight",
    image: require('../assets/images/coco honey zenutrients.png'),
  },
  {
    name: "HairReve Sulfate-Free Shampoo",
    description:
      "A gentle yet effective sulfate-free formula made for sensitive scalps and straight hair. It cleanses without stripping natural oils, promoting smoother, shinier strands with every wash.",
    category: "straight",
    image: require('../assets/images/hairreve.jpg'),
  }
];

const categories = [
  { key: "all", label: "All" },
  { key: "straight", label: "Straight" },
  { key: "wavy", label: "Wavy" },
  { key: "curly", label: "Curly" },
  { key: "coily", label: "Coily" },
];

export default function HealthyHairGuide() {
  const [selectedCategory, setSelectedCategory] = useState("all");
    const filteredRemedies =
    selectedCategory === "all"
      ? productList
      : productList.filter((r) => r.category.includes(selectedCategory));

  return (
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
        {/* Header */}
        <Text className="text-4xl font-extrabold text-[#3F2305] mt-20 text-center mb-7">Healthy Hair Guide</Text>
        
        {/* Category Selector */}
        <View className="flex-row justify-center mb-6">
          {categories.map((cat) => (
            <Pressable
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              className={`px-2 py-2 mx-2 rounded-lg border-2 border-[#3F2305] 
              ${selectedCategory === cat.key ? 'bg-[#74512D]' : 'bg-[#F2EAD3]'}`}>

              <Text className={`text-lg font-bold ${selectedCategory === cat.key ? 'text-white' : 'text-[#5B3E20]'}`}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Remedy Cards */}

        {filteredRemedies.map((item, idx) => (
          <View
            key={idx}
            className="flex-row bg-[#3F2305] rounded-lg mx-4 mt-2 mb-6 p-4 shadow-xl"
            style={{ alignItems: 'flex-start' }}>
            
          <View className="flex-row items-center">
            {item.image && (
            <Image source={item.image} className="w-28 h-28 rounded-md mr-4 flex-center justify-center items-center" />
            )}
            <View style={{ flex: 1 }}>
              <Text className="text-white text-2xl font-bold mb-1">{item.name}</Text>
              <Text className="text-white text-md leading-5 text-justify">{item.description}</Text>
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
                            <Pressable className="2 justify-center"
                            onPress={() => router.push('/journal')}>
                            <Image
                                source={require('../assets/images/agenda 1.png')}
                                className="w-9 h-9"/>
                            </Pressable>
                        </View>
                    {/* Heart Icon */}
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
} 