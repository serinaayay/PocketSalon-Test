import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Image, Modal, Animated, Linking, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { getHairRoutine, mapDamageLevelToRoutine, mapHairTypeToRoutine, mapDamageTypeToRoutine, ScalpCondition } from '../lib/hairRoutines';
import { recommendProducts, getProductImage, getPriceCategory, Product } from '../lib/productRecommendations';
import { addFavorite, removeFavorite, isFavorite } from '../lib/favorites';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Natural Remedies data
const remedies = [
  {
    name: "Rosemary Oil",
    description: "Rosemary oil stimulates hair growth and improves circulation to the scalp.",
    category: "hair loss",
    howToUse: "Mix a few drops with a carrier oil (like coconut oil) to dilute and massage into the scalp. Leave at least a few minutes before washing out.",
    image: require('../assets/images/rosemary oil.jpg'),
  },
  {
    name: "Peppermint Oil",
    description: "Peppermint oil has been shown to promote hair growth by increasing blood flow to the scalp.",
    category: "hair loss",
    howToUse: "Dilute a few drops (1-2 drops) in a carrier oil and massage into the scalp. Leave for at least an hour before rinsing, then repeat for at least one month.",
    image: require('../assets/images/peppermint oil.jpg'),
  },
  {
    name: "Scalp Massage",
    description: "Regular scalp massages can improve blood circulation and stimulation of hair follicles, promoting hair growth.",
    category: "hair loss",
    howToUse: "Use can use your fingertips or scalp massagers to gently massage your scalp in circular motions for 5-10 minutes daily. You can also apply oils like coconut or jojoba oil during the massage for added benefits.",
    image: require('../assets/images/scalp massage.jpg'),
  },
  {
    name: "Rice Water",
    description: "Rice water is rich in vitamins and minerals that can strengthen hair and reduce breakage.",
    category: ["breakage", "color damage"],
    howToUse: "To make rice water, rinse 1/2 cup of rice thoroughly, then soak it in 2-3 cups of water for 30 minutes. Strain the rice and use the water as a final rinse after shampooing, then wash your hair right after.",
    image: require('../assets/images/rice water.jpg'),
  },
  {
    name: "Jojoba Oil",
    description: "Jojoba oil has an oily composition, making it an excellent moisturizer for dry, brittle hair.",
    category: ["breakage", "hair loss"],
    howToUse: "Apply a few drops to your fingers and spread evenly from the roots to its tips ends of your hair. Leave it on for at least 30 minutes before washing out with a gentle shampoo. You also can use it as a leave-in conditioner.",
    image: require('../assets/images/jojoba oil.jpg'),
  },
  {
    name: "Coconut Oil",
    description: "Coconut oil penetrates the hair shaft, reducing protein loss and preventing breakage.",
    category: "breakage",
    howToUse: "Warm a small amount of coconut oil and apply over damp hair, focusing on the ends. Leave it on for at least 1-2 hours before washing out with shampoo and conditioner.",
    image: require('../assets/images/coconut oil.jpg'),
  },
  {
    name: "Avocado Oil",
    description: "Avocado oil is rich in vitamins A, D, and E, which nourish and strengthen hair.",
    category: ["breakage", "color damage"],
    howToUse: "To use as a hair mask, mash half an avocado (after removing the stone and peel), mix it with one egg yolk and a tablespoon of honey, apply the mixture to clean, damp hair for 30 minutes, then rinse and dry — this treatment can be used once every two weeks for shinier, healthier hair.",
    image: require('../assets/images/avocado oil.jpg'),
  },
  {
    name: "Almond Oil",
    description: "Almond oil is rich in vitamin E and fatty acids that help repair and protect color-treated hair. It deeply hydrates and nourishes the hair, reducing damage caused by chemical treatments like hair dyes",
    category: "color damage",
    howToUse: "Apply a dime-sized amount to the ends of your hair before drying to rehydrate the strands and decrease frizz.",
    image: require('../assets/images/almond oil.jpg'),
  },
  {
    name: "Honey",
    description: "Honey is a natural humectant that helps retain moisture in color-treated hair, preventing dryness and brittleness.",
    category: "color damage",
    howToUse: "To use as a hair mask, mash half an avocado (after removing the stone and peel), mix it with one egg yolk and a tablespoon of honey, apply the mixture to clean, damp hair for 30 minutes, then rinse and dry — this treatment can be used once every two weeks for shinier, healthier hair.",
    image: require('../assets/images/honey.jpg'),
  },
  {
    name: "Olive Oil",
    description: "This cooking oil is rich in antioxidants and vitamins that help repair and strengthen color-damaged hair.",
    category: "color damage",
    howToUse: "Measure about 1–2 tablespoons (or around ¼ cup if you're treating longer, thicker hair). Massage the oil deeply into your hair, on the scalp if it's dry, or the ends if they're damaged, then wrap your hair in a shower cap and leave it on for at least 15 minutes. After the treatment, comb your hair with a wide-toothed comb, then shampoo thoroughly (you may need to shampoo twice depending on how much oil you used) and rinse",
    image: require('../assets/images/olive oil.jpg'),
  },
  {
    name: "Aloe Vera",
    description: "Aloe vera soothes the scalp and conditions hair, reducing dandruff and promoting healthy hair growth. It contains vitamin A, C, and E, which are essential for healthy hair, and Vitamin B12 and Folic Acid that help prevent hair loss.",
    category: ["color damage", "hair loss"],
    howToUse: "Scoop out fresh aloe vera gel (or use pure aloe vera gel) and apply it evenly to your scalp and hair, focusing on the ends if they're prone to breakage. Cover your hair with a shower cap and leave it on for 30–60 minutes. Rinse thoroughly with a mild shampoo. Use this once a week to help strengthen and nourish your hair.",
    image: require('../assets/images/aloe vera.jpg'),
  },
];

type Remedy = {
  name: string;
  description: string;
  category: string | string[];
  howToUse: string;
  image: any;
};

// Remedy Card Component
const RemedyCard = ({ remedy }: { remedy: Remedy }) => {
  const [flipped, setFlipped] = React.useState(false);
  const flipAnimation = React.useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: flipped ? 0 : 180,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
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
    <View style={{ width: 256, height: 400 }}>
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={flipCard}
        >
          <View className="w-64 bg-[#3F2305] rounded-xl shadow-lg p-4 items-center" style={{ height: 400 }}>
            {/* Remedy Image */}
            <View className="w-full bg-[#cfaf8d] rounded-lg mb-2 flex justify-center items-center" style={{ height: 140 }}>
              <Image
                source={remedy.image}
                style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
              />
            </View>
            
            <Text className="text-white text-xl font-bold text-center mb-2" numberOfLines={2}>
              {remedy.name}
            </Text>
            <ScrollView 
              style={{ maxHeight: 140, marginBottom: 8 }} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              <Text className="text-white text-xs text-center leading-4">
                {remedy.howToUse}
              </Text>
            </ScrollView>
            <View className="flex-row items-center justify-center flex-wrap gap-2 mt-auto px-2" style={{ zIndex: 1000 }}>
              <View
                style={{
                  backgroundColor: '#F2D8A7',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  elevation: 10,
                  zIndex: 1001,
                }}
              >
                <Text style={{ color: '#3F2305', fontSize: 12, fontWeight: 'bold' }}>More Info</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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
          activeOpacity={0.9}
          onPress={flipCard}
        >
          <View className="w-64 bg-[#3F2305] rounded-xl shadow-lg p-4" style={{height: 400}}>
            <View className="flex-row justify-center items-center mb-4">
              <Text className="text-white text-xl font-bold text-center">
                Description
              </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <Text className="text-white text-sm mb-2 text-justify leading-5">
                {remedy.description}
              </Text>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
    </View>

  );

};

// Flip Card Component
const FlipCard = ({ product, reorderProducts }: { product: Product, reorderProducts: (product: Product, liked: boolean) => void }) => {
  const [flipped, setFlipped] = React.useState(false);
  const [isFav, setIsFav] = React.useState(false);
  const [isLike, setIsLike] = React.useState<boolean | null>(null);
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

  //like/dislike + reorder
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
        <View className="w-64 bg-[#5B3E20] rounded-xl shadow-lg p-4" style={{height: 500}}>
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

    <View className='flex-row self-center'>
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

export default function PersonalizedRoutine() {
  const params = useLocalSearchParams();
  const pathname = usePathname();
  
  // Get parameters from navigation
  const scalpCondition = (params.scalp_condition as ScalpCondition) || 'Normal Scalp';
  const hairType = mapHairTypeToRoutine(params.hair_type as string || 'Straight');
  const damageLevel = mapDamageLevelToRoutine(params.damage_level as string || 'Healthy');
  
  // Try to get damage type from params, or extract from damage_level if not available
  let damageType: string | undefined = params.damage_type as string;
  if (!damageType || damageType === 'null' || damageType === 'undefined') {
    // Try to extract damage type from damage_level string (for backward compatibility)
    const damageLevelStr = (params.damage_level as string || '').toLowerCase();
    if (damageLevelStr.includes('breakage')) {
      damageType = 'Breakage';
    } else if (damageLevelStr.includes('hair loss') || damageLevelStr.includes('hairloss')) {
      damageType = 'Hair Loss';
    } else if (damageLevelStr.includes('color') || damageLevelStr.includes('colordamage')) {
      damageType = 'Color Damage';
    } else {
      damageType = 'Healthy';
    }
  }
  
  const mappedDamageType = mapDamageTypeToRoutine(damageType);
  const routine = getHairRoutine(scalpCondition, hairType, damageLevel, mappedDamageType);
  
  // Format damage display text (e.g., "Moderate Hair Loss" or "Light Breakage")
  const formatDamageDisplay = (level: string, type: string): string => {
    const normalizedLevel = (level || '').trim();
    const normalizedType = (type || '').trim();

    if (!normalizedLevel && !normalizedType) return 'Healthy';
    if (normalizedLevel.toLowerCase() === 'healthy' || normalizedType.toLowerCase() === 'healthy') {
      return 'Healthy';
    }

    const lowerLevel = normalizedLevel.toLowerCase();
    const lowerType = normalizedType.toLowerCase();

    // If the level string already contains the type or mentions chance/likelihood, keep it as-is
    if (
      lowerLevel.includes('chance') ||
      lowerLevel.includes('likely') ||
      (lowerType && lowerLevel.includes(lowerType))
    ) {
      return normalizedLevel;
    }

    // Remove generic "damage" wording and append "chance of"
    const levelWithoutDamage = normalizedLevel.replace(/\s*damage\s*/gi, '').trim();
    if (!levelWithoutDamage) {
      return `Chance of ${normalizedType}`;
    }
    return `${levelWithoutDamage} chance of ${normalizedType}`;
  };
  
  const damageDisplayText = formatDamageDisplay(damageLevel, mappedDamageType);
  
  // Extract base damage type from damage level for remedy filtering
  const getBaseDamageType = React.useMemo(() => {
    const damageLevelStr = (params.damage_level as string || '').toLowerCase();
    if (!damageLevelStr || damageLevelStr === 'healthy') return null;
    if (damageLevelStr.includes('breakage')) return 'Breakage';
    if (damageLevelStr.includes('hair loss') || damageLevelStr.includes('hair-loss') || damageLevelStr.includes('hairloss')) return 'Hair Loss';
    if (damageLevelStr.includes('color')) return 'Color Damage';
    return null;
  }, [params.damage_level]);

  // Filter remedies based on damage level
  const filteredRemedies = React.useMemo(() => {
    if (!getBaseDamageType) return [];
    const normalizedDamage = getBaseDamageType.toLowerCase();
    return remedies.filter(remedy => {
      if (Array.isArray(remedy.category)) {
        return remedy.category.some(cat => cat.toLowerCase() === normalizedDamage);
      }
      return remedy.category.toLowerCase() === normalizedDamage;
    });
  }, [getBaseDamageType]);
  
  // Debug logging
  console.log('PersonalizedRoutine params:', {
    scalp_condition: params.scalp_condition,
    hair_type: params.hair_type,
    damage_level: params.damage_level,
    damage_type: params.damage_type,
    mappedDamageType,
    damageLevel,
    damageDisplayText,
  });

  const [showDisclaimer, setShowDisclaimer] = React.useState(true);
  const [selectedProductType, setSelectedProductType] = React.useState<string>('All');
  const [products, setProducts] = React.useState(
    recommendProducts({ hairType: params.hair_type as string, scalpCondition: scalpCondition, hairDamage: params.damage_level as string, limit: 20})
  );

  const reorderProducts = (product: Product, liked: boolean) => {
    setProducts((prevProducts) => {
      const filtered = prevProducts.filter(p => p.id !== product.id);
      if (liked) {
        // Move liked product to the front
        return [product, ...filtered]
      } else {
        // Move disliked product to the back
        return [...filtered, product]
      }
    });
  };

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
      .map(line => ('preventOrphan(line, 2)'))
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
              <Text className="text-2xl font-bold text-white bg-[#3F2305] px-3 py-2 rounded-lg mb-6">Damage Treatment ({damageDisplayText})</Text>
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
        <Text className="text-base font-semibold mx-6 mt-10 mb-6 text-[#5B3E20] text-center">
          Disclaimer: This study is experimental. The recommended products below are for guidance and suggestions only. Consult a professional.
        </Text>

        {/* Product Recommendations Section */}
        <View className="mx-4 mt-6">
          <Text className="text-[27px] font-extrabold mb-6 text-[#3F2305] text-center">Product Suggestions</Text>
          
          {/* Filter Pills */}
          <View className="flex-row mb-4 self-center mx-8 px-2">
            {['All', 'Shampoo', 'Conditioner', 'Others'].map((type) => (
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
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16 }}
          >
            {products.filter(product => {
              if (selectedProductType === 'All') return true;
              if (selectedProductType === 'Others') {
                return product.productType !== 'Shampoo' && product.productType !== 'Conditioner';
              }
              return product.productType === selectedProductType;
            }).map((product) => (
              <View key={product.id} className="mx-4">
                <FlipCard product={product} reorderProducts={reorderProducts} />
              </View>
            ))}
          </ScrollView>
          </View>
        </View>

        {/* Natural Remedies Section */}
        <View className="mx-4 mt-10 mb-6">
          <Text className="text-2xl font-bold text-[#3F2305] text-center mb-4">Natural Remedies</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16 }}
          >
            {filteredRemedies.length > 0 ? (
              filteredRemedies.map((remedy, index) => (
                <View key={index} className="mx-4">
                  <RemedyCard remedy={remedy} />
                </View>
              ))
            ) : (
              <View className="mx-4 px-4 py-8">
                <Text className="text-[#5B3E20] text-center">No natural remedies available for your hair condition.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-5 self-center h-16 w-11/12 bg-[#3F2305] rounded-full flex-row items-center justify-around px-2 py-2 shadow-lg border-4 border-[#A68E6C]">
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
    </View>
  );
}