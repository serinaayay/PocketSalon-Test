import AsyncStorage from '@react-native-async-storage/async-storage';

const RESPONDENT_CODE_KEY = 'respondent_code_v1';

export async function getOrCreateRespondentCode(): Promise<string> {
  const existing = await AsyncStorage.getItem(RESPONDENT_CODE_KEY);
  if (existing) return existing;
  const code = `U${Date.now().toString().slice(-8)}`;
  await AsyncStorage.setItem(RESPONDENT_CODE_KEY, code);
  return code;
}


