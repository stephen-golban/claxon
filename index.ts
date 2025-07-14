// Import side effects first and services
import "./global.css";

// Initialize services

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

// Register app entry through Expo Router
import "expo-router/entry";
