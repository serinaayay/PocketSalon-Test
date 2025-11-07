import { useState } from 'react';
import { Pressable, Image, View, Text, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function TestImagePicker() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      
      // Navigate back to hair detection with the selected image
      setTimeout(() => {
        router.push({
          pathname: '/hair-detection',
          params: { selectedImage: selectedUri }
        });
      }, 500); // Small delay to show the image was selected
    }
  };

  // Auto-trigger picker when page loads
  useState(() => {
    pickImage();
  });

  return (
    <View className="flex-1 bg-[#FFF2E4] items-center justify-center">
      {/* Back button */}
      <Pressable 
        onPress={() => router.back()} 
        className="absolute top-12 left-7 z-10">
        <Image
          source={require('../assets/images/arrow.png')}
          style={{ width: width * 0.07, height: height * 0.04 }}
          resizeMode="contain"
        />
      </Pressable>

      <Text className="text-[#3F2305] text-3xl font-bold mb-8">
        Select Image
      </Text>

      {/* Pick Image Button */}
      <Pressable 
        onPress={pickImage}
        className="bg-[#3F2305] px-8 py-4 rounded-xl mb-8">
        <Text className="text-[#FAF7F0] text-xl font-bold">
          Pick an image from gallery
        </Text>
      </Pressable>

      {/* Display selected image */}
      {image && (
        <View className="items-center">
          <Text className="text-[#3F2305] text-lg mb-4">Selected Image:</Text>
          <Image 
            source={{ uri: image }} 
            style={{ 
              width: width * 0.8, 
              height: width * 0.8,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
          <Text className="text-[#5B3E20] text-sm mt-4 text-center px-4">
            Returning to Hair Detection...
          </Text>
        </View>
      )}

      {!image && (
        <Text className="text-[#5B3E20] text-base italic">
          Tap the button to select an image
        </Text>
      )}
    </View>
  );
}

