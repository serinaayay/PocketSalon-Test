import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, FlatList} from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const myData = [
      { id: 'breakage', title: 'Heat Damage', description: 'Overuse of hair styling tools, such as curling or flat irons and hair dryers, increases risks of damaging the hair cuticle from high heat.', Image: require('../assets/images/heat damage.jpg') },
      { id: 'breakage', title: 'Over Washing', description: 'Having an oily scalp does not mean washing your hair more often than you need to! Overwashing removes the hair\'s natural sebum which helps in keeping our hair moisturized.', Image: require('../assets/images/over washing hair.jpg')},
      { id: 'breakage', title: 'Aggressive Brushing', description: 'Aggressive brushing while your hair is wet is a key cause of hair breakage, especially if you brush while hair is still tangled. Instead, use a wide-tooth\ncomb to detangle, and comb later on. ', Image: require('../assets/images/aggressive brushing.jpg') },
      { id: 'breakage', title: 'Over processing', description: 'Frequent chemical treatments, such as coloring, perming, and relaxing can weaken hair structure, leading to increased breakage especially if it is done too often, as the hair cuticle can break down and cause hair damage.', Image: require('../assets/images/hair coloring.jpg') },
      { id: 'breakage', title: 'Diet', description: 'Eating appropriately and ensuring that your food contains enough nutrients is essential to having healthy hair, as the hair follicles might not have enough nutrients to produce new hairs, or hairs may break in the middle of the growing process.', Image: require('../assets/images/diet.jpg') },
      { id: 'breakage', title: 'Tight Hairstyles', description: 'Using hair ties that are too tight or hairstyles that pull on the hair can cause tension and lead to breakage over time. You can opt for looser hair styles or wearing your hair down once in a while.', Image: require('../assets/images/tight hairstyles.jpg') },
      { id: 'breakage', title: 'Improper Towel Drying', description: 'Although it is normal to dry our hair using a towel, having a proper rubbing motion prevents hair damage, especially that the hair is vulnerable when wet. It is also recommended to use an absorbent towel around the hair to absorb excess water.', Image: require('../assets/images/drying.jpg') },
      { id: 'breakage', title: 'Low Thyroid', description: 'Low thyroid significantly affects hair health. People with low thyroid might have excessive hair damage and hair loss after shower or brushing.', Image: require('../assets/images/low thyroid.jpg') },
      { id: 'breakage', title: 'Lack of Hair Trims', description: 'Hair trims not only provide us a new look but can also keep our hair healthy! Hair trims free our hair from split ends that can travel to the rest of the length of the hair, resulting to possible breakage.', Image: require('../assets/images/lack of hair trims.jpg') },
      { id: 'breakage', title: 'Dryness', description: 'Having dry hair that feels rough and brittle is often due to lack of moisture or natural oils, making hair more prone to tangling, frizz, and breakage. Consider concentrating shampoo on your scalp and consistent use of conditioner.', Image: require('../assets/images/dry hair.jpg') },
      
      { id: 'color damage', title: 'Chemical Treatments', description: 'Frequent chemical treatments, such as coloring, perming, and relaxing can weaken hair structure, leading to increased damage especially if it is done too often, as the hair cuticle can break down and cause hair damage.', Image: require('../assets/images/hair coloring.jpg') },
      { id: 'color damage', title: 'Sun Overexposure', description: 'Prolonged exposure to the sun\'s UV rays can lead to fading hair color damage. UV rays can break down the hair cuticle, which may lead to color loss and brittle hair. Wearing hats or using hair products with UV protection can help minimize this damage.', Image: require('../assets/images/sun overexposure.jpg') },
      { id: 'color damage', title: 'Heat Damage', description: 'Excessive use of heat styling tools, such as flat irons, curling irons, and blow dryers, causes color-treated hair to become dry and brittle. The high temperatures can strip the hair of its natural moisture and damage the cuticle, leading to color fading and breakage.', Image: require('../assets/images/heat damage.jpg') },
      { id: 'color damage', title: 'Improper Use of Products', description: 'Using shampoos and conditioners that are not specifically formulated for color-treated hair can lead to color fading and damage. Harsh ingredients, such as sulfates, can strip the hair\'s color and moisture.',},
      { id: 'color damage', title: 'Exposure to Chlorine', description: 'Swimming in pools can cause color-treated hair to become dry and damaged. Chlorine can damage the hair\'s natural oils, while saltwater can lead to dryness and brittleness.', Image: require('../assets/images/chlorine.jpg') },
      { id: 'color damage', title: 'Overwashing', description: 'Washing color-treated hair too frequently can lead to color fading and dryness. The hair cuticle is vulnerable to damage when wet, making the hair strands more fragile. It is also important to use conditioner regularly to limit water absorption into the cuticle.', Image: require('../assets/images/over washing hair.jpg') },
      { id: 'color damage', title: 'Hot Water', description: 'Using hot water can open the hair cuticle, allowing the hair dye to be washed out. Instead, you can use cold water to prevent your hair color from fading.', Image: require('../assets/images/hot water.jpg') },
      { id: 'color damage', title: 'Proper Diet', description: 'A poor diet not only results in hair breakage but can also be the cause of why the color fades faster than usual. It is recommended to maintain a healthy and balanced diet to promote hair health.', Image: require('../assets/images/healthy food.jpg') },
      { id: 'color damage', title: 'Lack of Moisture', description: 'Color-treated hair tends to be drier than natural hair, making it more prone to damage. Using moisturizing hair products and deep conditioning treatments can help maintain the hair\'s moisture balance and prevent damage.', Image: require('../assets/images/lack of moisture.jpg') },
      
      { id: 'hair loss', title: 'Nutritional Deficiencies', description: 'Lack of essential nutrients, such as iron, biotin, vitamins A, C, D, and E, can contribute to hair loss. A balanced diet is crucial for maintaining healthy hair growth.' },
      { id: 'hair loss', title: 'Genetics', description: 'Genetic factors play a significant role in hair loss patterns. If there is a family history of hair loss, some members of the family may be more prone to experiencing it themselves.' },
      { id: 'hair loss', title: 'Hormonal Changes', description: 'Hormonal fluctuations, such as those occurring during pregnancy, menopause, or thyroid imbalances, can contribute to temporary or permanent hair loss.' },
      { id: 'hair loss', title: 'Medical Conditions', description: 'Certain medical conditions, such as alopecia, scalp infections, and autoimmune diseases, can lead to hair loss. Treating the underlying condition is essential for managing hair loss in these cases.' },
      { id: 'hair loss', title: 'Stress', description: 'Physical or emotional stress can trigger hair loss, often resulting in a condition called telogen effluvium. Managing stress through relaxation techniques and proper self-care can help lessen this type of hair loss.' },
      { id: 'hair loss', title: 'Tight Hairstyles', description: 'Tight hairstyles can cause a specific type of hair loss called traction alopecia. You can opt for looser hairstyles or wearing your hair down once in a while.' },
      { id: 'hair loss', title: 'Medications and Supplements', description: 'Certain medications used for cancer, heart problems, and high blood pressure, can have side effects that include hair loss.' },
      { id: 'hair loss', title: 'Aging', description: 'As people grow older, hair follicles stop growing hair and hair starts to lose color, as the follicles stop producing melanin. ' },
      { id: 'hair loss', title: 'Poor Scalp Health', description: 'Conditions such as dandruff, psoriasis, and fungal infections can negatively impact scalp health, leading to hair loss. Maintaining a clean and healthy scalp is essential for promoting hair growth.' },
      { id: 'hair loss', title: 'Chemical Treatments', description: 'Frequent chemical treatments, such as coloring, perming, and relaxing can weaken hair structure, leading to hair loss.' },
      { id: 'hair loss', title: 'Hair Pulling', description: 'Hair pulling, also known as trichotillomania, is a mental health condition where people pull their hair from the scalp to alleviate stress leaving patchy bald spots. A doctor or mental health professional is recommended for diagnosis and appropriate treatment options. ' },
      
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
        <Text className="text-4xl font-extrabold text-[#3F2305] mt-20 text-center mb-7 mx-4">Hair Damage Causes</Text>

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
            className="bg-[#3F2305] rounded-lg mx-4 mt-2 mb-4 p-4 shadow-xl">
            <View className="w-full flex-row items-center">
              <Image source={remedy.Image} className="w-28 h-28 rounded-md mr-4 flex-shrink-0" />
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-1">{remedy.title}</Text>
                <Text className="text-white text-md leading-5">{remedy.description}</Text>
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