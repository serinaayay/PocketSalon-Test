import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions } from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const remedies = [
  {
    name: "Aloe Vera",
    description:"Aloe vera soothes the scalp, conditions hair, and can reduce dandruff.",
    use: "Apply fresh aloe gel to your scalp and hair, leave for 30 minutes, then rinse.",
    category: "breakage",
    image: require('../assets/images/aloe.jpg'),
  },
  {
    name: "Coconut Oil",
    description:"Coconut oil deeply moisturizes and repairs damaged hair.",
    use: "Warm a small amount, massage into scalp and hair, leave for at least 1 hour, then wash out.",
    category: "color damage",
    image: require('../assets/images/coconut oil.jpg'),
  },
  {
    name: "Egg Mask",
    description:"Eggs are rich in protein and help strengthen hair.",
    use: "Mix one egg with a tablespoon of olive oil, apply to hair, leave for 20 minutes, then rinse with cool water.",
    category: "hair loss",
    image: require('../assets/images/egg mask.jpg'),
  },
  {
    name: "Avocado",
    description:"Loaded with vitamins (B, C, E, K), minerals, and fatty acids, it helps prevent breakage and dryness.",
    use: "Mash half a ripe avocado and mix with 1 tablespoon of coconut or almond oil. Apply from roots to ends, leave on for 30 minutes, and rinse.",
    category: "breakage",
    image: require('../assets/images/avodado.jpg'),
  },
  {
    name: "Honey",
    description:"Loaded with vitamins (B, C, E, K), minerals, and fatty acids, it helps prevent breakage and dryness.",
    use: "Mix with a carrier oil or add to an egg/yogurt mask.",
    category: "breakage",
    image: require('../assets/images/honey.jpg'),
  },
  {
    name: "Rosemary Oil",
    description:"Stimulates blood circulation in the scalp, promoting nutrient delivery to hair follicles, and may be as effective as some conventional hair growth treatments.",
    use: "Mix a few drops (3-5) into a tablespoon of a carrier oil (like coconut or jojoba) and massage it into your scalp for a few minutes. Leave on for at least 30 minutes before shampooing",
    category: "hair loss",
    image: require('../assets/images/rosemary oil.jpg'),
  },
];

const categories = [
  { key: "breakage", label: "Breakage" },
  { key: "color damage", label: "Color Damage" },
  { key: "hair loss", label: "Hair Loss" },
];

const NaturalRemedies = () => {
  const [selectedCategory, setSelectedCategory] = useState("breakage");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const filteredRemedies = remedies.filter(r => r.category === selectedCategory);

  return (
    <View className="flex-1 bg-[#F9E5C6]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
        {/* Header */}
        <Text className="text-4xl font-extrabold text-[#5B3E20] mt-16 mb-4 mx-6">Natural Remedies</Text>
        {/* Category Selector */}
        <View className="flex-row justify-center mb-6">
          {categories.map(cat => (
            <Pressable
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 mx-2 rounded-full ${selectedCategory === cat.key ? 'bg-[#8B6842]' : 'bg-[#E5CBAF]'}`}
            >
              <Text className={`text-base font-bold ${selectedCategory === cat.key ? 'text-white' : 'text-[#5B3E20]'}`}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>
        {/* Remedy Cards */}
        {filteredRemedies.map((remedy, idx) => (
          <Pressable
            key={idx}
            onPress={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            className="bg-[#8B6842] rounded-xl mx-4 mt-2 mb-6 p-4 shadow-lg"
          >
            <View className="flex-row" style={{ alignItems: 'flex-start' }}>
              <Image 
                source={remedy.image} 
                className="w-20 h-20 rounded-md mr-4" 
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text className="text-white text-xl font-bold mb-1">{remedy.name}</Text>
                <Text className="text-white text-xs">{remedy.description}</Text>
              </View>
            </View>
            
            {/* Expandable "How to Use" Section */}
            {expandedIndex === idx && (
              <View className="mt-4 pt-4 border-t border-white/30">
                <Text className="text-white text-sm font-bold mb-2">How to Use:</Text>
                <Text className="text-white text-xs leading-5">{remedy.use}</Text>
              </View>
            )}
          </Pressable>
        ))}
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

export default NaturalRemedies; 