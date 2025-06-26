const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const { resolver } = config;

config.resolver = {
	...resolver,
	assetExts: [...resolver.assetExts, "lottie"],
};

module.exports = withNativeWind(config, { input: "./global.css" });
