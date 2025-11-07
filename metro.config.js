const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure ONNX models and TensorFlow.js files are bundled as assets
config.resolver = config.resolver || {};
config.resolver.assetExts = config.resolver.assetExts || [];
if (!config.resolver.assetExts.includes('bin')) {
  config.resolver.assetExts.push('bin');
}
if (!config.resolver.assetExts.includes('onnx')) {
  config.resolver.assetExts.push('onnx');
}
// Add .data extension for ONNX model data files
if (!config.resolver.assetExts.includes('data')) {
  config.resolver.assetExts.push('data');
}

module.exports = withNativeWind(config, { input: './global.css' });