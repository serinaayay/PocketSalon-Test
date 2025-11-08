import { Platform } from 'react-native';
import type { DeviceInfo } from './firebaseService';

// Lazy import to handle missing native module gracefully
let Device: any = null;
let Application: any = null;

async function loadDeviceModules() {
  if (Device === null) {
    try {
      Device = require('expo-device');
      Application = require('expo-application');
    } catch (error) {
      console.warn('⚠️ expo-device module not available. Using fallback device info.');
      Device = null;
      Application = null;
    }
  }
  return { Device, Application };
}

/**
 * Get comprehensive device information
 * Includes model, manufacturer, OS version, RAM, CPU architecture, etc.
 * @returns DeviceInfo object with device specifications
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
  try {
    const { Device: DeviceModule } = await loadDeviceModules();
    
    // If module is not available, return fallback
    if (!DeviceModule) {
      return getFallbackDeviceInfo();
    }

    const deviceInfo: DeviceInfo = {
      model: DeviceModule.modelName || DeviceModule.deviceName || 'Unknown',
      manufacturer: DeviceModule.manufacturer || 'Unknown',
      brand: DeviceModule.brand || 'Unknown',
      osVersion: `${Platform.OS} ${DeviceModule.osVersion || 'Unknown'}`,
      totalMemory: DeviceModule.totalMemory ? Math.round(DeviceModule.totalMemory / (1024 * 1024)) : undefined, // Convert bytes to MB
      cpuArchitecture: await getCpuArchitecture(DeviceModule),
      deviceYearClass: DeviceModule.deviceYearClass || undefined,
    };

    console.log('📱 Device Info Collected:', deviceInfo);
    return deviceInfo;
  } catch (error) {
    console.error('Error getting device info:', error);
    // Return fallback device info
    return getFallbackDeviceInfo();
  }
}

/**
 * Get fallback device info when native module is not available
 */
function getFallbackDeviceInfo(): DeviceInfo {
  return {
    model: 'Unknown',
    manufacturer: 'Unknown',
    brand: 'Unknown',
    osVersion: `${Platform.OS} Unknown`,
    totalMemory: 0,
    cpuArchitecture: 'Unknown',
    deviceYearClass: 0,
  };
}

/**
 * Get CPU architecture information
 * Note: This is limited on React Native, returns best available info
 */
async function getCpuArchitecture(DeviceModule: any): Promise<string> {
  try {
    if (!DeviceModule) {
      return 'Unknown';
    }
    
    if (Platform.OS === 'android') {
      // On Android, we can get some info from the device
      try {
        const supportedAbis = await DeviceModule.supportedCpuArchitecturesAsync();
        if (supportedAbis && supportedAbis.length > 0) {
          return supportedAbis.join(', ');
        }
      } catch (error) {
        console.warn('Could not get CPU architecture:', error);
      }
    }
    // iOS or fallback
    return Platform.OS === 'ios' ? 'ARM64' : 'Unknown';
  } catch (error) {
    console.error('Error getting CPU architecture:', error);
    return 'Unknown';
  }
}

/**
 * Log device specifications to console
 * Useful for debugging and verification
 */
export async function logDeviceSpecs(): Promise<void> {
  const info = await getDeviceInfo();
  console.log('=== DEVICE SPECIFICATIONS ===');
  console.log(`Model: ${info.model}`);
  console.log(`Manufacturer: ${info.manufacturer}`);
  console.log(`Brand: ${info.brand}`);
  console.log(`OS Version: ${info.osVersion}`);
  console.log(`Total RAM: ${info.totalMemory ? `${info.totalMemory} MB` : 'Unknown'}`);
  console.log(`CPU Architecture: ${info.cpuArchitecture}`);
  console.log(`Device Year Class: ${info.deviceYearClass || 'Unknown'}`);
  console.log('============================');
}

