import {View, Text, Image, Pressable, ScrollView, Dimensions} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { recommendProducts, getProductImage } from '../lib/productRecommendations';

const { width, height } = Dimensions.get('window');

// Map hair types to images
const hairTypeImages: { [key: string]: any } = {
  Straight: require('../assets/images/like.png'),
  Curly: require('../assets/images/curly.png'),
  Wavy: require('../assets/images/wavy-hair.png'),
  Kinky: require('../assets/images/coily.png'),
};

// Map hair damages to images
const hairDamageImages: { [key: string]: any } = {
  'Healthy': require('../assets/images/healthy-hair.png'),
  'Breakage': require('../assets/images/unhealthy.png'),
  'Hair Loss': require('../assets/images/hair-loss.png'),
  'Color Damage': require('../assets/images/hair-thining.png'),
  'Likely Breakage': require('../assets/images/unhealthy.png'),
  'Likely Hair Loss': require('../assets/images/hair-loss.png'),
  'Likely Color Damage': require('../assets/images/hair-thining.png'),
  'Moderate chance of Breakage': require('../assets/images/unhealthy.png'),
  'Moderate chance of Hair Loss': require('../assets/images/hair-loss.png'),
  'Moderate chance of Color Damage': require('../assets/images/hair-thining.png'),
  'High chance of Breakage': require('../assets/images/unhealthy.png'),
  'High chance of Hair Loss': require('../assets/images/hair-loss.png'),
  'High chance of Color Damage': require('../assets/images/hair-thining.png'),
};

const hairTypeDescriptions: { [key: string]: string } = {
    Straight: "Your hair type is straight! Straight hair is easy to style and looks great with minimal effort. By using healthy and lightweight hair care products and regular trims, you can keep your hair light and fresh!",
    Curly: "Your hair type is curly! Curly hairs have distinct loops or ringlets and tends to be voluminous but can be prone to frizz and dryness. Maintaining and following a consistent, specialized care method to combat dryness and maintain definition will give you healthier curls with lasting definition!",
    Wavy: "You have wavy hair! Wavy hairs are also known as Type 2 hair. It naturally forms loose, S-shaped waves and a mix of straight and curly textures. With the proper hair care, your waves can stay defined, soft, and frizz-free! ",
    Kinky: "You have coily/kinky hair! Coily hairs are known as Type 3 hair as they exhibit closed curls or zig-zag patterns and are beautifully dense and full of texture. Carefully following a tailored routine will help strengthen your coils, elevate their definition, and showcase their natural elegance!",
  };

const hairDamageDescriptions: { [key: string]: string } = {
  'Healthy': "Great news! Your hair appears to be healthy with no significant damage detected. Keep up your current hair care routine!",
  'Breakage': "Hair breakage detected. Consider using strengthening treatments and avoid excessive heat styling.",
  'Hair Loss': "Hair loss indicators detected. We recommend consulting with a professional and using nourishing treatments.",
  'Color Damage': "Color damage detected. Use color-safe products and deep conditioning treatments to restore hair health.",
  'Likely Breakage': "Possible breakage detected. Monitor your hair health and consider preventive care.",
  'Likely Hair Loss': "Possible hair loss indicators. Early intervention can help prevent further issues.",
  'Likely Color Damage': "Possible color damage. Use protective products to maintain hair integrity.",
  'Moderate chance of Breakage': "Moderate risk of breakage. Take preventive measures now.",
  'Moderate chance of Hair Loss': "Moderate risk of hair loss. Consider professional consultation.",
  'Moderate chance of Color Damage': "Moderate color damage risk. Use restorative treatments.",
  'High chance of Breakage': "High risk of breakage. Immediate care recommended.",
  'High chance of Hair Loss': "High risk of hair loss. Professional consultation strongly recommended.",
  'High chance of Color Damage': "High risk of color damage. Intensive treatment needed.",
};

const ResultsScreen = () => {
    const params = useLocalSearchParams();
    const hairType = params.hair_type as string | undefined;
    const scalpCondition = params.scalp_condition as string | undefined;
    const hairConfidence = params.hair_confidence as string | number | undefined;
    const damageLevel = params.damage_level as string | undefined;
    const damageConfidence = params.damage_confidence as string | number | undefined;
    const imageUri = params.image_uri as string | undefined;
    const hairHealthScore = params.hair_health_score ? parseFloat(params.hair_health_score as string) : null;

    // Note: Hair analysis is now saved in hair-detection.tsx to avoid duplicates
    // This useEffect has been removed to prevent duplicate journal entries

    return (
        <View className="flex-1 bg-[#FFF2E4]">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
                <Text className="text-[#3F2305] text-[30px] font-bold my-8 mx-8 self-center">
                    Hair Analysis Results
                </Text>
                <Text className="text-2xl font-normal text-black mx-8 mt-5 mb-4">
                    Your hair type is...
                </Text>

                {/* Hair Type Row */}
                <View className="flex-row items-center my-3 mx-8">
                    <View className="items-center" style={{ width: width * 0.28 }}>
                        <View 
                            className="items-center justify-center bg-[#FFF2E4] rounded-full mr-5 shadow-2xl"
                            style={{ 
                                width: width * 0.30,
                                height: width * 0.30,
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                          {hairType && hairTypeImages[hairType] && (
                            <Image
                              source={hairTypeImages[hairType]}
                              style={{ width: '70%', height: '70%', resizeMode: 'contain' }}
                            />
                          )}
                        </View>
                        <Text className="text-base font-semibold mt-2 text-[#2D2D2D] mr-4">{hairType || 'Hair Type'}</Text>
                    </View>

                    {/* Hair Type description */}
                    <View className="bg-[#3F2305] rounded-[15px] justify-center shadow-lg"
                        style={{ 
                            width: width * 0.6,
                            minHeight: height * 0.10,
                            marginLeft: width * 0.02
                        }}>
                        <Text className="text-white text-sm font-medium p-4 text-justify">
                            {hairType ? hairTypeDescriptions[hairType] : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-end items-center mx-8">
                    <Text className="text-m mb-4 font-bold text-[#5B3E20]"> Confidence: {hairConfidence ? `${(parseFloat(hairConfidence as string) * 100).toFixed(2)}%` : ''}</Text>
                </View>

                {/* Hair Damage Section */}
                <View className="mx-8 my-4">
                <Text className="text-[26px] font-bold mb-7 text-[#3F2305] self-center">
                    Hair Damage Check!
                </Text>

                <View className="flex-row">
                    <View className="items-center" style={{ width: width * 0.28 }}>
                    <View 
                        className="items-center justify-center bg-[#FFF2E4] rounded-full mr-4 shadow-2xl"
                        style={{ 
                            width: width * 0.30,
                            height: width * 0.30,
                            overflow: 'hidden',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        {damageLevel && hairDamageImages[damageLevel] && (
                        <Image
                            source={hairDamageImages[damageLevel]}
                            style={{ width: '70%', height: '70%', resizeMode: 'contain' }}
                        />
                        )}
                    </View>
                    <Text className="text-base font-semibold mt-2 text-[#2D2D2D] mr-4">
                        {damageLevel || 'Damage'}
                    </Text>
                    </View>
                    <View 
                    className="bg-[#3F2305] rounded-[15px] justify-center shadow-lg"
                    style={{ 
                        width: width * 0.6,
                        minHeight: height * 0.16,
                        marginLeft: width * 0.02,
                    }}>
                        <Text className="text-white text-sm font-medium p-4 text-justify">
                            {damageLevel ? hairDamageDescriptions[damageLevel] || 'Hair analysis complete.' : 'No damage information available.'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-end items-center mx-2 mt-3">
                    <Text className="text-m mb-4 font-extrabold text-[#5B3E20]">
                    Confidence: {damageConfidence ? `${(parseFloat(damageConfidence as string) * 100).toFixed(2)}%` : ''}
                    </Text>
                </View>
                </View>

                <Text className="text-lg font-bold mb-10 mt-10 text-[#3F2305] text-center">Disclaimer: This study is experimental; The recommended products below are 
                    for guidance and suggestions only. Consult a professional. </Text>
             
                {/* Product Recommendations Row */}
                <View className="mx-8 my-16">
                    <Text className="text-[27px] font-bold mb-4 text-[#3F2305] text-center">Product Suggestions</Text>
                    <View className="w-full flex items-center">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {recommendProducts({ hairType, scalpCondition, hairDamage: damageLevel, limit: 10 }).map((product) => (
                          <View key={product.id} className="w-64 bg-[#3F2305] rounded-xl shadow-lg mx-4 p-4 items-center">
                            <View className="w-full aspect-square bg-[#f3ddc5] rounded-lg mb-4 flex justify-center items-center">
                              <Image
                                source={getProductImage(product.imageKey)}
                                style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
                              />
                            </View>
                            <Text className="text-white text-xl font-bold text-center mb-2">
                              {product.name}
                            </Text>
                            <Text className="text-white text-m text-center">
                              {product.description}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                </View>

                {/* View Personalized Routine Button */}
                <View className="mx-8 my-10">
                    <Pressable 
                        className="bg-[#3F2305] py-4 px-6 rounded-2xl shadow-lg"
                        onPress={() => router.push({
                            pathname: '/PersonalizedRoutine',
                            params: {
                                hair_type: hairType,
                                damage_level: damageLevel,
                                scalp_condition: scalpCondition || 'Normal Scalp',
                            }
                        })}>
                        <Text className="text-white text-xl font-bold text-center">
                            View Your Personalized Routine
                        </Text>
                        <Text className="text-white text-sm text-center mt-2">
                            Get detailed care instructions for your hair
                        </Text>
                    </Pressable>
                </View>

                <Text className="text-[27px] font-bold mb-4 text-[#3F2305] text-center">Natural Remedies</Text>
                    <View className="w-full flex items-center">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {recommendProducts({ hairType, scalpCondition, hairDamage: damageLevel, limit: 10 }).map((product) => (
                          <View key={product.id} className="w-64 bg-[#3F2305] rounded-xl shadow-lg mx-4 p-4 items-center">
                            <View className="w-full aspect-square bg-[#f3ddc5] rounded-lg mb-4 flex justify-center items-center">
                              <Image
                                source={getProductImage(product.imageKey)}
                                style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
                              />
                            </View>
                            <Text className="text-white text-xl font-bold text-center mb-2">
                              {product.name}
                            </Text>
                            <Text className="text-white text-m text-center">
                              {product.description}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
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
                        onPress={() => router.push({
                            pathname: '/journal',
                            params: {
                                hair_health_score: hairHealthScore ? hairHealthScore.toString() : '',
                                image_uri: imageUri ? imageUri : '',
                            },
                        })
                    }>
                        <Image
                            source={require('../assets/images/agenda 1.png')}
                            className="w-9 h-9"/>
                        </Pressable>
                    </View>
                </View>
          </View>
        </View>
    );
};

export default ResultsScreen;
