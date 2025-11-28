import React from "react";
import { View, Text, ScrollView, Image, Pressable, Dimensions, Alert, Modal, ActivityIndicator } from "react-native";
import { router, usePathname } from "expo-router";
import { getHairAnalysisHistory, HairAnalysis, clearAllData, getAnalysisRecordByImagePath } from "../lib/db";
import { Svg as SvgNS, Circle as CircleNS, G as GNS, Text as SvgText } from "react-native-svg";
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

type PredictionEntry = {
  label: string;
  value?: number;
  percentage?: string;
};

const ensureFileUri = (path?: string | null) => {
  if (!path) return null;
  return path.startsWith('file://') ? path : `file://${path}`;
};

const formatPercentageText = (prediction?: PredictionEntry): string => {
  if (!prediction) return '—';
  if (prediction.percentage && typeof prediction.percentage === 'string') {
    return prediction.percentage;
  }
  if (typeof prediction.value === 'number') {
    const value = prediction.value > 1 ? prediction.value : prediction.value * 100;
    return `${value.toFixed(2)}%`;
  }
  return '—';
};

const journal = () => {
  const pathname = usePathname();
  const [history, setHistory] = React.useState<HairAnalysis[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [resultModalVisible, setResultModalVisible] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<HairAnalysis | null>(null);
  const [modalLoading, setModalLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [modalPredictions, setModalPredictions] = React.useState<{
    hairType?: PredictionEntry[];
    hairDamage?: PredictionEntry[];
  } | null>(null);
  const sortedHairPredictions = React.useMemo(() => {
    if (modalPredictions?.hairType && modalPredictions.hairType.length > 0) {
      return [...modalPredictions.hairType].sort(
        (a, b) => (b.value ?? 0) - (a.value ?? 0)
      );
    }
    return null;
  }, [modalPredictions]);

  const sortedDamagePredictions = React.useMemo(() => {
    if (modalPredictions?.hairDamage && modalPredictions.hairDamage.length > 0) {
      return [...modalPredictions.hairDamage].sort(
        (a, b) => (b.value ?? 0) - (a.value ?? 0)
      );
    }
    return null;
  }, [modalPredictions]);

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

  const loadPredictionData = React.useCallback(async (entry: HairAnalysis) => {
    setModalLoading(true);
    setModalError(null);
    setModalPredictions(null);
    try {
      const record = await getAnalysisRecordByImagePath(entry.localImagePath ?? null);
      if (record?.predictionsJson) {
        const parsed = JSON.parse(record.predictionsJson);
        setModalPredictions({
          hairType: Array.isArray(parsed?.hairTypePredictions) ? parsed.hairTypePredictions : undefined,
          hairDamage: Array.isArray(parsed?.hairDamagePredictions) ? parsed.hairDamagePredictions : undefined,
        });
      } else {
        setModalPredictions(null);
      }
    } catch (e: any) {
      console.error('Failed to load aggregated results:', e);
      setModalError("We couldn't load the detailed results for this entry.");
    } finally {
      setModalLoading(false);
    }
  }, []);

  const handleViewResults = (entry: HairAnalysis) => {
    setSelectedEntry(entry);
    setResultModalVisible(true);
    loadPredictionData(entry);
  };

  const closeResultModal = () => {
    setResultModalVisible(false);
    setSelectedEntry(null);
    setModalPredictions(null);
    setModalError(null);
    setModalLoading(false);
  };

  const navigateToRoutine = (entry: HairAnalysis | null) => {
    if (!entry) return;
    router.push({
      pathname: '/PersonalizedRoutine',
      params: {
        hair_type: entry.hairType || '',
        scalp_condition: entry.scalpCondition || '',
        damage_level: entry.damageLevel || '',
        damage_type: entry.damageType || '',
      }
    });
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
              let dateStr: string;
              if (isNaN(date.getTime())) {
                dateStr = item.analysisDate;
              } else {
                // Format as "22 November 2025"
                const day = date.getDate();
                const month = date.toLocaleString('en-US', { month: 'long' });
                const year = date.getFullYear();
                dateStr = `${day} ${month} ${year}`;
              }
              const score = item.hairHealthScore ?? 0;
              const damagePercentage = 100 - score;
              return (
                <View key={item.id} className="mb-6">
                  {/* Date header with line and recommendations button */}
                  <View className="flex-row items-center mb-3">
                    <Text className="text-[#3F2305] text-lg font-bold">{dateStr}</Text>
                    <View className="flex-1 h-px bg-[#3F2305] ml-3" />
                    {item.hairType && item.scalpCondition && item.damageLevel && (
                      <Pressable
                        onPress={() => handleViewResults(item)}
                        className="bg-[#3F2305] px-3 py-1.5 rounded-lg ml-3"
                      >
                        <Text className="text-white text-xs font-semibold">View Results</Text>
                      </Pressable>
                    )}
                  </View>
                  {/* Content row */}
                  <View className="flex-row items-start">
                    {/* Text box */}
                    <View className="flex-1 bg-[#3F2305] rounded-xl p-4 mr-4">
                      <Text className="text-white text-sm leading-5">
                        Your hair is {Math.round(score)}% healthy and your remaining damage percentage is {Math.round(damagePercentage)}%. 
                        {item.damageLevel && item.damageLevel !== 'Healthy' ? (
                          ` This score reflects the presence of ${item.damageLevel.toLowerCase()} detected in your analysis.`
                        ) : (
                          ' This score reflects the health status of your hair.'
                        )}
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

      <Modal
        visible={resultModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeResultModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View
            className="w-full bg-[#FFF2E4] rounded-3xl p-5"
            style={{ maxHeight: height * 0.9 }}
          >
            <Pressable
              onPress={closeResultModal}
              className="absolute top-4 right-4 bg-[#3F2305] w-9 h-9 rounded-full items-center justify-center shadow-lg"
            >
              <Ionicons name="close" size={20} color="#FFF2E4" />
            </Pressable>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: height * 0.75 }}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <Text className="text-center text-2xl font-bold text-[#3F2305] mb-4 mt-2">
                Overall Results Snapshot
              </Text>
              {selectedEntry?.localImagePath ? (
                <View className="items-center mb-4">
                  <Image
                    source={{ uri: ensureFileUri(selectedEntry.localImagePath) || undefined }}
                    style={{
                      width: width * 0.6,
                      height: width * 0.6,
                      borderRadius: 16,
                    }}
                  />
                </View>
              ) : (
                <View className="bg-[#E8DCC8] rounded-2xl h-48 items-center justify-center mb-4">
                  <Text className="text-[#5B3E20] text-base font-semibold">
                    No photo available for this entry
                  </Text>
                </View>
              )}

              <View className="bg-[#F8EBDD] rounded-2xl p-4 mb-4">
                <Text className="text-xl font-bold text-[#3F2305] mb-2">Hair Type Results</Text>
                {modalLoading ? (
                  <View className="items-center py-6">
                    <ActivityIndicator color="#3F2305" />
                    <Text className="text-[#3F2305] mt-2">Loading detailed results...</Text>
                  </View>
                ) : sortedHairPredictions ? (
                  sortedHairPredictions.map((prediction, index) => {
                    const detectedType = selectedEntry?.hairType?.toLowerCase() ?? '';
                    const isDetected =
                      detectedType &&
                      prediction.label?.toLowerCase() === detectedType;
                    return (
                      <View
                        key={`${prediction.label}-${index}`}
                        className={`flex-row items-center justify-between px-4 py-3 mb-3 rounded-2xl ${
                          isDetected ? 'bg-[#3F2305]' : 'bg-white'
                        }`}
                      >
                        <View>
                          <Text
                            className={`text-base font-semibold ${
                              isDetected ? 'text-white' : 'text-[#3F2305]'
                            }`}
                          >
                            {prediction.label}
                            {isDetected ? ' ✓' : ''}
                          </Text>
                          <Text
                            className={`text-xs ${
                              isDetected ? 'text-white/80' : 'text-[#3F2305]/70'
                            }`}
                          >
                            {isDetected ? 'Detected Type' : 'Alternative'}
                          </Text>
                        </View>
                        <Text
                          className={`text-lg font-bold ${
                            isDetected ? 'text-white' : 'text-[#3F2305]'
                          }`}
                        >
                          {formatPercentageText(prediction)}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <View className="bg-white rounded-2xl px-4 py-3">
                    <Text className="text-[#3F2305] text-base">
                      Detected hair type:{" "}
                      <Text className="font-bold">
                        {selectedEntry?.hairType || 'Unavailable'}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              <View className="bg-[#F8EBDD] rounded-2xl p-4 mb-4">
                <Text className="text-xl font-bold text-[#3F2305] mb-2">Hair Damage Results</Text>
                {modalLoading ? (
                  <View className="items-center py-6">
                    <ActivityIndicator color="#3F2305" />
                  </View>
                ) : sortedDamagePredictions ? (
                  sortedDamagePredictions.map((prediction, index) => {
                    const damageReference =
                      (selectedEntry?.damageType || selectedEntry?.damageLevel || '').toLowerCase();
                    const label = prediction.label?.toLowerCase() ?? '';
                    const isDetected =
                      damageReference &&
                      (damageReference === label ||
                        damageReference.includes(label) ||
                        label.includes(damageReference));
                    return (
                      <View
                        key={`${prediction.label}-${index}`}
                        className={`flex-row items-center justify-between px-4 py-3 mb-3 rounded-2xl ${
                          isDetected ? 'bg-[#3F2305]' : 'bg-white'
                        }`}
                      >
                        <View className="flex-1 pr-3">
                          <Text
                            className={`text-base font-semibold ${
                              isDetected ? 'text-white' : 'text-[#3F2305]'
                            }`}
                          >
                            {prediction.label}
                            {isDetected ? ' ✓' : ''}
                          </Text>
                          <Text
                            className={`text-xs ${
                              isDetected ? 'text-white/80' : 'text-[#3F2305]/70'
                            }`}
                          >
                            {isDetected ? 'Detected Damage' : 'Alternative'}
                          </Text>
                        </View>
                        <Text
                          className={`text-lg font-bold ${
                            isDetected ? 'text-white' : 'text-[#3F2305]'
                          }`}
                        >
                          {formatPercentageText(prediction)}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <View className="bg-white rounded-2xl px-4 py-3">
                    <Text className="text-[#3F2305] text-base">
                      Detected damage:{" "}
                      <Text className="font-bold">
                        {selectedEntry?.damageLevel || selectedEntry?.damageType || 'Unavailable'}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              <View className="bg-[#3F2305] rounded-2xl p-4">
                <Text className="text-white text-base">
                  Hair Health Score:{" "}
                  <Text className="font-bold">
                    {selectedEntry ? `${Math.round(selectedEntry.hairHealthScore)}%` : '—'}
                  </Text>
                </Text>
                {modalError && (
                  <Text className="text-[#F9B5AB] text-xs mt-2">{modalError}</Text>
                )}
              </View>
            </ScrollView>

            <View className="flex-row justify-end mt-4 gap-3">
              <Pressable
                onPress={closeResultModal}
                className="px-4 py-2 rounded-full border border-[#3F2305]"
              >
                <Text className="text-[#3F2305] font-semibold">Close</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const entry = selectedEntry;
                  closeResultModal();
                  navigateToRoutine(entry);
                }}
                className="px-4 py-2 rounded-full bg-[#3F2305]"
                disabled={!selectedEntry}
              >
                <Text className="text-white font-semibold">View Personalized Routine</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
};

export default journal; 