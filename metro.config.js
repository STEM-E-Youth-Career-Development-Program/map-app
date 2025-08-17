const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for react-native-reanimated
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Add any problematic modules here
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;