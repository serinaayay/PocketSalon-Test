import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, FlatList, TouchableOpacity, Linking} from "react-native";
import { router, usePathname} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get('window');

const myData = [
      { id: 'breakage', title: 'Heat Damage', description: 'Overuse of hair styling tools, such as curling or flat irons and hair dryers, increases risks of damaging the hair cuticle from high heat.', Image: require('../assets/images/heat damage.jpg'), link: 'https://www.aad.org/public/everyday-care/hair-scalp-care/hair/habits-that-damage-hair' },
      { id: 'breakage', title: 'Over Washing', description: 'Having an oily scalp does not mean washing your hair more often than you need to! Overwashing removes the hair\'s natural sebum which helps in keeping our hair moisturized.', Image: require('../assets/images/over washing hair.jpg'), link: 'https://www.kerastase.com.ph/kerastase-articles-page/hair-care-101-practices-that-damage-the-hair'},
      { id: 'breakage', title: 'Aggressive Brushing', description: 'Aggressive brushing while your hair is wet is a key cause of hair breakage, especially if you brush while hair is still tangled. Instead, use a wide-tooth comb to detangle, and comb later on. ', Image: require('../assets/images/aggressive brushing.jpg'), link:'https://www.cloudninehair.com.au/blogs/hair/hair-breakage-causes-solutions-and-faqs'},
      { id: 'breakage', title: 'Over processing', description: 'Frequent chemical treatments, such as coloring, perming, and relaxing can weaken hair structure, leading to increased breakage especially if it is done too often, as the hair cuticle can break down and cause hair damage.', Image: require('../assets/images/hair coloring.jpg'), link: 'https://www.collectivehairdressing.uk/how-do-i-fix-my-over-processed-hair-without-cutting-it-all-off-a-practical-expert-guide' },
      { id: 'breakage', title: 'Diet', description: 'Eating appropriately and ensuring that your food contains enough nutrients is essential to having healthy hair, as the hair follicles might not have enough nutrients to produce new hairs, or hairs may break in the middle of the growing process.', Image: require('../assets/images/diet.jpg'), link: 'https://www.healthline.com/health/hair-breakage'},
      { id: 'breakage', title: 'Tight Hairstyles', description: 'Using hair ties that are too tight or hairstyles that pull on the hair can cause tension and lead to breakage over time. You can opt for looser hair styles or wearing your hair down once in a while.', Image: require('../assets/images/tight hairstyles.jpg'), link: 'https://www.aad.org/public/everyday-care/hair-scalp-care/hair/habits-that-damage-hair' },
      { id: 'breakage', title: 'Improper Towel Drying', description: 'Although it is normal to dry our hair using a towel, having a proper rubbing motion prevents hair damage, especially that the hair is vulnerable when wet. It is also recommended to use an absorbent towel around the hair to absorb excess water.', Image: require('../assets/images/drying.jpg'), link:'https://www.kerastase.com.ph/kerastase-articles-page/hair-care-101-practices-that-damage-the-hair' },
      { id: 'breakage', title: 'Low Thyroid', description: 'Low thyroid significantly affects hair health. People with low thyroid might have excessive hair damage and hair loss after shower or brushing.', Image: require('../assets/images/low thyroid.jpg'), link: 'https://www.healthline.com/health/hair-breakage'},
      { id: 'breakage', title: 'Lack of Hair Trims', description: 'Hair trims not only provide us a new look but can also keep our hair healthy! Hair trims free our hair from split ends that can travel to the rest of the length of the hair, resulting to possible breakage.', Image: require('../assets/images/lack of hair trims.jpg'), link: 'https://www.medicalnewstoday.com/articles/325026#causes'},
      { id: 'breakage', title: 'Dryness', description: 'Having dry hair that feels rough and brittle is often due to lack of moisture or natural oils, making hair more prone to tangling, frizz, and breakage. Consider concentrating shampoo on your scalp and consistent use of conditioner.', Image: require('../assets/images/dry hair.jpg'), link: 'https://www.healthline.com/health/hair-breakage#stress'},
      
      { id: 'color damage', title: 'Chemical Treatments', description: 'Frequent chemical treatments, such as coloring, perming, and relaxing can weaken hair structure, leading to increased damage especially if it is done too often, as the hair cuticle can break down and cause hair damage.', Image: require('../assets/images/hair coloring.jpg'), link: 'https://salondeauville.com/blog/can-hair-color-damage-your-hair/'},
      { id: 'color damage', title: 'Sun Overexposure', description: 'Prolonged exposure to the sun\'s UV rays can lead to fading hair color damage. UV rays can break down the hair cuticle, which may lead to color loss and brittle hair. Wearing hats or using hair products with UV protection can help minimize this damage.', Image: require('../assets/images/sun overexposure.jpg'), link: 'https://www.salonhaze.com/blogs/the-impact-of-sun-exposure-on-hair-color'},
      { id: 'color damage', title: 'Heat Damage', description: 'Excessive use of heat styling tools, such as flat irons, curling irons, and blow dryers, causes color-treated hair to become dry and brittle. The high temperatures can strip the hair of its natural moisture and damage the cuticle, leading to color fading and breakage.', Image: require('../assets/images/heat damage.jpg'), link: 'https://www.dyson.com/discover/insights/hair/health/how-does-heat-damage-hair' },
      { id: 'color damage', title: 'Improper Use of Products', description: 'Using shampoos and conditioners that are not specifically formulated for color-treated hair can lead to color fading and damage. Harsh ingredients, such as sulfates, can strip the hair\'s color and moisture.', Image: require('../assets/images/hair coloring.jpg'), link: 'https://www.redken.in/blog/haircare-tips/7-ways-you-are-damaging-your-hair-and-how-to-fix-it'},
      { id: 'color damage', title: 'Exposure to Chlorine', description: 'Swimming in pools can cause color-treated hair to become dry and damaged. Chlorine can damage the hair\'s natural oils, while saltwater can lead to dryness and brittleness.', Image: require('../assets/images/chlorine.jpg'), link: 'https://www.usms.org/fitness-and-training/articles-and-videos/articles/tips-for-protecting-color-treated-hair-from-chlorine'},
      { id: 'color damage', title: 'Overwashing', description: 'Washing color-treated hair too frequently can lead to color fading and dryness. The hair cuticle is vulnerable to damage when wet, making the hair strands more fragile. It is also important to use conditioner regularly to limit water absorption into the cuticle.', Image: require('../assets/images/over washing hair.jpg'), link: 'https://www.therapyhairstudio.com/how-to-keep-hair-color-from-fading/' },
      { id: 'color damage', title: 'Hot Water', description: 'Using hot water can open the hair cuticle, allowing the hair dye to be washed out. Instead, you can use cold water to prevent your hair color from fading.', Image: require('../assets/images/hot water.jpg'), link: 'https://www.therapyhairstudio.com/how-to-keep-hair-color-from-fading/'},
      { id: 'color damage', title: 'Proper Diet', description: 'A poor diet not only results in hair breakage but can also be the cause of why the color fades faster than usual. It is recommended to maintain a healthy and balanced diet to promote hair health.', Image: require('../assets/images/healthy food.jpg'), link: 'https://www.everydayhealth.com/nutrients/vitamins/fighting-gray-hair-with-vitamins/'},
      { id: 'color damage', title: 'Lack of Moisture', description: 'Color-treated hair tends to be drier than natural hair, making it more prone to damage. Using moisturizing hair products and deep conditioning treatments can help maintain the hair\'s moisture balance and prevent damage.', Image: require('../assets/images/lack of moisture.jpg'), link: 'https://www.lorealprofessionnel.co.uk/hair-care-advice/how-to-treat-coloured-and-damaged-hair'},
      
      { id: 'hair loss', title: 'Nutritional Deficiencies', description: 'Lack of essential nutrients, such as iron, biotin, vitamins A, C, D, and E, can contribute to hair loss. A balanced diet is crucial for maintaining healthy hair growth.', Image: require('../assets/images/vitamins.jpg'), link: 'https://my.clevelandclinic.org/health/diseases/16921-hair-loss-in-women'},
      { id: 'hair loss', title: 'Genetics', description: 'Genetic factors play a significant role in hair loss patterns. If there is a family history of hair loss, some members of the family may be more prone to experiencing it themselves.', Image: require('../assets/images/genetics.jpg'), link: 'https://www.mayoclinic.org/diseases-conditions/hair-loss/symptoms-causes/syc-20372926' },
      { id: 'hair loss', title: 'Hormonal Changes', description: 'Hormonal fluctuations, such as those occurring during pregnancy, menopause, or thyroid imbalances, can contribute to temporary or permanent hair loss.', Image: require('../assets/images/hormonal.jpg'), link: 'https://www.aad.org/public/diseases/hair-loss/insider/new-moms' },
      { id: 'hair loss', title: 'Medical Conditions', description: 'Certain medical conditions, such as alopecia, scalp infections, and autoimmune diseases, can lead to hair loss. Treating the underlying condition is essential for managing hair loss in these cases.', Image: require('../assets/images/alopecia.jpg'), link: 'https://www.naaf.org/alopecia-areata/' },
      { id: 'hair loss', title: 'Stress', description: 'Physical or emotional stress can trigger hair loss, often resulting in a condition called telogen effluvium. Managing stress through relaxation techniques and proper self-care can help lessen this type of hair loss.', Image: require('../assets/images/stress.jpg'), link: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/expert-answers/stress-and-hair-loss/faq-20057820' },
      { id: 'hair loss', title: 'Tight Hairstyles', description: 'Tight hairstyles can cause a specific type of hair loss called traction alopecia. You can opt for looser hairstyles or wearing your hair down once in a while.', Image: require('../assets/images/tight hairstyles.jpg'), link: 'https://www.aad.org/public/diseases/hair-loss/causes/hairstyles' },
      { id: 'hair loss', title: 'Medications and Supplements', description: 'Certain medications used for cancer, heart problems, and high blood pressure, can have side effects that include hair loss.', Image: require('../assets/images/medicines.jpeg'), link: 'https://www.verywellhealth.com/these-medications-can-cause-hair-loss-8417271' },
      { id: 'hair loss', title: 'Aging', description: 'As people grow older, hair follicles stop growing hair and hair starts to lose color, as the follicles stop producing melanin. ', Image: require('../assets/images/aging.jpg'), link: 'https://www.ncoa.org/article/age-related-hair-loss-explained-a-guide-for-older-adults/' },
      { id: 'hair loss', title: 'Poor Scalp Health', description: 'Conditions such as dandruff, psoriasis, and fungal infections can negatively impact scalp health, leading to hair loss. Maintaining a clean and healthy scalp is essential for promoting hair growth.', Image: require('../assets/images/poor scalp health.jpg'), link: 'https://headandshoulders.com/en-us/healthy-hair-and-scalp/dandruff/dandruff-and-hair-loss' },
      { id: 'hair loss', title: 'Chemical Treatments', description: 'Frequent chemical treatments, such as coloring, perming, and relaxing can weaken hair structure, leading to hair loss.', Image: require('../assets/images/hair coloring.jpg'), link: 'https://my.clevelandclinic.org/health/diseases/16921-hair-loss-in-women' },
      { id: 'hair loss', title: 'Hair Pulling', description: 'Hair pulling, also known as trichotillomania, is a mental health condition where people pull hair from the scalp to alleviate stress. A doctor or mental health professional is recommended for diagnosis and appropriate treatment options. ', Image: require('../assets/images/hair pulling.jpg'), link: 'https://www.aad.org/public/diseases/hair-loss/causes/hairstyles' },
      
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
  const pathname = usePathname();
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

  const cardExpandCollapse = (index: number) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null); // Collapse
    } else {
      setExpandedCardIndex(index); // Expand 
    }
  };
  
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
            
            <View className="flex-row" style={{ alignItems: 'flex-start' }}>
              {/* Left Column - Image and Button */}
              <View style={{ width: 112, marginRight: 16 }}>
                {remedy.Image && (
                  <Image
                    source={remedy.Image}
                    className="w-28 h-28 rounded-md mb-3"
                    style={{ width: 112, height: 112 }}/>
                )}

                {/* View Source Button - Directly under image */}
                {remedy.link && (
                  <TouchableOpacity
                    onPress={() => remedy.link && Linking.openURL(remedy.link)}
                    activeOpacity={0.6}
                    style={{
                      backgroundColor: '#F2D8A7',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      elevation: 5,
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Text style={{ color: '#3F2305', fontSize: 12, fontWeight: 'bold' }}>
                      View Source
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Right Column - Title and Description */}
              <View className="flex-1">
                <TouchableOpacity onPress={() => cardExpandCollapse(idx)}>
                  <Text className="text-white text-2xl font-bold">{remedy.title}</Text>

                  <View style={{ overflow: 'hidden', maxHeight: expandedCardIndex === idx ? undefined : 70 }}>
                    <Text
                      className="text-white"
                      numberOfLines={expandedCardIndex === idx ? undefined : 3}>
                      {remedy.description}
                    </Text>
                  </View>

                  <Text className="text-[#DBDBDB] mt-2">
                    {expandedCardIndex === idx ? " " : "Read More..."}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
            {/* Floating Chatbot Button */}
            <Pressable
              onPress={() => router.push('/chatbot')}
              style={{
                position: 'absolute',
                right: 24,
                bottom: 95,
                width: 56,
                height: 56,
                borderRadius: 28,
                borderColor: '#BD8242',
                borderWidth: 3,
                backgroundColor: '#6D3C09',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.25,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 8,
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={26} color="#FFF2E4" />
            </Pressable>
      
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

export default hairDmgCauses;