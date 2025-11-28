import {View, Text, Image, Pressable, ScrollView, Dimensions, Animated, Linking, TouchableOpacity, Modal} from 'react-native';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import React from 'react';
import { recommendProducts, getProductImage, getPriceCategory, Product } from '../lib/productRecommendations';
import { addFavorite, removeFavorite, isFavorite } from '../lib/favorites';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Svg as SvgNS, Circle as CircleNS, G as GNS, Text as SvgText } from "react-native-svg";

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

// Circular Progress Component for Hair Health Score
const CircularProgress = ({ percentage, size = 120, strokeWidth = 12 }: { percentage: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const healthyOffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <SvgNS width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <GNS rotation='' origin={`${center}, ${center}`}>
          {/* Red damage circle (background) */}
          <CircleNS
            cx={center}
            cy={center}
            r={radius}
            stroke="#E53935"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeOpacity={1}
          />
          {/* Green healthy circle (foreground) */}
          <CircleNS
            cx={center}
            cy={center}
            r={radius}
            stroke="#4CAF50"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={healthyOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
          {/* Percentage text */}
          <SvgText
            x={center}
            y={center - 5}
            textAnchor="middle"
            fontSize="28"
            fill="#3F2305"
            fontWeight="bold"
          >
            {`${Math.round(percentage)}%`}
          </SvgText>
          {/* Healthy label */}
          <SvgText
            x={center}
            y={center + 15}
            textAnchor="middle"
            fontSize="14"
            fill="#3F2305"
            fontWeight="600"
          >
            Healthy
          </SvgText>
        </GNS>
      </SvgNS>
    </View>
  );
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
    if (isLike === true) {
      // If already liked, unlike it
      setIsLike(null);
    } else {
      // Like it (whether it was null or false before)
      setIsLike(true);
      await reorderProducts(product, true);
    }
  };

  const toggleDislike = async (liked: boolean) => {
    if (isLike === false) {
      // If already disliked, undislike it
      setIsLike(null);
    } else {
      // Dislike it (whether it was null or true before)
      setIsLike(false);
      await reorderProducts(product, false);
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
          <View className="position left-2">
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
  Straight: require('../assets/images/straight-hair.png'),
  Curly: require('../assets/images/curly.png'),
  Wavy: require('../assets/images/wavy-hair.png'),
  Kinky: require('../assets/images/coily.png'),
  Coily: require('../assets/images/coily.png'),
};

const orderedHairTypes = ['Straight', 'Wavy', 'Curly', 'Coily'];
const orderedDamageTypes = ['Hair Loss', 'Color Damage', 'Breakage'];

// Map hair damages to images
const hairDamageImages: { [key: string]: any } = {
  'Healthy': require('../assets/images/healthy-hair.png'),
  'Healthy hair': require('../assets/images/healthy-hair.png'),
  'Breakage': require('../assets/images/unhealthy.png'),
  'Hair Loss': require('../assets/images/hair-loss.png'),
  'Color Damage': require('../assets/images/hair-thining.png'),
  'Possible chance of Breakage': require('../assets/images/unhealthy.png'),
  'Possible chance of Hair Loss': require('../assets/images/hair-loss.png'),
  'Possible chance of Color Damage': require('../assets/images/hair-thining.png'),
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
    Kinky: "You have coily/kinky hair! Coily hairs are known as Type 4 hair as they exhibit closed curls or zig-zag patterns and are beautifully dense and full of texture. Carefully following a tailored routine will help strengthen your coils, elevate their definition, and showcase their natural elegance!",
    Coily: "You have coily/kinky hair! Coily hairs are known as Type 4 hair as they exhibit closed curls or zig-zag patterns and are beautifully dense and full of texture. Carefully following a tailored routine will help strengthen your coils, elevate their definition, and showcase their natural elegance!",
  };

const hairDamageDescriptions: { [key: string]: string } = {
  'Healthy': "Great news! Your hair appears to be healthy with no significant damage detected. Keep up your current hair care routine!",
  'Healthy hair': "Great news! Your hair appears to be healthy with no significant damage detected. Keep up your current hair care routine!",
  'Breakage': "Hair breakage detected. Consider using strengthening treatments and avoid excessive heat styling.",
  'Hair Loss': "Hair loss indicators detected. Your hair may be at risk for increased shedding. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use gentle hair care products, maintain a balanced diet, avoid harsh styling practices, and consider scalp treatments designed to promote healthy hair growth.",
  'Color Damage': "Color damage detected. Use color-safe products and deep conditioning treatments to restore hair health.",
  'Possible chance of Breakage': "Possible breakage detected. Monitor your hair health and consider preventive care.",
  'Possible chance of Hair Loss': "Possible hair loss detected. Your hair may be at risk for increased shedding. Focus on gentle care and monitor for changes.",
  'Possible chance of Color Damage': "Possible color damage detected. Use protective, color-safe products to maintain hair integrity.",
  'Likely Breakage': "Possible breakage detected. Monitor your hair health and consider preventive care.",
  'Likely Hair Loss': "Possible hair loss detected. Your hair may be at risk for increased shedding. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use gentle hair care products, maintain a balanced diet, avoid harsh styling practices, and consider scalp treatments designed to promote healthy hair growth.",
  'Likely Color Damage': "Possible color damage. Use protective products to maintain hair integrity.",
  'Moderate chance of Breakage': "Moderate chance of breakage detected. Your hair may be at risk for increased breakage. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use gentle hair care products, maintain a balanced diet, avoid harsh styling practices, and consider treatments designed to strengthen hair.",
  'Moderate chance of Hair Loss': "Moderate chance of hair loss detected. Your hair may be at risk for increased shedding. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use gentle hair care products, maintain a balanced diet, avoid harsh styling practices, and consider scalp treatments designed to promote healthy hair growth.",
  'Moderate chance of Color Damage': "Moderate chance of color damage detected. Your hair may be at risk for color-related damage. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use color-safe hair care products, maintain a balanced diet, avoid harsh styling practices, and consider treatments designed to restore color-treated hair health.",
  'High chance of Breakage': "High chance of breakage detected. Your hair may be at significant risk for increased breakage. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use gentle hair care products, maintain a balanced diet, avoid harsh styling practices, and consider treatments designed to strengthen hair.",
  'High chance of Hair Loss': "High chance of hair loss detected. Your hair may be at significant risk for increased shedding. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use gentle hair care products, maintain a balanced diet, avoid harsh styling practices, and consider scalp treatments designed to promote healthy hair growth.",
  'High chance of Color Damage': "High chance of color damage detected. Your hair may be at significant risk for color-related damage. Consider professional consultation with a dermatologist or trichologist to identify underlying causes. In the meantime, use color-safe hair care products, maintain a balanced diet, avoid harsh styling practices, and consider treatments designed to restore color-treated hair health.",
};

// Helper function to normalize hair type (case-insensitive and handle aliases)
const normalizeHairType = (hairType: string | undefined): string | undefined => {
  if (!hairType) return undefined;
  
  const normalized = hairType.trim();
  const lower = normalized.toLowerCase();
  
  // Map variations to standard names
  if (lower === 'straight' || lower === 'type 1' || lower.includes('straight')) {
    return 'Straight';
  }
  if (lower === 'wavy' || lower === 'type 2' || lower.includes('wavy')) {
    return 'Wavy';
  }
  if (lower === 'curly' || lower === 'type 3' || lower.includes('curly')) {
    return 'Curly';
  }
  if (lower === 'coily' || lower === 'kinky' || lower === 'type 4' || lower.includes('coily') || lower.includes('kinky')) {
    // Prefer 'Coily' as it's more commonly used
    return 'Coily';
  }
  
  // If it matches a key exactly (case-sensitive), return as-is
  if (hairTypeImages[normalized] || hairTypeDescriptions[normalized]) {
    return normalized;
  }
  
  // Try capitalized version
  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  if (hairTypeImages[capitalized] || hairTypeDescriptions[capitalized]) {
    return capitalized;
  }
  
  return normalized;
};

const normalizeDamageLabel = (label: string | undefined): string | undefined => {
  if (!label) return undefined;
  const normalized = label.trim();
  const lower = normalized.toLowerCase();

  if (lower.includes('hair loss') || lower.includes('loss')) {
    return 'Hair Loss';
  }
  if (lower.includes('color damage') || lower.includes('color')) {
    return 'Color Damage';
  }
  if (lower.includes('breakage') || lower.includes('break')) {
    return 'Breakage';
  }
  if (hairDamageDescriptions[normalized]) {
    return normalized;
  }
  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  if (hairDamageDescriptions[capitalized]) {
    return capitalized;
  }
  return normalized;
};

const ResultsScreen = () => {
    const pathname = usePathname();
    const params = useLocalSearchParams();
    const rawHairType = params.hair_type as string | undefined;
    const normalizedHairType = normalizeHairType(rawHairType);
    const hairType = normalizedHairType || rawHairType; // Fallback to raw if normalization fails
    const scalpCondition = params.scalp_condition as string | undefined;
    const hairConfidence = params.hair_confidence as string | number | undefined;
    const damageLevel = params.damage_level as string | undefined;
    const damageConfidence = params.damage_confidence as string | number | undefined;
    const imageUri = params.image_uri as string | undefined;
    const hairHealthScore = params.hair_health_score ? parseFloat(params.hair_health_score as string) : null;
    const hairTypePredictionsParamRaw = params.hair_type_predictions as string | string[] | undefined;
    const hairTypePredictionsParam = Array.isArray(hairTypePredictionsParamRaw)
      ? hairTypePredictionsParamRaw[0]
      : hairTypePredictionsParamRaw;
    const damagePredictionsParamRaw = params.damage_predictions as string | string[] | undefined;
    const damagePredictionsParam = Array.isArray(damagePredictionsParamRaw)
      ? damagePredictionsParamRaw[0]
      : damagePredictionsParamRaw;

    const [isHairModalVisible, setIsHairModalVisible] = React.useState(false);
    const [isDamageModalVisible, setIsDamageModalVisible] = React.useState(false);
    const [selectedProductType, setSelectedProductType] = React.useState<string>('All');
    const [showDisclaimer, setShowDisclaimer] = React.useState(true);

    const legacyHairConfidenceMap = React.useMemo(() => {
      const map: { [key: string]: number } = {};
      orderedHairTypes.forEach(type => {
        const confidenceKey = `${type.toLowerCase()}_confidence`;
        const value = params[confidenceKey];

        if (typeof value === 'string') {
          const parsed = parseFloat(value);
          if (!Number.isNaN(parsed)) {
            map[type] = parsed;
          }
        } else if (Array.isArray(value) && value.length > 0) {
          const parsed = parseFloat(value[0]);
          if (!Number.isNaN(parsed)) {
            map[type] = parsed;
          }
        }
      });
      return map;
    }, [params]);

    const hairTypeConfidenceMap = React.useMemo(() => {
      const map: { [key: string]: number } = { ...legacyHairConfidenceMap };
      if (!hairTypePredictionsParam) {
        return map;
      }

      try {
        const parsed = JSON.parse(hairTypePredictionsParam);
        if (Array.isArray(parsed)) {
          parsed.forEach((prediction: any) => {
            const label = typeof prediction?.label === 'string' ? prediction.label : undefined;
            if (!label) {
              return;
            }
            const normalizedLabel = normalizeHairType(label);
            if (!normalizedLabel) {
              return;
            }

            let value: number | undefined;
            if (typeof prediction?.value === 'number') {
              value = prediction.value;
            } else if (typeof prediction?.value === 'string') {
              const parsedVal = parseFloat(prediction.value);
              if (!Number.isNaN(parsedVal)) {
                value = parsedVal;
              }
            }

            if (value === undefined && typeof prediction?.percentage === 'string') {
              const percentageString = prediction.percentage.replace('%', '');
              const parsedPercentage = parseFloat(percentageString);
              if (!Number.isNaN(parsedPercentage)) {
                value = parsedPercentage / 100;
              }
            }

            if (value !== undefined) {
              map[normalizedLabel] = value > 1 ? value / 100 : value;
            }
          });
        }
      } catch (error) {
        console.warn('Failed to parse hair type predictions', error);
      }

      return map;
    }, [hairTypePredictionsParam, legacyHairConfidenceMap]);

    const damageConfidenceMap = React.useMemo(() => {
      if (!damagePredictionsParam) {
        return {};
      }
      const map: { [key: string]: number } = {};
      try {
        const parsed = JSON.parse(damagePredictionsParam);
        if (Array.isArray(parsed)) {
          parsed.forEach((prediction: any) => {
            const normalizedLabel = normalizeDamageLabel(
              typeof prediction?.label === 'string' ? prediction.label : undefined
            );
            if (!normalizedLabel) {
              return;
            }

            let value: number | undefined;
            if (typeof prediction?.value === 'number') {
              value = prediction.value;
            } else if (typeof prediction?.value === 'string') {
              const parsedVal = parseFloat(prediction.value);
              if (!Number.isNaN(parsedVal)) {
                value = parsedVal;
              }
            }

            if (value === undefined && typeof prediction?.percentage === 'string') {
              const percentageString = prediction.percentage.replace('%', '');
              const parsedPercentage = parseFloat(percentageString);
              if (!Number.isNaN(parsedPercentage)) {
                value = parsedPercentage / 100;
              }
            }

            if (value !== undefined) {
              map[normalizedLabel] = value > 1 ? value / 100 : value;
            }
          });
        }
      } catch (error) {
        console.warn('Failed to parse damage predictions', error);
      }

      return map;
    }, [damagePredictionsParam]);

    const primaryHairConfidence = React.useMemo(() => {
      if (typeof hairConfidence === 'number') {
        return hairConfidence;
      }
      if (typeof hairConfidence === 'string') {
        const parsed = parseFloat(hairConfidence);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
      if (hairType && hairTypeConfidenceMap[hairType] !== undefined) {
        return hairTypeConfidenceMap[hairType];
      }
      return undefined;
    }, [hairConfidence, hairType, hairTypeConfidenceMap]);


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

    // Extract base damage type from damage level for product recommendations
    const getBaseDamageType = React.useMemo(() => {
      if (!damageLevel || damageLevel === 'Healthy') return null;
      const lower = damageLevel.toLowerCase();
      if (lower.includes('breakage')) return 'Breakage';
      if (lower.includes('hair loss') || lower.includes('hair-loss') || lower.includes('hairloss')) return 'Hair Loss';
      if (lower.includes('color')) return 'Color Damage';
      return damageLevel;
    }, [damageLevel]);

    const damageImageSource = React.useMemo(() => {
      if (damageLevel) {
        if (hairDamageImages[damageLevel]) {
          return hairDamageImages[damageLevel];
        }
        if (getBaseDamageType && hairDamageImages[getBaseDamageType]) {
          return hairDamageImages[getBaseDamageType];
        }
      }
      return hairDamageImages['Healthy'];
    }, [damageLevel, getBaseDamageType]);

    const damageDescription = React.useMemo(() => {
      if (damageLevel) {
        if (hairDamageDescriptions[damageLevel]) {
          return hairDamageDescriptions[damageLevel];
        }
        if (getBaseDamageType && hairDamageDescriptions[getBaseDamageType]) {
          const severityPrefix = damageLevel === getBaseDamageType ? '' : `${damageLevel}. `;
          return `${severityPrefix}${hairDamageDescriptions[getBaseDamageType]}`;
        }
      }
      return hairDamageDescriptions['Healthy hair'] || hairDamageDescriptions['Healthy'];
    }, [damageLevel, getBaseDamageType]);

    const normalizedDamageForConfidence = React.useMemo(() => {
      if (getBaseDamageType) {
        return getBaseDamageType;
      }
      return normalizeDamageLabel(damageLevel);
    }, [damageLevel, getBaseDamageType]);

    const primaryDamageConfidence = React.useMemo(() => {
      if (typeof damageConfidence === 'number') {
        return damageConfidence > 1 ? damageConfidence / 100 : damageConfidence;
      }
      if (typeof damageConfidence === 'string') {
        const parsed = parseFloat(damageConfidence);
        if (!Number.isNaN(parsed)) {
          return parsed > 1 ? parsed / 100 : parsed;
        }
      }
      if (
        normalizedDamageForConfidence &&
        damageConfidenceMap[normalizedDamageForConfidence] !== undefined
      ) {
        return damageConfidenceMap[normalizedDamageForConfidence];
      }
      return undefined;
    }, [damageConfidence, normalizedDamageForConfidence, damageConfidenceMap]);

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

    // Get damage-specific products
    const damageSpecificProducts = React.useMemo(() => {
      if (!getBaseDamageType) return [];
      const allProducts = recommendProducts({ 
        hairType, 
        scalpCondition, 
        hairDamage: getBaseDamageType, 
        limit: 20 
      });
      return allProducts.filter(product => 
        product.hairDamage && product.hairDamage.some(d => {
          const productDamage = d.toLowerCase();
          const targetDamage = getBaseDamageType.toLowerCase();
          return productDamage === targetDamage || 
                 productDamage.includes(targetDamage) || 
                 targetDamage.includes(productDamage);
        })
      ).slice(0, 5);
    }, [getBaseDamageType, hairType, scalpCondition]);

    // Note: Hair analysis is now saved in hair-detection.tsx to avoid duplicates
    // This useEffect has been removed to prevent duplicate journal entries

    return (
        <View className="flex-1 bg-[#FFF2E4]">
            <Modal
                visible={showDisclaimer}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowDisclaimer(false)}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.11)',
                    }}>
                    <View className="w-96 bg-[#3F2305] rounded-2xl px-5 py-4 mb-4">
                        <Text className="text-[#FAF7F0] italic font-normal text-lg text-center">
                            Disclaimer: This application is experimental. Consult a trusted hair expert.
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => {
                            setShowDisclaimer(false);
                        }}
                        className="bg-[#F2EAD3] px-5 py-2 rounded-xl">
                        <Text className="text-[#3F2305] font-semibold">OK</Text>
                    </Pressable>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isHairModalVisible}
                onRequestClose={() => setIsHairModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-6">
                    <View
                        className="bg-[#FFF2E4] rounded-3xl w-full max-w-md px-5 pt-10 pb-6"
                        style={{ maxHeight: height * 0.8 }}
                    >
                        <Pressable
                            onPress={() => setIsHairModalVisible(false)}
                            className="absolute top-4 right-4 bg-[#3F2305] w-9 h-9 rounded-full items-center justify-center shadow-lg"
                        >
                            <Ionicons name="close" size={20} color="#FFF2E4" />
                        </Pressable>
                        <Text className="text-[#3F2305] text-2xl font-bold text-center mb-4">
                            Overall Hair Type Results
                        </Text>
                        {imageUri && (
                            <View className="items-center mb-4">
                                <Image
                                    source={{ uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}` }}
                                    style={{
                                        width: width * 0.5,
                                        height: width * 0.5,
                                        borderRadius: 12,
                                        resizeMode: 'cover',
                                    }}
                                />
                            </View>
                        )}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: height * 0.55 }}
                            contentContainerStyle={{ paddingBottom: 8 }}
                        >
                            {orderedHairTypes.map(type => {
                                const confidenceValue =
                                  hairType === type && primaryHairConfidence !== undefined
                                    ? primaryHairConfidence
                                    : hairTypeConfidenceMap[type];
                                const isDetectedType = hairType === type;
                                return (
                                    <View
                                        key={type}
                                        className={`flex-row items-center justify-between px-4 py-3 mb-3 rounded-2xl ${
                                            isDetectedType ? 'bg-[#3F2305]' : 'bg-[#F2EAD3]'
                                        }`}
                                    >
                                        <View className="flex-row items-center flex-1">
                                            {hairTypeImages[type] && (
                                                <Image
                                                    source={hairTypeImages[type]}
                                                    style={{
                                                        width: 42,
                                                        height: 42,
                                                        resizeMode: 'contain',
                                                        tintColor: isDetectedType ? '#FFFFFF' : undefined,
                                                    }}
                                                />
                                            )}
                                            <View className="ml-3 flex-1">
                                                <Text
                                                    className={`text-lg font-semibold ${
                                                        isDetectedType ? 'text-white' : 'text-[#3F2305]'
                                                    }`}
                                                >
                                                    {type}{isDetectedType ? ' ✓' : ''}
                                                </Text>
                                                <Text
                                                    className={`text-xs ${
                                                        isDetectedType ? 'text-white/80' : 'text-[#3F2305]/70'
                                                    }`}
                                                >
                                                    {isDetectedType ? 'Detected Type' : 'Alternative'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text
                                                className={`text-xl font-bold ${
                                                    isDetectedType ? 'text-white' : 'text-[#3F2305]'
                                                }`}
                                            >
                                                {confidenceValue !== undefined
                                                    ? `${(confidenceValue * 100).toFixed(2)}%`
                                                    : 'N/A'}
                                            </Text>
                                            <Text
                                                className={`text-xs ${
                                                    isDetectedType ? 'text-white/70' : 'text-[#3F2305]/70'
                                                }`}
                                            >
                                                Confidence
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <Text className="text-center text-xs text-[#3F2305] mt-1">
                            Detected hair type is highlighted above.
                        </Text>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isDamageModalVisible}
                onRequestClose={() => setIsDamageModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-6">
                    <View
                        className="bg-[#FFF2E4] rounded-3xl w-full max-w-md px-5 pt-10 pb-6"
                        style={{ maxHeight: height * 0.8 }}
                    >
                        <Pressable
                            onPress={() => setIsDamageModalVisible(false)}
                            className="absolute top-4 right-4 bg-[#3F2305] w-9 h-9 rounded-full items-center justify-center shadow-lg"
                        >
                            <Ionicons name="close" size={20} color="#FFF2E4" />
                        </Pressable>
                        <Text className="text-[#3F2305] text-2xl font-bold text-center mb-4">
                            Overall Hair Damage Results
                        </Text>
                        {imageUri && (
                            <View className="items-center mb-4">
                                <Image
                                    source={{ uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}` }}
                                    style={{
                                        width: width * 0.5,
                                        height: width * 0.5,
                                        borderRadius: 12,
                                        resizeMode: 'cover',
                                    }}
                                />
                            </View>
                        )}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: height * 0.55 }}
                            contentContainerStyle={{ paddingBottom: 8 }}
                        >
                            {orderedDamageTypes.map(type => {
                                const confidenceValue =
                                  normalizedDamageForConfidence === type && primaryDamageConfidence !== undefined
                                    ? primaryDamageConfidence
                                    : damageConfidenceMap[type];
                                const isDetectedType = normalizedDamageForConfidence
                                  ? type === normalizedDamageForConfidence
                                  : false;
                                return (
                                    <View
                                        key={type}
                                        className={`flex-row items-center justify-between px-4 py-3 mb-3 rounded-2xl ${
                                            isDetectedType ? 'bg-[#3F2305]' : 'bg-[#F2EAD3]'
                                        }`}
                                    >
                                        <View className="flex-row items-center flex-1">
                                            {hairDamageImages[type] && (
                                                <Image
                                                    source={hairDamageImages[type]}
                                                    style={{
                                                        width: 42,
                                                        height: 42,
                                                        resizeMode: 'contain',
                                                        tintColor: isDetectedType ? '#FFFFFF' : undefined,
                                                    }}
                                                />
                                            )}
                                            <View className="ml-3 flex-1">
                                                <Text
                                                    className={`text-lg font-semibold ${
                                                        isDetectedType ? 'text-white' : 'text-[#3F2305]'
                                                    }`}
                                                >
                                                    {type}{isDetectedType ? ' ✓' : ''}
                                                </Text>
                                                <Text
                                                    className={`text-xs ${
                                                        isDetectedType ? 'text-white/80' : 'text-[#3F2305]/70'
                                                    }`}
                                                >
                                                    {isDetectedType ? 'Detected Damage Type' : 'Alternative'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text
                                                className={`text-xl font-bold ${
                                                    isDetectedType ? 'text-white' : 'text-[#3F2305]'
                                                }`}
                                            >
                                                {confidenceValue !== undefined
                                                    ? `${(confidenceValue * 100).toFixed(2)}%`
                                                    : 'N/A'}
                                            </Text>
                                            <Text
                                                className={`text-xs ${
                                                    isDetectedType ? 'text-white/70' : 'text-[#3F2305]/70'
                                                }`}
                                            >
                                                Confidence
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <Text className="text-center text-xs text-[#3F2305] mt-1">
                            Detected damage type is highlighted above.
                        </Text>
                    </View>
                </View>
            </Modal>
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
                          {hairType && hairTypeImages[hairType] ? (
                            <Image
                              source={hairTypeImages[hairType]}
                              style={{ width: '70%', height: '70%', resizeMode: 'contain' }}
                            />
                          ) : (
                            <View className="items-center justify-center">
                              <Text className="text-[#3F2305] text-xs text-center">No image available</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-base font-semibold mt-2 text-[#2D2D2D] mr-4 text-center">{hairType || 'Hair Type'}</Text>
                    </View>

                    {/* Hair Type description */}
                    <View className="bg-[#3F2305] rounded-[15px] justify-center shadow-lg"
                        style={{ 
                            width: width * 0.6,
                            minHeight: height * 0.10,
                            marginLeft: width * 0.02
                        }}>
                        <Text className="text-white text-sm font-medium p-4 text-justify">
                            {hairType && hairTypeDescriptions[hairType] 
                              ? hairTypeDescriptions[hairType] 
                              : hairType 
                                ? `Your hair type is ${hairType}. Each hair type has unique characteristics and requires specific care routines to maintain health and appearance.`
                                : 'Hair type information will be displayed here once your hair analysis is complete.'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-end items-center mx-8">
                    <Text className="text-m mb-4 font-bold text-[#5B3E20]">
                        Confidence: {primaryHairConfidence !== undefined ? `${(primaryHairConfidence * 100).toFixed(2)}%` : 'N/A'}
                    </Text>
                    <Pressable
                        onPress={() => setIsHairModalVisible(true)}
                        className="ml-3 mb-4 bg-[#3F2305] rounded-full items-center justify-center shadow-md"
                        style={{ width: 30, height: 30 }}
                    >
                        <FontAwesome name="question" size={16} color="#FFF2E4" />
                    </Pressable>
                </View>

                {/* Hair Damage Section */}
                <View className="mx-8 my-4">
                <Text className="text-[26px] font-bold mb-7 text-[#3F2305] self-center">
                    Hair Damage Check!
                </Text>

                <View className="flex-row items-center">
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
                        {damageImageSource ? (
                        <Image
                            source={damageImageSource}
                            style={{ width: '70%', height: '70%', resizeMode: 'contain' }}
                        />
                        ) : (
                          <View className="items-center justify-center">
                            <Text className="text-[#3F2305] text-xs text-center">No image available</Text>
                          </View>
                        )}
                    </View>
                    <Text
                      className="text-base font-semibold mt-2 text-[#2D2D2D] text-center"
                      style={{ width: width * 0.30 }}
                    >
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
                            {damageDescription || 'Hair analysis complete.'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-end items-center mx-1 mt-5 mb-5">
                    <Text className="text-m mb-4 font-bold text-[#5B3E20]">
                        Confidence: {primaryDamageConfidence !== undefined ? `${(primaryDamageConfidence * 100).toFixed(2)}%` : 'N/A'}
                    </Text>
                    <Pressable
                        onPress={() => setIsDamageModalVisible(true)}
                        className="ml-3 mb-4 bg-[#3F2305] rounded-full items-center justify-center shadow-md"
                        style={{ width: 30, height: 30 }}
                    >
                        <FontAwesome name="question"  size={16} color="#FFF2E4" />
                    </Pressable>
                </View>
                
                {/* Hair Health Score */}
                {hairHealthScore !== null && (
                    <View className="self-center mb-5">
                        <Text className="text-[26px] font-bold mb-7 text-[#3F2305] self-center">
                            Hair Health Score
                        </Text>
                        <View className="flex-row items-center">
                            <View className="items-center" style={{ width: width * 0.28, alignItems: 'center', marginLeft: width * 0.03 }}>
                                    <CircularProgress percentage={hairHealthScore} size={width * 0.30} strokeWidth={12} />
                            </View>
                            <View className="bg-[#3F2305] rounded-[15px] justify-center shadow-lg"
                                style={{ 
                                    width: width * 0.6,
                                    minHeight: height * 0.10,
                                    marginLeft: width * 0.04
                                }}>
                                <Text className="text-white text-sm font-medium p-4 text-justify">
                                    Your hair is {Math.round(hairHealthScore)}% healthy. This score reflects the overall condition of your hair based on the analysis of damage and texture.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                </View>

                <Text className="text-lg font-bold mb-10 mt-10 text-[#3F2305] text-center">Disclaimer: This study is experimental; The recommended products below are 
                    for guidance and suggestions only. Consult a professional. </Text>
             
                {/* Product Recommendations Row */}
                <View className="mx-8 my-16">
                    <Text className="text-[29px] font-extrabold mb-6 text-[#3F2305] text-center">Product Suggestions</Text>
                    
                    {/* Filter Pills */}
                    <View className="flex-row mb-3 self-center mx-8 px-2">
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
                            ₱ - Less than 300 Pesos {'\n'}
                            ₱₱ - 300 to 500 Pesos {'\n'}
                            ₱₱₱ - Above 500 Pesos 
                        </Text>
                    </View>

                    <View className="w-full flex items-center self-center">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {products
                          .filter(product => {
                            if (selectedProductType === 'All') return true;
                            if (selectedProductType === 'Others') {
                              return product.productType !== 'Shampoo' && product.productType !== 'Conditioner';
                            }
                            return product.productType === selectedProductType;
                          })
                          .map((product) => (
                            <View key={product.id} className="mx-4">
                              <FlipCard product={product} reorderProducts={reorderProducts} />
                            </View>
                        ))}
                      </ScrollView>
                    </View>
                </View>

                {/* View Personalized Routine Button */}
                <View className="mx-8 my-6">
                    <Pressable 
                        className="bg-[#3F2305] py-4 px-6 rounded-2xl shadow-lg"
                        onPress={() => {
                            // Ensure we have the actual damage level value
                            const actualDamageLevel = damageLevel && damageLevel.trim() ? damageLevel : 'Healthy';
                            const actualDamageType = getBaseDamageType && getBaseDamageType.trim() ? getBaseDamageType : 'Healthy';
                            
                            console.log('Navigating to PersonalizedRoutine with params:', {
                                hair_type: hairType,
                                damage_level: actualDamageLevel,
                                damage_type: actualDamageType,
                                scalp_condition: scalpCondition || 'Normal Scalp',
                                raw_damageLevel: damageLevel,
                                raw_getBaseDamageType: getBaseDamageType,
                            });
                            
                            router.push({
                                pathname: '/PersonalizedRoutine',
                                params: {
                                    hair_type: hairType || 'Straight',
                                    damage_level: actualDamageLevel,
                                    damage_type: actualDamageType,
                                    scalp_condition: scalpCondition || 'Normal Scalp',
                                }
                            });
                        }}>
                        <Text className="text-white text-xl font-bold text-center">
                            View Your Personalized Routine
                        </Text>
                        <Text className="text-white text-sm text-center mt-2">
                            Get detailed care instructions for your hair
                        </Text>
                    </Pressable>
                </View>

                {/* Natural Remedies Row */}
                <View className="mx-8 my-8">
                    <Text className="text-[29px] font-extrabold mb-6 text-[#3F2305] text-center">Natural Remedies</Text>
                    
                    <View className="w-full flex items-center">
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
                </View>


            </ScrollView>

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
                    onPress={() => router.push({
                        pathname: '/journal',
                        params: {
                            hair_health_score: hairHealthScore ? hairHealthScore.toString() : '',
                            image_uri: imageUri ? imageUri : '',
                        },
                    })}
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

export default ResultsScreen;
