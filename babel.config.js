// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // env vars
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        // ✅ use modern option names in v3: allowlist/blocklist
        allowlist: null,
        blocklist: null,
        safe: false,
        allowUndefined: true,
      }],
      // keep LAST if you use Reanimated (common in Expo projects)
      'react-native-reanimated/plugin',
    ],
  };
};
