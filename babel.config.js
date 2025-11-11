module.exports = (api) => {
    api.cache(true);
    
    // Safely load plugins - filter out any that fail to resolve during build
    const plugins = [
        // Required for expo-router
        "@babel/plugin-proposal-export-namespace-from",
        "react-native-reanimated/plugin",
    ].filter(Boolean);
    
    return {
        presets: [
            [
                "babel-preset-expo",
                {
                    jsxImportSource: "nativewind",
                },
            ],
            "nativewind/babel",
        ],
        plugins,
    };
};