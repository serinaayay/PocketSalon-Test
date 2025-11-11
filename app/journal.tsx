import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, Alert } from "react-native";
import { router } from "expo-router";
import { getHairAnalysisHistory, HairAnalysis, clearAllData } from "../lib/db";
import { Svg as SvgNS, Circle as CircleNS, G as GNS, Text as SvgText } from "react-native-svg";
const { width, height } = Dimensions.get('window');

const journal = () => {
  const [history, setHistory] = React.useState<HairAnalysis[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

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

  const loadHistory = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getHairAnalysisHistory();
      setHistory(rows);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all hair health scores and journal entries? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              await loadHistory(); // Refresh the history
              Alert.alert("Success", "All data has been cleared.");
            } catch (e: any) {
              Alert.alert("Error", `Failed to clear data: ${e?.message ?? e}`);
            }
          }
        }
      ]
    );
  };


  return (
    <View className="flex-1 bg-[#FFF2E4]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100, minHeight: height }}>
        <View className="flex-row items-center justify-between px-4 mt-20 mb-4">
          <Text className="text-[35px] font-extrabold text-[#3F2305] flex-1 text-center">Hair Health Journey</Text>
          </View>

          {history.length > 0 && (
            <Pressable
              onPress={handleClearAll}
              className="bg-[#E53935] px-4 py-2 rounded-xl w-24 self-end mr-6 mb-4">
                

              <Text className="text-white font-bold text-sm">Clear All</Text>
            </Pressable>
          )}
        {loading ? (
          <Text className="text-center text-[#3F2305]">Loading...</Text>
        ) : error ? (
          <Text className="text-center text-red-700">{error}</Text>
        ) : history.length === 0 ? (
          <Text className="text-center text-[#3F2305]">No analyses yet. Run a hair analysis to get started.</Text>
        ) : (
          <View className="px-4">
            {history.map((item) => {
              const date = new Date(item.analysisDate);
              const dateStr = isNaN(date.getTime()) ? item.analysisDate : date.toLocaleDateString();
              const score = item.hairHealthScore ?? 0;
              const damagePercentage = 100 - score;
              return (
                <View key={item.id} className="mb-6">
                  {/* Date header with line and recommendations button */}
                  <View className="flex-row items-center mb-3">
                    <Text className="text-[#3F2305] text-lg font-bold">Hair Health as of {dateStr}</Text>
                    <View className="flex-1 h-px bg-[#3F2305] ml-3" />
                    {item.recommendations && item.hairType && item.scalpCondition && item.damageLevel && (
                      <Pressable
                        onPress={() => router.push({
                          pathname: '/PersonalizedRoutine',
                          params: {
                            hair_type: item.hairType || '',
                            scalp_condition: item.scalpCondition || '',
                            damage_level: item.damageLevel || '',
                            damage_type: item.damageType || '',
                          }
                        })}
                        className="bg-[#3F2305] px-3 py-1.5 rounded-lg ml-3"
                      >
                        <Text className="text-white text-xs font-semibold">View Recommendations</Text>
                      </Pressable>
                    )}
                  </View>
                  {/* Content row */}
                  <View className="flex-row items-start">
                    {/* Text box */}
                    <View className="flex-1 bg-[#3F2305] rounded-xl p-4 mr-4">
                      <Text className="text-white text-sm leading-5">
                        Your hair is {Math.round(score)}% healthy and your remaining damage percentage is {Math.round(damagePercentage)}%. This score reflects the presence of hair damage detected in your analysis.
                      </Text>
                    </View>
                    {/* Circular progress */}
                    <CircularProgress percentage={score} size={width * 0.35} strokeWidth={18} />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
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
                <View className="flex-col items-center">
                    <Pressable className="2 justify-center"
                    onPress={() => router.push('/favorites')}>
                    <Image
                        source={require('../assets/images/heart (1).png')}
                        className="w-9 h-9"/>
                    </Pressable>
                </View>
            </View>
      </View>
    </View>
  );
};

export default journal; 