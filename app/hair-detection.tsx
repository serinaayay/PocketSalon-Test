import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');
const frameSize = Math.min(width * 0.9, 350); // Responsive frame size

export default function HairDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // allow cropping
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // allow cropping
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
    try {
      const response = await fetch('http://192.168.0.239:8000/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json();
      router.push({ pathname: '/ResultsScreen', params: { hair_type: data.hair_type, confidence: data.confidence } });
    } catch (e) {
      setError('Failed to analyze image.');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-[#FFEAD2]">
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 100, minHeight: height }}>
        {/* Header with back arrow */}
        <View className="flex-row items-center mt-16 mb-4 w-full p-8 bg-[#6C4E31]">
          <Pressable onPress={() => router.push('/homepage')} className="mr-4">
            <Image
              source={require('../assets/images/left-arrow.png')}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
          </Pressable>
          <Text className="text-[#FFEEDB] text-4xl font-bold text-center flex-1">Hair Type Detector</Text>
        </View>

        {/* Image Frame */}
        <View style={{ width: frameSize, height: frameSize }} className="relative mt-8 rounded-xl overflow-hidden items-center justify-center bg-white">
          {image ? (
            <Image source={{ uri: image }} style={{ width: frameSize, height: frameSize }} resizeMode="cover" />
          ) : (
            <View className="flex-1 w-full h-full items-center justify-center">
              <Text className="text-gray-400 text-xl">No Image</Text>
            </View>
          )}
          {/* Four crisp corners using new assets, now larger for overlay effect */}
          <Image source={require('../assets/images/top_left.png')} style={{ width: 60, height: 60 }} className="absolute top-0 left-0 z-12" />
          <Image source={require('../assets/images/top_right.png')} style={{ width: 60, height: 60 }} className="absolute top-0 right-0 z-12" />
          <Image source={require('../assets/images/bottom_left.png')} style={{ width: 60, height: 60 }} className="absolute bottom-0 left-0 z-12" />
          <Image source={require('../assets/images/bottom_right.png')} style={{ width: 60, height: 60 }} className="absolute bottom-0 right-0 z-12" />
        </View>

        {/* Upload and Capture Buttons */}
        <View style={{ width: frameSize, position: 'relative', minHeight: 100 }} className="mt-32 mb-4">
          {/* Upload Image button at lower left */}
          <Pressable onPress={pickImage} style={{ position: 'absolute', left: 0, bottom: -40 }}>
            <View className="w-20 h-20 bg-white rounded-lg items-center justify-center">
              <Text className="text-[#6c4e31] font-bold text-center">{'Upload\nImage'}</Text>
            </View>
          </Pressable>
          {/* Centered Capture Button */}
          <View style={{ alignItems: 'center', width: '100%' }}>
            <Pressable onPress={takePhoto}>
              <Image
                source={require('../assets/images/capture_button.png')}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </Pressable>
            {/* Analyze Button */}
            {image && (
              <Pressable
                onPress={analyzeImage}
                className="mt-6 bg-[#6C4E31] px-8 py-4 rounded-lg"
                disabled={loading}
              >
                <Text className="text-[#FFEEDB] text-lg font-bold text-center">{loading ? 'Analyzing...' : 'Analyze'}</Text>
              </Pressable>
            )}
          </View>
        </View>
        {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
      </ScrollView>
    </View>
  );
} 