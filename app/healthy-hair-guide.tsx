import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, TouchableOpacity, Linking, TextInput} from "react-native";
import { router, usePathname } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { sampleProducts, getProductImage, Product } from '../lib/productRecommendations';
import { addFavorite, removeFavorite, isFavorite } from '../lib/favorites';

const { width, height } = Dimensions.get('window');

const categories = [
  { key: "all", label: "All" },
  { key: "straight", label: "Straight" },
  { key: "wavy", label: "Wavy" },
  { key: "curly", label: "Curly" },
  { key: "coily", label: "Coily" },
];

// Map filter keys to product hairTypes
const mapHairType = (filterKey: string): string[] => {
  const mapping: { [key: string]: string[] } = {
    'straight': ['Straight'],
    'wavy': ['Wavy'],
    'curly': ['Curly'],
    'coily': ['Coily', 'Kinky'], // Products may use either 'Coily' or 'Kinky'
  };
  return mapping[filterKey.toLowerCase()] || [filterKey];
};

// Product Card Component with Favorite functionality
const ProductCard = ({ product, idx }: { product: Product; idx: number }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const favStatus = await isFavorite(product.id);
      setIsFav(favStatus);
    };
    checkFavorite();
  }, [product.id]);

  const toggleFavorite = async () => {
    if (isFav) {
      await removeFavorite(product.id);
      setIsFav(false);
    } else {
      await addFavorite(product);
      setIsFav(true);
    }
  };

  // Extract key features from description
  const extractFeatures = (desc: string) => {
    const features: string[] = [];
    const naturalMatch = desc.match(/\d+\.?\d*%?\s*Natural/i);
    if (naturalMatch) features.push(naturalMatch[0]);
    if (desc.includes('Sulfate-Free') || desc.includes('sulfate-free')) features.push('Sulfate-Free');
    if (desc.includes('Paraben-Free') || desc.includes('paraben-free')) features.push('Paraben-Free');
    return features;
  };

  // Get description without the extracted features to avoid duplication
  const getCleanDescription = (desc: string, features: string[]) => {
    if (!desc) return '';
    
    let cleanDesc = desc;
    // Remove extracted features from description
    features.forEach(feature => {
      // Remove the feature and any surrounding newlines/whitespace
      const regex = new RegExp(feature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\n?', 'gi');
      cleanDesc = cleanDesc.replace(regex, '');
    });
    
    // Clean up multiple consecutive newlines
    cleanDesc = cleanDesc.replace(/\n{3,}/g, '\n\n').trim();
    
    // Limit description length to match Human Heart Nature length (~80-100 chars)
    // Split by newlines and take first 2-3 lines, or truncate to ~100 characters
    const maxLength = 100;
    if (cleanDesc.length > maxLength) {
      // Try to truncate at a sentence boundary or newline
      const truncated = cleanDesc.substring(0, maxLength);
      const lastNewline = truncated.lastIndexOf('\n');
      const lastPeriod = truncated.lastIndexOf('.');
      const lastSpace = truncated.lastIndexOf(' ');
      
      // Find the best break point
      let breakPoint = maxLength;
      if (lastNewline > maxLength * 0.7) {
        breakPoint = lastNewline;
      } else if (lastPeriod > maxLength * 0.7) {
        breakPoint = lastPeriod + 1;
      } else if (lastSpace > maxLength * 0.7) {
        breakPoint = lastSpace;
      }
      
      cleanDesc = cleanDesc.substring(0, breakPoint).trim();
    }
    
    return cleanDesc;
  };

  const features = extractFeatures(product.description || '');
  const cleanDescription = getCleanDescription(product.description || '', features);

  return (
    <View
      key={product.id || idx}
      className="bg-[#3F2305] rounded-xl mx-4 mt-2 mb-6 p-5"
      style={{ minHeight: 200, shadowColor: '#C16C10', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 50, shadowRadius: 4, elevation: 8}}>
      
      {/* Main Content Row */}
      <View className="flex-row" style={{ alignItems: 'flex-start' }}>
        {/* Left Side - Product Image and Tags */}
        <View className="mr-4 items-center" style={{ width: 120 }}>
          {product.imageKey && (
            <View className="bg-[#cfaf8d] rounded-lg mb-3 relative overflow-hidden" style={{ width: 120, height: 120, justifyContent: 'center', alignItems: 'center' }}>
              {/* Favorite Button - positioned at top left */}
              <View className="absolute left-2 top-2" style={{ zIndex: 1001 }}>
                <TouchableOpacity
                  onPress={toggleFavorite}
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
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image 
                  source={getProductImage(product.imageKey)} 
                  style={{ width: '80%', height: '80%' }}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
          
          
          {/* View Product Button - positioned below image on the left */}
          {product.link && (
            <View className="mt-3" style={{ width: 120 }}>
              <TouchableOpacity
                onPress={() => {
                  if (product.link) {
                    Linking.openURL(product.link);
                  }
                }}
                activeOpacity={0.6}
                style={{
                  backgroundColor: '#F2D8A7',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  elevation: 5,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#3F2305', fontSize: 12, fontWeight: 'bold' }}>View Product</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Right Side - Product Info */}
        <View style={{ flex: 1 }}>
          {/* Product Name */}
          <Text className="text-white text-2xl font-bold mb-3">{product.name}</Text>
          <View className="flex-row mb-1">
              {product.isNatural && (
                <View className="flex-row bg-[#C19A6B] px-2 py-1 mb-1 mr-2">
                  <Ionicons 
                    name="leaf-outline"
                    size={12} 
                    color="#ffffffff" 
                    style={{ marginRight: 4 }} />

                  <Text className="text-white text-xs font-semibold">Natural</Text>
                </View>
            )}
              {product.isLocal && (
                <View className="flex-row bg-[#C19A6B] px-2 py-1 mb-1">
                  <Ionicons 
                    name="flag-outline"
                    size={12} 
                    color="#ffffffff" 
                    style={{ marginRight: 4 }} />

                  <Text className="text-white text-xs font-semibold">Local</Text>
                </View>
              )}
          </View>
          
          {/* Key Features */}
          {features.length > 0 && (
            <View className="mb-2">
              {features.map((feature, fIdx) => (
                <Text key={fIdx} className="text-white text-sm mb-1">{feature}</Text>
              ))}
            </View>
          )}
          
          {/* Clean Description (without duplicated features) */}
          {cleanDescription && (
            <Text className="text-white text-sm mb-2 leading-5">{cleanDescription}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default function HealthyHairGuide() {
   const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [query, setQuery] = useState<string>(""); // <-- top level

  const handleSearch = (text: string) => {
    setQuery(text);

  };

  // Filter products based on selected hair type
  const filteredProducts = React.useMemo(() => {
    let products = selectedCategory === "all"
      ? sampleProducts.filter(p => p.hairTypes && p.hairTypes.length > 0)
      : sampleProducts.filter((product) => {
          const mappedHairTypes = mapHairType(selectedCategory);
          return product.hairTypes?.some(type =>
            mappedHairTypes.some(mappedType =>
              type.toLowerCase() === mappedType.toLowerCase()
            )
          );
        });

    // Apply search filter
    if (query) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    // search by label
    if (query.toLowerCase() === "natural") {
        products = sampleProducts.filter(p => p.isNatural);
    }

    if (query.toLowerCase() === "local") {
        products = sampleProducts.filter(p => p.isLocal);
    }


    if (query.toLowerCase() === "sulfate-free" || query.toLowerCase() === "sulfate free" || query.toLowerCase() === "sulfate") {
        products = sampleProducts.filter(p => p.description && p.description.toLowerCase().includes("sulfate-free"));
    }

    if (query.toLowerCase() === "paraben-free" || query.toLowerCase() === "paraben free" || query.toLowerCase() === "paraben") {
        products = sampleProducts.filter(p => p.description && p.description.toLowerCase().includes("paraben-free"));
    }


    return products;
  }, [selectedCategory, query]);

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

    {/* Search Bar */}
      <View className="self-center w-[365px] mb-5 mt-5 relative">
      <TextInput
        style={{
          backgroundColor: '#3F2305',
          color: 'white',
          borderRadius: 9999,
          paddingLeft: 45,
          paddingRight: 15,
          fontSize: 16,
          fontWeight: '600',
          height: 50,
          borderColor: '#C19A6B',
          borderWidth: 4
        }}
        placeholder="Search a product"
        placeholderTextColor="rgba(255, 255, 255, 1)"
        keyboardType="default"
        onChangeText={handleSearch} 
        value={query}
        clearButtonMode="always"
      />
        <Ionicons
          name="search"
          size={20}
          color="#FFF2E4"
          style={{
            position: 'absolute',
            left: 15,   
            top: '50%',     
            transform: [{ translateY: -10 }], 
          }}
        />
      </View>

        {/* Product Cards */}
      
        {filteredProducts.map((item, idx) => (
          <ProductCard key={item.id || idx} product={item} idx={idx}/>
        ))}
      </ScrollView>
      <View className="absolute bottom-5 self-center h-16 w-11/12 bg-[#3F2305] rounded-full 
      flex-row items-center justify-around px-2 py-2 shadow-xl border-2 border-[#FFF2E4]">
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
} 