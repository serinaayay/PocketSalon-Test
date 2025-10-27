import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";

const { width, height } = Dimensions.get('window');
const frameSize = Math.min(width * 0.9, 350); 

export default function HairDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

      if (galleryStatus !== "granted" || cameraStatus !== "granted") {
        Alert.alert(
          "Permissions required",
          "Please grant camera and photo library access in your settings to use this feature."
        );
      }
    })();
  }, []);

  const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    console.log("Picker result:", result);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  } catch (error) {
    console.error("Error launching image picker:", error);
    Alert.alert("Error", "Failed to open image picker.");
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
      const response = await fetch('http://172.17.53.25:8000/predict', {
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
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 100,}}>
        {/* Header with back arrow */}
        <View className="flex-row items-center w-full h-[35vh] bg-[#3F2305] rounded-b-3xl justify-center">
          <Pressable onPress={() => router.push('/homepage')} className="absolute left-7">
            <Image
              source={require('../assets/images/arrow.png')} //change to white arrow
              style={{ width: width * 0.07, height: height * 0.04, marginTop: height * -0.09}}
              resizeMode="contain"/>
          </Pressable>
          <Text className="text-[#FAF7F0] text-4xl font-bold text-center -mt-24">Hair Type and {'\n'} Damage Detector</Text>
          {/* to center text */}
          <View className="absolute items-center justify-center mt-16 px-10">
          <Text className="text-[#FAF7F0] text-xl text-wrap-pretty w-96 mt-14 text-center">Take a picture or upload an image of your hair and we’ll identify your hair type!</Text>
          </View>
        </View>

        {/* Image Frame */}
        <View style={{ width: frameSize, height: frameSize, zIndex: 1, marginTop: -frameSize / 5}} className="relative rounded-xl overflow-hidden 
        items-center justify-center bg-[#DFD7BF] top-12 shadow-lg">
          {image ? (
            <Image source={{ uri: image }} style={{ width: frameSize, height: frameSize }} resizeMode="cover" />
          ) : (
            <View className="flex-1 w-full h-full items-center justify-center align-middle">
              <Text className="text-400 text-xl color-black">No Image</Text>
            </View>
          )}
        </View>

        {/* Upload and Capture Buttons */}
        <View style={{ width: frameSize, minHeight: 100 }} className="mt-28 mb-6">
          {/* Upload Image button at lower left */}
          <Pressable 
          onPress={pickImage} style={{left: width * 0.06, bottom: height * 0.023}}>
            <View className="w-20 h-20 bg-[#DFD7BF] rounded-lg justify-center shadow-md">
              <Text className="text-black font-medium text-center">{'Upload\nImage'}</Text>
            </View>
          </Pressable>
          
          {/* Centered Capture Button */}
            <Pressable onPress={takePhoto} style={{ bottom: height * 0.03 }} className="items-center justify-center -mt-20">
              <Image
                source={require('../assets/images/capture_button.png')}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"/>
            </Pressable>
          <View className="items-center justify-center">
            {/* Analyze Button */}
            {image && (
              <Pressable
                onPress={analyzeImage}
                className="bg-[#6C4E31] rounded-lg w-48 h-14 items-center justify-center"
                disabled={loading}>
                <Text className="text-[#FFEEDB] text-lg font-bold text-center">{loading ? 'Analyzing...' : 'Analyze'}</Text>
              </Pressable>)}
          </View>
          </View>
        {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
      </ScrollView>
    </View>
  );
} 