import {View, Text, Image, Pressable, ScrollView, Dimensions, Animated, Linking, TouchableOpacity} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { recommendProducts, getProductImage, getPriceCategory, Product } from '../lib/productRecommendations';
import { addFavorite, removeFavorite, isFavorite } from '../lib/favorites';
import { Ionicons, FontAwesome} from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Flip Card Component
const FlipCard = ({ product, reorderProducts }: { product: Product, reorderProducts: (product: Product, liked: boolean) => void }) => {
  const [flipped, setFlipped] = React.useState(false);
  const [isFav, setIsFav] = React.useState(false);
  const [isLike, setIsLike] = React.useState(false);

  const flipAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const checkFavorite = async () => {
      const favStatus = await isFavorite(product.id);
      setIsFav(favStatus);
    };
    checkFavorite();
  }, [product.id]);

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: flipped ? 0 : 180,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const toggleFavorite = async () => {
    if (isFav) {
      await removeFavorite(product.id);
      setIsFav(false);
    } else {
      await addFavorite(product);
      setIsFav(true);
    }
  };

  //like/dislike + reordder
const toggleLike = async (liked: boolean) => {
  setIsLike(liked);
  await reorderProducts(product, liked);

};

const toggleDislike = async (liked: boolean) => {
  setIsLike(liked);
  await reorderProducts(product, liked);

};


  const openProductLink = () => {
    if (product.link) {
      Linking.openURL(product.link);
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View className='items-center'>
    <View style={{ width: 256, height: 500 }}>
      
      {/* Front of Card */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
          },
          frontAnimatedStyle,
        ]}
        pointerEvents={flipped ? 'none' : 'auto'}
      >
        <View className="w-64 bg-[#3F2305] rounded-xl shadow-lg p-4 items-center self-center" style={{ height: 500 }}>
          {/* Product Image */}
          <View className="w-full bg-[#cfaf8d] rounded-lg mb-3 flex justify-center items-center" style={{ height: 180 }}>
            <Image
              source={getProductImage(product.imageKey)}
              style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
            />
          </View>
          
          <Text className="text-white text-xl font-bold text-center mb-2" numberOfLines={2}>
            {product.name}
          </Text>
          <ScrollView 
            style={{ maxHeight: 120, marginBottom: 8 }} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            <Text className="text-white text-xs text-center">
              {product.description}
            </Text>
          </ScrollView>
          <View className="items-center mt-auto pb-2">
            <Text className="text-[#F2D8A7] text-3xl font-bold mb-2">
              {getPriceCategory(product.price)}
            </Text>
          </View>
          <View className="flex-row items-center justify-center flex-wrap gap-2 mt-1 px-2" style={{ zIndex: 1000 }}>

            <TouchableOpacity
              onPress={() => {
                console.log('Ingredients button pressed');
                flipCard();
              }}
              activeOpacity={0.6}
              style={{
                backgroundColor: '#F2D8A7',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                elevation: 10,
                zIndex: 1001,
              }}
            >
              <Text style={{ color: '#3F2305', fontSize: 12, fontWeight: 'bold' }}>Ingredients</Text>

            </TouchableOpacity>

            {product.link && (
              <TouchableOpacity
                onPress={() => {
                  console.log('View Product button pressed');
                  openProductLink();
                }}
                activeOpacity={0.6}
                style={{
                  backgroundColor: '#F2D8A7',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  elevation: 10,
                  zIndex: 1001,
                }}
                className='self-center ml-10'>
                  
                <Text style={{ color: '#3F2305', fontSize: 12, fontWeight: 'bold' }}>View Product</Text>
              </TouchableOpacity>
            )}
          <View className="position left-5">
            <TouchableOpacity
              onPress={() => {
                console.log('Heart button pressed');
                toggleFavorite();
              }}
              activeOpacity={0.6}
              style={{
                padding: 6,
                backgroundColor: '#F2D8A7',
                borderRadius: 20,
                elevation: 10,
                zIndex: 1001,
              }}
              className=''
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color={isFav ? '#FF0000' : '#3F2305'}
              />
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </Animated.View>

      {/* Back of Card */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
          },
          backAnimatedStyle,
        ]}
        pointerEvents={flipped ? 'auto' : 'none'}>

        <TouchableOpacity
              onPress={() => {
                console.log('Back button pressed');
                flipCard();
              }}
              activeOpacity={0.6}
              style={{
                position: 'absolute',
                right: 0,
                backgroundColor: '#3F2305',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                elevation: 10,
                zIndex: 1001,
              }}>
        <View className="w-64 bg-[#3F2305] rounded-xl shadow-lg p-4" style={{height: 500}}>
              
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold flex-1 text-center">
              Ingredients
            </Text>
              
          </View>
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {product.ingredients && product.ingredients.length > 0 ? (
              product.ingredients.map((ingredient, index) => (
                <Text key={index} className="text-white text-sm mb-2">
                  • {ingredient}
                </Text>
              ))
            ) : (
              <Text className="text-white text-sm text-center">
                No ingredient information available
              </Text>
            )}
          </ScrollView>
        </View>
        </TouchableOpacity>
      </Animated.View>
    </View>

    <View className='flex-row'>
      <TouchableOpacity
        onPress={() => {
          console.log('Like button pressed');
          toggleLike(true)
        }}
        activeOpacity={0.8}
        style={{
          padding: 10,
          marginTop: 10,
        }}
      >
        <FontAwesome
          name="thumbs-up"
          size={28}
          color={isLike === true ? '#29ac31ff' : '#3F2305'}/>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          console.log('Dislike button pressed');
          toggleDislike(false)
        }}
        activeOpacity={0.8}
        style={{
          padding: 10,
          marginTop: 10,
        }}
      >
        <FontAwesome
          name={'thumbs-down'}
          size={28}
          color={isLike === false ? '#ac3629ff' : '#3F2305'}/>
      </TouchableOpacity>
    </View>
  </View>
  );
};

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

    const [selectedProductType, setSelectedProductType] = React.useState<string>('All');

    // Note: Hair analysis is now saved in hair-detection.tsx to avoid duplicates
    // This useEffect has been removed to prevent duplicate journal entries

    const [products, setProducts] = React.useState(
      recommendProducts({ hairType, scalpCondition, hairDamage: damageLevel, limit: 20})
    )
    
    const reorderProducts = (product: Product, liked: boolean) => {
      setProducts((prevProducts) => {
        const filtered = prevProducts.filter(p => p.id !== product.id);

        if (liked) {
          // Move similar ones to the front
          return [product, ...filtered]
        } else {
          // Move similar ones to the back
          return [...filtered, product]
        }
      });
  };

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
                    <Text className="text-[29px] font-extrabold mb-6 text-[#3F2305] text-center">Product Suggestions</Text>
                    
                    {/* Filter Pills */}
                    <View className="flex-row mb-3 self-center mx-8 px-2">
                      {['All', 'Shampoo', 'Conditioner', 'Hair Oil'].map((type) => (
                        <Pressable
                          key={type}
                          onPress={() => setSelectedProductType(type)}
                          className={`px-4 py-2 rounded-full mr-2 ${
                            selectedProductType === type ? 'bg-[#3F2305]' : 'bg-[#E8DCC8]'
                          }`}
                        >
                          <Text className={`text-md font-semibold ${
                            selectedProductType === type ? 'text-white' : 'text-[#5B3E20]'
                          }`}>
                            {type}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* price legend */}

                    <View className="mx-5 my-5 bg-[#3F2305] py-4 px-6 rounded-2xl shadow-lg mb-8">
                        <Text className="text-white text-xl font-bold text-center">
                            Price legend
                        </Text>
                        <Text className="text-white text-md text-center">
                            ₱ - Price is less than 300 Pesos {'\n'}
                            ₱₱ - Price ranges from 300 to 500 Pesos {'\n'}
                            ₱₱₱ - Price is higher than 500 Pesos 
                        </Text>
                    </View>

                    <View className="w-full flex items-center self-center">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {products
                          .filter(product => selectedProductType === 'All' || product.productType === selectedProductType)
                          .map((product) => (
                            <View key={product.id} className="mx-4">
                              <FlipCard product={product} reorderProducts={reorderProducts} />
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
                    
                    {/* Filter Pills */}
                    <View className="flex-row mb-4 mx-8">
                      {['All', 'Shampoo', 'Conditioner', 'Hair Oil'].map((type) => (
                        <Pressable
                          key={`remedy-${type}`}
                          onPress={() => setSelectedProductType(type)}
                          className={`px-4 py-2 rounded-full mr-2 ${
                            selectedProductType === type ? 'bg-[#3F2305]' : 'bg-[#E8DCC8]'
                          }`}>

                          <Text className={`text- font-semibold ${
                            selectedProductType === type ? 'text-white' : 'text-[#5B3E20]'
                          }`}>
                            {type}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <View className="w-full flex items-center align-center">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {products
                          .filter(product => selectedProductType === 'All' || product.productType === selectedProductType)
                          .map((product) => (
                            <View key={product.id} className="mx-4">
                              <FlipCard product={product} reorderProducts={reorderProducts} />
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

export default ResultsScreen;
