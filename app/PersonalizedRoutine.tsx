import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Image, Modal, Animated, Linking, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getHairRoutine, mapDamageLevelToRoutine, mapHairTypeToRoutine, ScalpCondition } from '../lib/hairRoutines';
import { recommendProducts, getProductImage, getPriceCategory, Product } from '../lib/productRecommendations';
import { addFavorite, removeFavorite, isFavorite } from '../lib/favorites';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Flip Card Component
const FlipCard = ({ product }: { product: Product }) => {
  const [flipped, setFlipped] = React.useState(false);
  const [isFav, setIsFav] = React.useState(false);
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
        <View className="w-64 bg-[#3F2305] rounded-xl shadow-lg p-4 items-center" style={{ height: 500 }}>
          {/* Product Image */}
          <View className="w-full bg-[#f3ddc5] rounded-lg mb-3 flex justify-center items-center" style={{ height: 180 }}>
            <Image
              source={getProductImage(product.imageKey)}
              style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
            />
          </View>
          
          <Text className="text-white text-lg font-bold text-center mb-2" numberOfLines={2}>
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
                backgroundColor: '#8B6B47',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                elevation: 10,
                zIndex: 1001,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>Ingredients</Text>
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
        pointerEvents={flipped ? 'auto' : 'none'}
      >
        <View className="w-64 bg-[#5B3E20] rounded-xl shadow-lg p-4" style={{ height: 500 }}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-bold flex-1 text-center">
              Ingredients
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Back button pressed');
                flipCard();
              }}
              activeOpacity={0.6}
              style={{
                position: 'absolute',
                right: 0,
                backgroundColor: '#8B6B47',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                elevation: 10,
                zIndex: 1001,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>Back</Text>
            </TouchableOpacity>
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
      </Animated.View>
    </View>
  );
};

export default function PersonalizedRoutine() {
  const params = useLocalSearchParams();
  
  // Get parameters from navigation
  const scalpCondition = (params.scalp_condition as ScalpCondition) || 'Normal Scalp';
  const hairType = mapHairTypeToRoutine(params.hair_type as string || 'Straight');
  const damageLevel = mapDamageLevelToRoutine(params.damage_level as string || 'Healthy');

  const routine = getHairRoutine(scalpCondition, hairType, damageLevel);

  const [showDisclaimer, setShowDisclaimer] = React.useState(true);
  const [selectedProductType, setSelectedProductType] = React.useState<string>('All');

  const NumberBadge = ({ num }: { num: string }) => (
    <View className="w-7 h-7 rounded-md bg-[#CDB08B] items-center justify-center mr-2" style={{ flexShrink: 0 }}>
      <Text className="text-[#3F2305] font-bold text-xs">{num}</Text>
    </View>
  );

  const IconSquare = ({ children }: { children?: React.ReactNode }) => (
    <View className="w-16 h-16 rounded-xl border-2 border-[#7A5E42] bg-[#FFF7EF] items-center justify-center mr-4 p-1" style={{ overflow: 'hidden' }}>
      {children}
    </View>
  );

  const CenteredImage = ({ src, offsetX = 0, offsetY = 0 }: { src: any; offsetX?: number; offsetY?: number }) => (
    <Image
      source={src}
      resizeMode="contain"
      style={{ width: '85%', height: '85%', tintColor: '#6C4E31', transform: [{ translateX: offsetX }, { translateY: offsetY }] }}
    />
  );

  const ensurePeriod = (text: string) => {
    if (!text) return text;
    const trimmed = text.trim();
    const last = trimmed.charAt(trimmed.length - 1);
    if (['.', '!', '?'].includes(last)) return trimmed;
    return `${trimmed}.`;
  };

  const preventOrphan = (text: string, keepLastWords: number = 2) => {
    if (!text) return text;
    const parts = text.trim().split(' ');
    if (parts.length <= keepLastWords) return text;
    const head = parts.slice(0, parts.length - keepLastWords).join(' ');
    const tail = parts.slice(parts.length - keepLastWords).join('\u00A0');
    return `${head} ${tail}`;
  };

  const formatBody = (text: string) => {
    if (!text) return text;
    const withPeriod = ensurePeriod(text);
    const withBreaks = withPeriod.replace(/\.\s+/g, '.\n');
    return withBreaks
      .split('\n')
      .map(line => preventOrphan(line, 2))
      .join('\n');
  };

  return (
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <Text className="text-[30px] font-extrabold text-[#3F2305] mt-16 mx-6 text-center">
          Your Personalized {'\n'}Hair Care Routine
        </Text>

        <Text className="text-md text-[#5B3E20] text-extrabold mx-6 mt-4 text-center">
          Based on: {scalpCondition} • {hairType} Hair • {damageLevel}
        </Text>

        {/* (Summary removed per request) */}

        {/* Section 1: Scalp Routine */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-3 bg-[#3F2305] px-3 py-2 rounded-lg mb-6">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">Scalp Care (Only Scalp)</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/calendar.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Wash Frequency</Text>
              <Text className="text-[#3F2305] text-lg text-justify">{formatBody(routine.scalpRoutine.washFrequency)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/shampoo.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Shampoo Type</Text>
              <Text className="text-[#3F2305] text-lg text-justify">{(routine.scalpRoutine.shampooType)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/waterdrop.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">How To Wash</Text>
              <Text className="text-[#3F2305] text-lg text-justify">{(routine.scalpRoutine.howTo)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-treatment.png')} offsetX={2} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Treatment</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{(routine.scalpRoutine.treatment)}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Hair Type Routine */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white bg-[#3F2305] px-3 py-2 rounded-lg mb-4">
                Hair Styling ({hairType} Hair)
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-conditioner.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Conditioner Tips</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{formatBody(routine.hairTypeRoutine.conditionerTips)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/comb.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Styling</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{formatBody(routine.hairTypeRoutine.styling)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-dryer.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Drying Tips</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{formatBody(routine.hairTypeRoutine.dryingTips)}</Text>
            </View>
          </View>

          {routine.hairTypeRoutine.extraTip && (
            <View className="flex-row items-center mb-5">
              <IconSquare>
                <CenteredImage src={require('../assets/recommendation page/healthy (1).png')} />
              </IconSquare>
              <View className="flex-1">
                <Text className="text-[#3F2305] font-bold text-xl mb-1">Extra Tip</Text>
                <Text className="text-[#5B3E20] text-lg text-justify">{formatBody(routine.hairTypeRoutine.extraTip)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Section 3: Damage Treatment */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white bg-[#3F2305] px-3 py-2 rounded-lg mb-6">Damage Treatment ({damageLevel})</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/goal.png')} offsetX={5} />
            </IconSquare>

            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Goal</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{formatBody(routine.damageRoutine.goal)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-conditioner.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Conditioner</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{(routine.damageRoutine.conditioner)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-treatment.png')} offsetX={2} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Treatment</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{(routine.damageRoutine.treatment)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/healthy (1).png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-bold text-xl mb-1">Lifestyle</Text>
              <Text className="text-[#5B3E20] text-lg text-justify">{(routine.damageRoutine.lifestyle)}</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <Text className="text-lg font-bold mx-6 mt-10 mb-6 text-[#3F2305] text-center">
          Disclaimer: This study is experimental. The recommended products below are for guidance and suggestions only. Consult a professional.
        </Text>

        {/* Product Recommendations Section */}
        <View className="mx-4 mt-6">
          <Text className="text-[27px] font-extrabold mb-6 text-[#3F2305] text-center">Product Suggestions</Text>
          
          {/* Filter Pills */}
          <View className="flex-row mb-4 self-center mx-8 px-2">
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendProducts({ 
              hairType: params.hair_type as string, 
              scalpCondition: scalpCondition, 
              hairDamage: params.damage_level as string, 
              limit: 20 
            }).filter(product => selectedProductType === 'All' || product.productType === selectedProductType).map((product) => (
              <View key={product.id} className="mx-2">
                <FlipCard product={product} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Natural Remedies Section */}
        <View className="mx-4 mt-10 mb-6">
          <Text className="text-[27px] font-extrabold mb-6 text-[#3F2305] text-center">Natural Remedies</Text>
          
          {/* Filter Pills */}
          <View className="flex-row mb-8 self-center mx-8 px-2">
            {['All', 'Shampoo', 'Conditioner', 'Hair Oil'].map((type) => (
              <Pressable
                key={`remedy-${type}`}
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendProducts({ 
              hairType: params.hair_type as string, 
              scalpCondition: scalpCondition, 
              hairDamage: params.damage_level as string, 
              limit: 20 
            }).filter(product => selectedProductType === 'All' || product.productType === selectedProductType).map((product) => (
              <View key={`remedy-${product.id}`} className="mx-2">
                <FlipCard product={product} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>

      {/* Bottom Navigation */}
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
                    onPress={() => router.push('/journal')}>
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

      {/* Disclaimer Modal */}
      <Modal visible={showDisclaimer} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-11/12 items-center">
            <View className="w-full bg-[#3F2305] rounded-2xl px-5 py-4 mb-4">
              <Text className="text-lg font-bold mb-10 mt-10 text-[#3F2305] text-center">
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
    </View>
  );
}

