import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, View, Platform } from "react-native";
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { Asset } from 'expo-asset';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { decode as atob } from 'base-64';

const { width, height } = Dimensions.get('window');
const frameSize = Math.min(width * 0.9, 350); // Responsive frame size

export default function HairDetectionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tfReady, setTfReady] = useState(false);

  useEffect(() => {
    // Initialize TensorFlow.js
    const initTf = async () => {
      await tf.ready();
      setTfReady(true);
    };
    initTf();
  }, []);

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
    try {
      // Load ONNX model
      const modelAsset = Asset.fromModule(require('../assets/models/hair_type/hair_type_model.onnx'));
      await modelAsset.downloadAsync();
      
      if (!modelAsset.localUri) {
        throw new Error('Failed to load model');
      }

      const session = await InferenceSession.create(modelAsset.localUri);

      // Read image and preprocess
      const base64 = await FileSystem.readAsStringAsync(image, { 
        encoding: FileSystem.EncodingType.Base64 
      });
      const rawBytes = Uint8Array.from(atob(base64), (c: string) => c.charCodeAt(0));
      
      // Decode JPEG and convert to normalized tensor data
      const inputData = await preprocessImage(rawBytes);
      
      // Create tensor
      const inputTensor = new Tensor('float32', inputData, [1, 3, 224, 224]);
      
      // Run inference
      const outputs = await session.run({ input: inputTensor });
      const logits = outputs.output.data as Float32Array;

      // Apply softmax
      const probs = softmax(logits);
      const maxProb = Math.max(...probs);
      const predictedIndex = probs.indexOf(maxProb);
      const labels = ['Straight', 'Wavy', 'Curly', 'Kinky'];
      const hairType = labels[predictedIndex] || 'Unknown';
      
      router.push({ pathname: '/ResultsScreen', params: { hair_type: hairType, confidence: String(maxProb) } });
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze image. Please try again.');
    }
    setLoading(false);
  };

  // Helper function to convert image to tensor
  const preprocessImage = async (jpegBytes: Uint8Array): Promise<Float32Array> => {
    // Decode JPEG to tensor using TF.js
    const imageTensor = decodeJpeg(jpegBytes);
    
    // Resize to 224x224 using TF.js
    let resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    resized = resized.div(255.0); // Normalize to [0, 1]
    
    // Get pixel data as array [224, 224, 3] (HWC format)
    const pixelData = await resized.data();
    
    // Convert to NCHW format and apply ImageNet normalization
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];
    
    const float32Data = new Float32Array(1 * 3 * 224 * 224);
    let idx = 0;
    
    // Convert from HWC to NCHW format
    for (let c = 0; c < 3; c++) {
      for (let h = 0; h < 224; h++) {
        for (let w = 0; w < 224; w++) {
          const pixelIdx = (h * 224 + w) * 3 + c;
          const pixelValue = pixelData[pixelIdx];
          float32Data[idx++] = (pixelValue - mean[c]) / std[c];
        }
      }
    }
    
    // Cleanup
    imageTensor.dispose();
    resized.dispose();
    
    return float32Data;
  };

  const softmax = (logits: Float32Array): number[] => {
    const maxLogit = Math.max(...Array.from(logits));
    const expScores = Array.from(logits).map(l => Math.exp(l - maxLogit));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    return expScores.map(e => e / sumExp);
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