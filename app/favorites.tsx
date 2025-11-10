import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Image, Animated, Linking, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { getFavorites, addFavorite, removeFavorite, isFavorite } from '../lib/favorites';
import { Product, getProductImage, getPriceCategory } from '../lib/productRecommendations';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Flip Card Component (same as in PersonalizedRoutine)
const FlipCard = ({ product, onFavoriteChange }: { product: Product; onFavoriteChange: () => void }) => {
  const [flipped, setFlipped] = React.useState(false);
  const [isFav, setIsFav] = React.useState(true); // Starts as favorite since we're in favorites page
  const flipAnimation = React.useRef(new Animated.Value(0)).current;

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
      onFavoriteChange(); // Refresh the list
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
              >
                <Text style={{ color: '#3F2305', fontSize: 12, fontWeight: 'bold' }}>View Product</Text>
              </TouchableOpacity>
            )}
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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>('All');

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const filteredFavorites = selectedProductType === 'All' 
    ? favorites 
    : favorites.filter(product => product.productType === selectedProductType);

  return (
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <Text className="text-3xl font-bold text-[#3F2305] mt-16 mx-6 text-center">
          My Favorite Products
        </Text>

        {/* Filter Pills */}
        <View className="flex-row mb-4 mt-6 mx-4">
          {['All', 'Shampoo', 'Conditioner', 'Hair Oil'].map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelectedProductType(type)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedProductType === type ? 'bg-[#3F2305]' : 'bg-[#E8DCC8]'
              }`}
            >
              <Text className={`text-sm font-semibold ${
                selectedProductType === type ? 'text-white' : 'text-[#5B3E20]'
              }`}>
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Favorites List */}
        {filteredFavorites.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Ionicons name="heart-outline" size={64} color="#3F2305" />
            <Text className="text-xl text-[#3F2305] mt-4 mx-6 text-center">
              No favorite products yet!
            </Text>
            <Text className="text-base text-[#5B3E20] mt-2 mx-6 text-center">
              Start adding products to your favorites by tapping the heart icon.
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredFavorites.map((product) => (
              <View key={product.id} className="mx-2">
                <FlipCard product={product} onFavoriteChange={loadFavorites} />
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute left-2 right-0 bottom-2 mb-10 ml-3 h-16 w-11/12 self-center bg-[#3F2305] rounded-full flex-row items-center px-2 py-2 shadow-lg">
        <View className="flex-1 flex-row justify-around">
          <View className="flex-col items-center">
            <Pressable className="2 justify-center" onPress={() => router.push('/homepage')}>
              <Image source={require('../assets/images/house 1.png')} className="w-8 h-8"/>
            </Pressable>
          </View>
          <View className="flex-col items-center">
            <Pressable className="2 justify-center" onPress={() => router.push('/hair-detection')}>
              <Image source={require('../assets/images/capture (1).png')} className="w-9 h-9"/>
            </Pressable>
          </View>
          <View className="flex-col items-center">
            <Pressable className="2 justify-center" onPress={() => router.push('/journal')}>
              <Image source={require('../assets/images/agenda 1.png')} className="w-9 h-9"/>
            </Pressable>
          </View>
          <View className="flex-col items-center">
            <Pressable className="2 justify-center" onPress={() => router.push('/favorites')}>
              <Image source={require('../assets/images/heart (1).png')} className="w-9 h-9"/>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

