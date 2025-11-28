const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure ONNX models, TensorFlow.js files, and external data are bundled as assets
config.resolver = config.resolver || {};
config.resolver.assetExts = config.resolver.assetExts || [];

// Add all necessary asset extensions
const requiredExtensions = ['bin', 'onnx', 'data'];
for (const ext of requiredExtensions) {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
}

// Configure for large assets
config.transformer = {
  ...config.transformer,
  // Increase the asset size limit to handle large ONNX files (100MB limit)
  assetPlugins: [],
  // Don't inline large assets
  publicPath: '/assets',
  // Increase max file size for assets
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

// Increase max file size for Metro bundler (100MB)
config.maxWorkers = 2;
config.resetCache = false;

// Increase timeouts and limits for large file processing
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Connection', 'keep-alive');
      res.setTimeout(300000); // 5 minutes timeout
      return middleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, { input: './global.css' });