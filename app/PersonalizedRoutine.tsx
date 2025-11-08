import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Image, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getHairRoutine, mapDamageLevelToRoutine, mapHairTypeToRoutine, ScalpCondition } from '../lib/hairRoutines';
import { recommendProducts, getProductImage } from '../lib/productRecommendations';

const { width, height } = Dimensions.get('window');

export default function PersonalizedRoutine() {
  const params = useLocalSearchParams();
  
  // Get parameters from navigation
  const scalpCondition = (params.scalp_condition as ScalpCondition) || 'Normal Scalp';
  const hairType = mapHairTypeToRoutine(params.hair_type as string || 'Straight');
  const damageLevel = mapDamageLevelToRoutine(params.damage_level as string || 'Healthy');

  const routine = getHairRoutine(scalpCondition, hairType, damageLevel);

  const [showDisclaimer, setShowDisclaimer] = React.useState(true);

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
        <Text className="text-3xl font-bold text-[#3F2305] mt-16 mx-6 text-center">
          Your Personalized {'\n'}Hair Care Routine
        </Text>

        <Text className="text-base text-[#5B3E20] mx-6 mt-4 text-center">
          Based on: {scalpCondition} • {hairType} Hair • {damageLevel}
        </Text>

        {/* (Summary removed per request) */}

        {/* Section 1: Scalp Routine */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-[#3F2305]">Scalp Care (Only Scalp)</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/calendar.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Wash Frequency</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.scalpRoutine.washFrequency)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/shampoo.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Shampoo Type</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.scalpRoutine.shampooType)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/waterdrop.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">How To Wash</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.scalpRoutine.howTo)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-treatment.png')} offsetX={2} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Treatment</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.scalpRoutine.treatment)}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Hair Type Routine */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-[#3F2305]">Hair Styling ({hairType} Hair)</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-conditioner.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Conditioner Tips</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.hairTypeRoutine.conditionerTips)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/comb.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Styling</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.hairTypeRoutine.styling)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-dryer.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Drying Tips</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.hairTypeRoutine.dryingTips)}</Text>
            </View>
          </View>

          {routine.hairTypeRoutine.extraTip && (
            <View className="flex-row items-center mb-5">
              <IconSquare>
                <CenteredImage src={require('../assets/recommendation page/healthy (1).png')} />
              </IconSquare>
              <View className="flex-1">
                <Text className="text-[#3F2305] font-semibold text-xl mb-1">Extra Tip</Text>
                <Text className="text-[#5B3E20] text-base">{formatBody(routine.hairTypeRoutine.extraTip)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Section 3: Damage Treatment */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-[#3F2305]">Damage Treatment ({damageLevel})</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/goal.png')} offsetX={5} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Goal</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.damageRoutine.goal)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-conditioner.png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Conditioner</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.damageRoutine.conditioner)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/hair-treatment.png')} offsetX={2} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Treatment</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.damageRoutine.treatment)}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-5">
            <IconSquare>
              <CenteredImage src={require('../assets/recommendation page/healthy (1).png')} />
            </IconSquare>
            <View className="flex-1">
              <Text className="text-[#3F2305] font-semibold text-xl mb-1">Lifestyle</Text>
              <Text className="text-[#5B3E20] text-base">{formatBody(routine.damageRoutine.lifestyle)}</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <Text className="text-base font-semibold mx-6 mt-10 mb-6 text-[#5B3E20] text-center">
          Disclaimer: This study is experimental. The recommended products below are for guidance and suggestions only. Consult a professional.
        </Text>

        {/* Product Recommendations Section */}
        <View className="mx-4 mt-6">
          <Text className="text-2xl font-bold text-[#3F2305] text-center mb-4">Product Suggestions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendProducts({ 
              hairType: params.hair_type as string, 
              scalpCondition: scalpCondition, 
              hairDamage: params.damage_level as string, 
              limit: 10 
            }).map((product) => (
              <View key={product.id} className="w-64 bg-[#3F2305] rounded-xl shadow-lg mx-2 p-4 items-center">
                <View className="w-full aspect-square bg-[#f3ddc5] rounded-lg mb-4 flex justify-center items-center">
                  <Image
                    source={getProductImage(product.imageKey)}
                    style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
                  />
                </View>
                <Text className="text-white text-xl font-bold text-center mb-2">
                  {product.name}
                </Text>
                <Text className="text-white text-sm text-center">
                  {product.description}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Natural Remedies Section */}
        <View className="mx-4 mt-10 mb-6">
          <Text className="text-2xl font-bold text-[#3F2305] text-center mb-4">Natural Remedies</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendProducts({ 
              hairType: params.hair_type as string, 
              scalpCondition: scalpCondition, 
              hairDamage: params.damage_level as string, 
              limit: 10 
            }).map((product) => (
              <View key={`remedy-${product.id}`} className="w-64 bg-[#3F2305] rounded-xl shadow-lg mx-2 p-4 items-center">
                <View className="w-full aspect-square bg-[#f3ddc5] rounded-lg mb-4 flex justify-center items-center">
                  <Image
                    source={getProductImage(product.imageKey)}
                    style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
                  />
                </View>
                <Text className="text-white text-xl font-bold text-center mb-2">
                  {product.name}
                </Text>
                <Text className="text-white text-sm text-center">
                  {product.description}
                </Text>
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
            </View>
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

