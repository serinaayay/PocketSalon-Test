import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, Modal, } from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const remedies = [
  {
    name: "Rosemary Oil",
    description:
      "Rosemary oil stimulates hair growth and improves circulation to the scalp.",
    category: "hair loss",
    howToUse: "Mix a few drops with a carrier oil (like coconut oil) to dilute and massage into the scalp. Leave at least a few minutes before washing out.",
    image: require('../assets/images/Natural Remedies Images/rosemary oil.jpg'),
  },
  {
    name: "Peppermint Oil",
    description:
      "Peppermint oil has been shown to promote hair growth by increasing blood flow to the scalp.",
    category: "hair loss",
    howToUse: "Dilute a few drops (1-2 drops) in a carrier oil and massage into the scalp. Leave for at least an hour before rinsing, then repeat for at least one month.",
    image: require('../assets/images/Natural Remedies Images/peppermint oil.jpg'),
  },
  {
    name: "Scalp Massage",
    description:
      "Regular scalp massages can improve blood circulation and stimulation of hair follicles, promoting hair growth. ",
    category: "hair loss",
    howToUse: "Use can use your fingertips or scalp massagers to gently massage your scalp in circular motions for 5-10 minutes daily. You can also apply oils like coconut or jojoba oil during the massage for added benefits.",
    image: require('../assets/images/Natural Remedies Images/scalp massage.jpg'),
  },
  {
    name: "Rice Water",
    description:
      "Rice water is rich in vitamins and minerals that can strengthen hair and reduce breakage. ",
    category: ["breakage", "color damage"],
    howToUse: "To make rice water, rinse 1/2 cup of rice thoroughly, then soak it in 2-3 cups of water for 30 minutes. Strain the rice and use the water as a final rinse after shampooing, then wash your hair right after.",
    image: require('../assets/images/Natural Remedies Images/rice water.jpg'),
  },
  {
    name: "Jojoba Oil",
    description:
      "Jojoba oil has an oily composition, making it an excellent moisturizer for dry, brittle hair. ",
    category: ["breakage", "hair loss"],
    howToUse: "Apply a few drops to your fingers and spread evenly from the roots to its tips ends of your hair. Leave it on for at least 30 minutes before washing out with a gentle shampoo. You also can use it as a leave-in conditioner.",
    image: require('../assets/images/Natural Remedies Images/jojoba oil.jpg'),
  },
  {
    name: "Coconut Oil",
    description:
      "Coconut oil penetrates the hair shaft, reducing protein loss and preventing breakage.",
    category: "breakage",
    howToUse: " Warm a small amount of coconut oil and apply over damp hair, focusing on the ends. Leave it on for at least 1-2 hours before washing out with shampoo and conditioner.",
    image: require('../assets/images/Natural Remedies Images/coconut oil.jpg'),
  },
  {
    name: "Avocado Oil",
    description:
      "Avocado oil is rich in vitamins A, D, and E, which nourish and strengthen hair.",
    category: ["breakage","color damage"],
    howToUse: "To use as a hair mask, mash half an avocado (after removing the stone and peel), mix it with one egg yolk and a tablespoon of honey, apply the mixture to clean, damp hair for 30 minutes, then rinse and dry — this treatment can be used once every two weeks for shinier, healthier hair.",
    image: require('../assets/images/Natural Remedies Images/avocado oil.jpg'),
  },
  {
    name: "Almond Oil",
    description:
      "Almond oil is rich in vitamin E and fatty acids that help repair and protect color-treated hair. It deeply hydrates and nourishes the hair, reducing damage caused by chemical treatments like hair dyes",
    category: "color damage",
    howToUse: "Apply a dime-sized amount to the ends of your hair before drying to rehydrate the strands and decrease frizz.",
    image: require('../assets/images/Natural Remedies Images/almond oil.jpg'),
  },
  {
    name: "Honey",
    description:
      "Honey is a natural humectant that helps retain moisture in color-treated hair, preventing dryness and brittleness.",
    category: "color damage",
    howToUse: "To use as a hair mask, mash half an avocado (after removing the stone and peel), mix it with one egg yolk and a tablespoon of honey, apply the mixture to clean, damp hair for 30 minutes, then rinse and dry — this treatment can be used once every two weeks for shinier, healthier hair.",
    image: require('../assets/images/Natural Remedies Images/honey.jpg'),
  },
  {
    name: "Olive Oil",
    description:
      "This cooking oil is rich in antioxidants and vitamins that help repair and strengthen color-damaged hair.",
    category: "color damage",
    howToUse: "Measure about 1–2 tablespoons (or around ¼ cup if you’re treating longer, thicker hair). Massage the oil deeply into your hair, on the scalp if it’s dry, or the ends if they’re damaged, then wrap your hair in a shower cap and leave it on for at least 15 minutes. After the treatment, comb your hair with a wide-toothed comb, then shampoo thoroughly (you may need to shampoo twice depending on how much oil you used) and rinse",
    image: require('../assets/images/Natural Remedies Images/olive oil.jpg'),
  },
  {
    name: "Aloe Vera",
    description:
      "Aloe vera soothes the scalp and conditions hair, reducing dandruff and promoting healthy hair growth. It contains vitamin A, C, and E, which are essential for healthy hair, and Vitamin B12 and Folic Acid that help prevent hair loss.",
    category: ["color damage", "hair loss"],
    howToUse: "Scoop out fresh aloe vera gel (or use pure aloe vera gel) and apply it evenly to your scalp and hair, focusing on the ends if they’re prone to breakage. Cover your hair with a shower cap and leave it on for 30–60 minutes. Rinse thoroughly with a mild shampoo. Use this once a week to help strengthen and nourish your hair.",
    image: require('../assets/images/Natural Remedies Images/aloe vera.jpg'),
  },


];

const categories = [
  { key: "breakage", label: "Breakage" },
  { key: "color damage", label: "Color Damage" },
  { key: "hair loss", label: "Hair Loss" },
];

const NaturalRemedies = () => {
  const [selectedCategory, setSelectedCategory] = useState("breakage");
  const filteredRemedies = remedies.filter(r =>
  Array.isArray(r.category)
    ? r.category.includes(selectedCategory)
    : r.category === selectedCategory);

  const [showDisclaimer, setShowDisclaimer] = React.useState(true);
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  return (
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
        {/* Header */}
        <Text className="text-4xl font-extrabold text-[#3F2305] mt-20 text-center mb-7">Natural Remedies</Text>

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


      {/* Disclaimer Modal */}
      <Modal visible={showDisclaimer} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-11/12 items-center">
            <View className="w-full bg-[#3F2305] rounded-2xl px-5 py-4 mb-4">
              <Text className="text-[#FAF7F0] italic text-base text-center">
                Disclaimer: This application is experimental. Consult an expert.
              </Text>
            </View>
            <Pressable
              onPress={() => setShowDisclaimer(false)}
              className="bg-[#F2EAD3] px-5 py-2 rounded-xl">
              <Text className="text-[#3F2305] font-semibold">OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


        {/* Remedy Cards */}
        {filteredRemedies.map((remedy, idx) => {
          return (
            <Pressable
                  key={idx}
                  onPress={() => {
                    setExpandedIndex(expandedIndex === idx ? null : idx);
                  }}
                  className="bg-[#3F2305] rounded-lg mx-4 mt-2 mb-6 p-4 shadow-xl active:opacity-90"
                  style={{ overflow: 'hidden' }}
                >
              <View className="flex-row items-center">
                {remedy.image && (
                  <Image
                    source={remedy.image}
                    className="w-28 h-28 rounded-md mr-4"/>)}
                    
                <View style={{ flex: 1 }}>

                  <Text className="text-white text-2xl font-bold mb-1">
                    {remedy.name}
                  </Text>

                  <Text className="text-white text-base leading-5 text-justify">
                    {remedy.description}
                  </Text>

                  {expandedIndex !== idx && (
                    <Text className="text-white italic text-sm mt-5">
                      Tap to see how to use
                    </Text>
                  )}
                </View>
              </View>

              {/* Expanded Section */}
              {expandedIndex === idx && (
                <View className="mt-3 border-t border-[#F2EAD3]/40 pt-3">
                  <Text className="text-white text-base leading-5 text-justify">
                    {remedy.howToUse}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

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
};

export default NaturalRemedies; 