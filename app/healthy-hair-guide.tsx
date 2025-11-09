import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions } from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const productList = [
  {
    name: "Davines OI Shampoo",
    description:
      "Gentle daily shampoo with Roucou oil for soft, shiny, and manageable hair, suitable for all hair types.",
    category: ["all", "straight", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/davines ol shampoo.jpg')
  },
  {
    name: "L'Oréal Paris EverPure Moisture Shampoo",
    description:
      "Sulfate- and paraben-free shampoo that hydrates, protects color, and keeps straight hair soft and shiny.",
    category: ["straight"],
    image: require('../assets/images/healthy-hair-guide-images/loreal everpure.png'),
  },
  {
    name: "Kérastase Discipline Bain Fluidealiste Gentle Shampoo",
    description:
      "Sulfate-free smoothing shampoo that tames frizz, softens hair, and enhances movement for straight and curly hair.",
    category: ["straight", "curly"],
    image: require('../assets/images/healthy-hair-guide-images/kerastase.jpg'),
  },
  {
    name: "Human Nature Revitalizing Shampoo",
    description:
      "Natural, SLS- and paraben-free shampoo that revitalizes straight hair, locks in moisture, and balances the scalp.",
    category: ["straight"],
    image: require('../assets/images/healthy-hair-guide-images/hhn revitalizing shampoo.jpg'),
  },
  {
    name: "Zenutrients Coco Honey Nourishing Shampoo",
    description:
      "Gentle, natural shampoo with coconut and honey extracts that nourishes and adds shine to straight hair.",
    category: "straight",
    image: require('../assets/images/healthy-hair-guide-images/coco honey zenutrients.png'),
  },
  {
    name: "HairReve Sulfate-Free Shampoo",
    description:
      "Sulfate- and paraben-free shampoo with Argan and Moringa oils that softens, smooths, and protects straight hair.",
    category: "straight",
    image: require('../assets/images/healthy-hair-guide-images/hairreve.jpg'),
  },
   {
    name: "Curls by Zenutrients Avocado & Tea Tree Sulfate‑Free Shampoo",
    description:
      "Gently cleanses and nourishes curls with avocado and tea tree oils, leaving hair soft, shiny, and manageable. Free of sulfates, parabens, proteins, and silicones, it protects delicate curls from damage. Ideal for wavy, curly, or coily hair that needs moisture and definition.",
    category: ["all", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/curls by zenutrients.png'),
  },
  {
    name: "Luxe Organix Curl Define Intensive Hydration Daily Shampoo",
    description:
      "Hydrates and revives natural curls with jojoba, avocado, and Moroccan oils. Its silicone- and SLS-free formula gently cleanses while enhancing curl definition and bounce. Perfect for everyday use on wavy, curly, or coily hair.",
    category: ["all", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/luxe organix curl define.png'),
  },
  {
    name: "Human Nature Moisturizing Shampoo",
    description:
      "A natural, sulfate- and paraben-free shampoo that nourishes dry hair with coco-nectar, aloe vera, and avocado. Softens strands while locking in moisture and improving manageability. Suitable for all wavy, curly, and coily hair types.",
    category: ["all", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/hhn moisturizing shampoo.png'),
  },
  {
    name: "Human Nature Moisturizing Natural Conditioner",
    description:
      "Enriched with plant-based oils, this natural conditioner smooths and softens strands while restoring moisture. Helps detangle and enhance shine without weighing hair down. Perfect for wavy, curly, or coily hair in need of hydration.",
    category: ["all", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/hhn conditioner.jpg'),
  },
  {
    name: "Zenutrients Gugo Strengthening Conditioner",
    description:
      "Strengthens and thickens hair naturally using gugo bark extract, helping to reduce breakage. Leaves hair soft, resilient, and fuller-looking. Ideal for wavy, curly, and coily hair that needs reinforcement and protection.",
    category: ["all", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/zenutrients-gugo-strengthening-conditioner-1561700736.jpg'),
  },
  {
    name: "V05 Extra Body Volumizing Conditioner",
    description:
      "Adds lift, bounce, and body to fine or limp hair with a blend of collagen and vitamins. Lightweight formula nourishes without weighing hair down, leaving strands full and manageable. Suitable for all hair types, especially straight hair that needs extra volume.",
    category: ["all", "straight", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/v05.jpg'),
  },
  {
    name: "Curls by Zenutrients Avocado & Tea Tree Sulfate‑Free Conditioner",
    description:
      "Moisturizes, detangles, and protects curls using avocado and tea tree oils. Free of sulfates and parabens, it strengthens hair while adding shine and softness. Perfect for wavy, curly, or coily hair in need of gentle care.",
    category: ["all", "wavy", "curly", "coily"],
    image: require('../assets/images/healthy-hair-guide-images/curls conditioner.png'),
  },
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
            style={{ alignItems: 'center' }}>
          
            {item.image && (
            <Image source={item.image} className="w-32 h-32 rounded-md mr-4" resizeMode="cover" />
            )}
            <View style={{ flex: 1 }}>
              <Text className="text-white text-2xl font-bold mb-1">{item.name}</Text>
              <Text className="text-white text-md leading-5 text-justify">{item.description}</Text>
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
} 