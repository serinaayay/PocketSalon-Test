import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, Dimensions, Image, Pressable, ScrollView, Text, View, Modal,} from "react-native";
import { analyzeHair } from "../lib/onnx-helpers-native";
import { getOrCreateRespondentCode } from "../lib/respondent";
import { saveAnalysisRecord, saveAnalysisToLocalDB } from "../lib/db";
import { trySyncPendingAnalyses } from "../lib/sync";
import { ScalpCondition } from "../lib/hairRoutines";
import { uploadHairScan } from "../lib/firebaseService";
import { getDeviceInfo } from "../lib/deviceInfo";
import { Octicons } from '@expo/vector-icons';
import { BackHandler } from "react-native";

const { width, height } = Dimensions.get('window');
const frameSize = Math.min(width * 0.9, 350); 

export default function HairDetectionPage() {
  const params = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false); // First modal: Choose Capture or Upload
  const [modalVisible, setModalVisible] = useState(false); // Second modal: Scalp condition
  const [scalpCondition, setScalpCondition] = useState<ScalpCondition>('Normal Scalp');
  const [showScalpModal, setShowScalpModal] = useState(false);
  const [showCropDisclaimer, setShowCropDisclaimer] = React.useState(true)
  const [showScalpGuide, setShowScalpGuide] = React.useState(false);
  

  // Check if an image was selected from the test-image-picker page
  useEffect(() => {
    if (params.selectedImage) {
      setImage(params.selectedImage as string);
      setError(null);
      setShowImageSourceModal(false); // Hide image source modal
      setShowCropDisclaimer(false);
      setModalVisible(true); // Show scalp condition modal
      console.log('Received image from picker:', params.selectedImage);
    }
  }, [params.selectedImage]);

  // Handle Android back button to close modals first
    useEffect(() => {
      const handler = () => {
        if (modalVisible) {
          return true; 
        }
        return false; 
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress",
        handler
      );

      return () => subscription.remove();
    }, [modalVisible]);



  const handleCaptureOption = async () => {
    setShowImageSourceModal(false);
    // Use camera directly
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setShowCropDisclaimer(false);
      setModalVisible(true);
    }
  };

  const handleUploadOption = () => {
    setShowImageSourceModal(false);
    // Navigate to upload page
    router.push('/test-image-picker');
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    
    try {
      // Prepare storage paths
      const code = await getOrCreateRespondentCode();
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const imagesDir = FileSystem.documentDirectory + 'images/';
      const resultsDir = FileSystem.documentDirectory + 'results/';
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true }).catch(() => {});
      await FileSystem.makeDirectoryAsync(resultsDir, { intermediates: true }).catch(() => {});

      const targetImagePath = imagesDir + `img_${code}_${ts}.jpg`;
      // Move/copy captured asset to our managed path
      await FileSystem.copyAsync({ from: image, to: targetImagePath });

      // Run local on-device inference using ONNX models
      const result = await analyzeHair(targetImagePath);
      
      // Navigate to results with both hair type and damage analysis
      router.push({
        pathname: '/ResultsScreen',
        params: {
          hair_type: result.hairType.type,
          hair_confidence: result.hairType.confidence.toString(),
          damage_level: result.hairDamage.level,
          damage_confidence: result.hairDamage.confidence.toString(),
          scalp_condition: scalpCondition,
        },
      });

      // Create recommendations text based on damage level (simple rules)
      const recommendations = result.hairDamage.level === 'Severe Damage'
        ? 'Seek deep conditioning treatments, reduce heat and chemical exposure.'
        : result.hairDamage.level === 'Moderate Damage'
        ? 'Use moisturizing shampoo and weekly masks; limit heat exposure.'
        : result.hairDamage.level === 'Light Damage'
        ? 'Maintain hydration and gentle handling.'
        : 'Keep a balanced routine and regular trims.';

      // Consolidated JSON content
      const consolidated = {
        respondentCode: code,
        timestamp: new Date().toISOString(),
        modelPredictions: result.predictions,
        recommendations,
        deviceInfo: {
          model: 'unknown', cpu: 'unknown', gpu: 'unknown', ram: 'unknown', cameraMP: 'unknown'
        },
        modelLoadingTime: result.modelLoadingTimeMs,
        inferenceTime: result.inferenceTimeMs,
      };

      const resultPath = resultsDir + `result_${code}_${ts}.json`;
      await FileSystem.writeAsStringAsync(resultPath, JSON.stringify(consolidated, null, 2));

      // Save record to SQLite for offline history + sync
      await saveAnalysisRecord({
        respondentCode: code,
        imagePath: targetImagePath,
        resultPath,
        timestamp: consolidated.timestamp,
        modelLoadingTimeMs: result.modelLoadingTimeMs,
        inferenceTimeMs: result.inferenceTimeMs,
        predictionsJson: JSON.stringify(result.predictions),
        recommendations,
        deviceInfoJson: JSON.stringify(consolidated.deviceInfo),
        synced: false,
      });

      // Also save to hair_analyses table for journal display
      await saveAnalysisToLocalDB({
        hairHealthScore: result.hairHealth.score,
        analysisDate: consolidated.timestamp,
        localImagePath: targetImagePath,
        recommendations,
        hairType: result.hairType.type,
        scalpCondition: scalpCondition,
        damageLevel: result.hairDamage.level,
      });

      // Upload to Firebase (image + metadata + device info + results)
      try {
        const timestamp = new Date();
        const damageScore = 100 - result.hairHealth.score; // Convert health score to damage score
        
        // Get device information
        const deviceInfo = await getDeviceInfo();
        
        // Update consolidated data with actual device info
        consolidated.deviceInfo = {
          model: deviceInfo.model,
          cpu: deviceInfo.cpuArchitecture || 'Unknown',
          gpu: 'Unknown', // GPU info not available via expo-device
          ram: deviceInfo.totalMemory ? `${(deviceInfo.totalMemory / 1024).toFixed(1)} GB` : 'Unknown',
          cameraMP: 'Unknown', // Camera MP not available via expo-device
        };
        
        // Prepare results JSON for upload
        const resultsJson = JSON.stringify(consolidated, null, 2);
        
        // Upload with all metadata, results, and device info
        const uploadResult = await uploadHairScan(
          targetImagePath,
          result.hairType.type,
          result.hairDamage.level,
          damageScore,
          result.modelLoadingTimeMs, // Loading time
          result.inferenceTimeMs,    // Inference time
          deviceInfo,                // Device specs (model, RAM, CPU, GPU, etc.)
          resultsJson,               // Complete results JSON
          timestamp
        );
        
        console.log('✅ Successfully uploaded to Firebase!');
        console.log('📊 Firebase Document ID:', uploadResult.docId);
        console.log('🖼️  Image URL:', uploadResult.imageUrl);
        if (uploadResult.resultsUrl) {
          console.log('📄 Results JSON URL:', uploadResult.resultsUrl);
        }
        if (uploadResult.deviceInfoUrl) {
          console.log('📱 Device Info JSON URL:', uploadResult.deviceInfoUrl);
        }
      } catch (firebaseError) {
        console.error('⚠️ Firebase upload failed (continuing anyway):', firebaseError);
        // Don't block the user flow if Firebase upload fails
      }

      // Attempt background sync (will no-op if no URL configured/offline)
      try { await trySyncPendingAnalyses(); } catch {}
    } catch (e) {
      console.error('Analysis error:', e);
      setError(`Failed to analyze image: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
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
          <Text className="text-[#FAF7F0] text-4xl font-bold text-center -mt-28">Hair Type and {'\n'} Damage Detector</Text>

          {/* to center text */}
          <View className="absolute items-center justify-center mt-16 px-10">
          <Text className="text-[#FAF7F0] text-lg text-wrap-pretty w-96 mt-20 text-center mb-5 ">Take a picture or upload an image of your hair and we’ll identify your hair type!</Text>
          <Text className="text-[#FAF7F0] text-s italic text-wrap-pretty w-96 mt-3 text-center">Disclaimer: This application is experimental. Consult an expert.</Text>
          </View>
        </View>

        <Modal
          visible={showCropDisclaimer}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowCropDisclaimer(false)}>

          <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)" 
            }}>
          <View className="w-96 bg-[#3F2305] rounded-2xl px-5 py-4 mb-4">
            <Text className="text-[#FAF7F0] font-extrabold text-xl text-center">
              Cropping Guidelines:
            </Text>

            <Text className="text-[#FAF7F0] font-normal text-lg text-center">
               1. Please make sure to crop the image to focus on your hair only.{'\n'}
               2. Keep the frame free of unnecessary background elements. {'\n'}
               3. Ensure good lighting for better analysis results.
            </Text>
          </View>
        
          <Pressable
            onPress={() => {
              setShowCropDisclaimer(false);
              setShowImageSourceModal(true); 
            }}
            className="bg-[#F2EAD3] px-5 py-2 rounded-xl">
            
            <Text className="text-[#3F2305] font-semibold">OK</Text>
          </Pressable>

          </View>
        </Modal>
                
        {/* First Modal: Choose Capture or Upload */}
        <Modal 
          visible={showImageSourceModal} 
          animationType="fade" 
          transparent={true} 
          onRequestClose={() => 
            setShowImageSourceModal(false)}
            >
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)" 
            }}>
          

          <View style={{backgroundColor: '#FFF2E4', width: 340, height: 300, alignSelf: "center", borderRadius: 10, paddingTop: 40}}>
            <Text className="text-2xl text-center font-bold mb-8">How would you like to add your image?</Text>
            

            <Pressable 
              className="bg-[#3F2305] py-4 px-6 rounded-xl w-60 self-center items-center mb-4"
              onPress={handleCaptureOption}>
              <Text className="text-[#FAF7F0] text-xl font-bold">Capture Photo</Text>
            </Pressable>

            <Pressable 
              className="bg-[#3F2305] py-4 px-6 rounded-xl w-60 self-center items-center mb-4"
              onPress={handleUploadOption}>
              <Text className="text-[#FAF7F0] text-xl font-bold"> Upload Image</Text>
            </Pressable>
          </View>
          </View>
        </Modal>
      
      <Modal
        visible={showScalpGuide}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
            setShowScalpGuide(false); 
          }}>

          <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)" 
            }}>
          <View className="w-96 bg-[#3F2305] rounded-2xl px-5 py-4 mb-4">

            <Text className="text-[#FAF7F0] font-extrabold text-2xl text-center">
              How to identify your scalp condition:
            </Text>

            <Text className="text-[#FAF7F0] font-extrabold text-xl text-center">
                {'\n'} Oily Scalp: <Text className="text-[#FAF7F0] font-normal text-lg text-center">
                 Hair appears greasy or shiny shortly after washing. {'\n'}</Text>

                {'\n'} Dry Scalp: <Text className="text-[#FAF7F0] font-normal text-lg text-center">
                 Hair feels itchy and tight; Small white flakes on the scalp and/or shoulders is present.{'\n'} </Text>

                {'\n'} Dandruff: <Text className="text-[#FAF7F0] font-normal text-lg text-center">
                 Visible white or yellow big flakes on the scalp and in the hair, accompanied by an itchy scalp.{'\n'}</Text>

                {'\n'} Normal Scalp: <Text className="text-[#FAF7F0] font-normal text-lg text-center">
                 Hair looks healthy and shiny, not too oily nor too dry; No significant flaking or itching.{'\n'}</Text>
            </Text>


          </View>
        
          <Pressable
            onPress={() => {
              setShowScalpGuide(false);
              setModalVisible(true); 
            }}
            className="bg-[#F2EAD3] px-5 py-2 rounded-xl">
            
            <Text className="text-[#3F2305] font-semibold">I understand</Text>
          </Pressable>

          </View>
        </Modal>

        {/* Third Modal: Scalp Condition */}
        {modalVisible && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",  // transparent still allowed
              justifyContent: "center",
              alignItems: "center",
              elevation: 999,
              zIndex: 999,
            }}
          >

          <View style={{backgroundColor: '#FFF2E4', width: 340, height: 420, alignSelf: "center", borderRadius: 10, paddingTop: 40, position: 'relative'}}>

            <Pressable
                onPress={() =>{
                  setModalVisible(false);
                  setShowScalpGuide(true); 
                }}

              style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center' }}>
            
              <Text className="text-[#3F2305] font-normal italic text-sm mr-2">Scalp Condition Guide</Text>

              <Octicons
                name="question"
                size={22}
                color="#3F2305" />
              

            </Pressable>
            <Text className="text-2xl text-center font-bold mt-1"> What is your Scalp Condition?</Text>
            <Pressable 
                className="bg-[#3F2305] py-2 px-4 rounded-xl w-64 self-center items-center justify-center mt-5 mb-3 flex-row"
                onPress={() => {
                  setScalpCondition('Oily Scalp');
                  setModalVisible(false); }}>

                <Image
                  source={require('../assets/images/oily scalp.png')}
                  style={{ width: 30, height: 30, marginRight: 8 }}
                  resizeMode="contain"/>

                <Text className="text-[#FAF7F0] text-xl font-bold">Oily</Text>
              </Pressable>

            <Pressable 
              className="bg-[#3F2305] py-2 px-4 rounded-xl w-64 self-center items-center justify-center mb-3 flex-row"
              onPress={() => {
                setScalpCondition('Dry Scalp');
                setModalVisible(false);
              }}>

                <Image
                  source={require('../assets/images/dry scalp.png')}
                  style={{ width: 30, height: 30, marginRight: 8 }}
                  resizeMode="contain"/>

              <Text className="text-[#FAF7F0] text-xl font-bold">Dry</Text>
            </Pressable>

            <Pressable 
              className="bg-[#3F2305] py-2 px-4 rounded-xl w-64 self-center items-center justify-center mb-3 flex-row"
              onPress={() => {
                setScalpCondition('Dandruff');
                setModalVisible(false);
              }}>
                <Image
                  source={require('../assets/images/dandruff.png')}
                  style={{ width: 30, height: 30, marginRight: 8 }}
                  resizeMode="contain"/>

              <Text className="text-[#FAF7F0] text-xl font-bold">Dandruff</Text>
            </Pressable>

            <Pressable 
              className="bg-[#3F2305] py-2 px-4 rounded-xl w-65 self-center items-center justify-center mb-12 flex-row"
              onPress={() => {
                setScalpCondition('Normal Scalp');
                setModalVisible(false);
              }}>
                <Image
                  source={require('../assets/images/normal scalp.png')}
                  style={{ width: 30, height: 30, marginRight: 8 }}
                  resizeMode="contain"/>

              <Text className="text-[#FAF7F0] text-xl font-bold">Normal/I don't know</Text>
            </Pressable>
            
          {/* Cancel button */}
          <Pressable 
            className="bg-[#A72703] py-2 px-4 rounded-xl w-60 self-center items-center"
            onPress={() => {setModalVisible(false)
              router.back()
            }}>

            <Text className="text-[#FAF7F0] text-xl font-bold">Cancel</Text>
          </Pressable>
          </View>
          </View>
    )}


        
{/* Image Frame */}
<Pressable
  onPress={() => {
    setImage(null); 
    setShowImageSourceModal(true); 
  }}
  style={{
    width: frameSize,
    height: frameSize,
    zIndex: 1,
    marginTop: -frameSize / 5,
  }}
  className="relative rounded-xl overflow-hidden items-center justify-center bg-[#DFD7BF] top-16 shadow-lg">

  {image ? (
    <Image
      source={{ uri: image }}
      style={{ width: frameSize, height: frameSize }}
      resizeMode="cover"
    />
  ) : (
    
    <View className="flex-1 w-full h-full items-center justify-center">
      <Text className="text-xl text-black">No Image</Text>
    </View>
  )}
</Pressable>


        {/* Upload and Capture Buttons */}
         <View style={{ width: frameSize, minHeight: 100, zIndex: 10 }} className="mt-28 mb-6">
          <View className="items-center justify-center">
            {/* Analyze Button */}
            {image && (
              <Pressable
                onPress={analyzeImage}
                className="bg-[#3F2305] rounded-lg w-48 h-14 items-center justify-center"
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