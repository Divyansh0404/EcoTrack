import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "EcoTrack",
  slug: "ecotrack",
  scheme: "ecotrack", // required for linking
  version: "1.0.0",
  orientation: "portrait",
  platforms: ["ios", "android"],
  extra: {
    // Custom fields can be added here
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourname.ecotrack", // customize this!
    newArchEnabled: true, // Explicitly enabling new architecture for iOS
  },
  android: {
    package: "com.yourname.ecotrack", // customize this!
  },
  experiments: {
    // @ts-ignore
    newArchEnabled: true, // Enabling new architecture (optional)
  },
});
