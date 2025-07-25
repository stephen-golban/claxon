import * as Device from 'expo-device';
import * as Notifications from "expo-notifications";
import { Platform } from 'react-native';
import { printError } from "@/lib/utils";
import { supabase } from "../api/client";

/**
 * Push notification service for handling Expo push tokens
 */
export class PushNotificationService {
  /**
   * Requests push notification permissions from the user
   * @returns Permission status
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === "granted";
    } catch (error) {
      printError("push-notifications-permissions-error", error as Error);
      return false;
    }
  }

  /**
   * Gets the Expo push token for the current device
   * @returns The push token or null if not available
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      // Check if running on physical device
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices, not simulators');
        return null;
      }

      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        console.log("Push notification permissions not granted");
        return null;
      }

      // For Android, set up notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'bmpzdawnsopcgbwqxsfe', // Your Supabase project ID
      });

      console.log('Push token generated successfully:', token.data);
      return token.data;
    } catch (error) {
      printError("push-notifications-token-error", error as Error);
      
      // More specific error logging
      if (error instanceof Error) {
        console.log('Push token error details:', error.message);
        
        if (error.message.includes('ERR_UNEXPECTED')) {
          console.log('ERR_UNEXPECTED - this usually means:');
          console.log('1. Running on simulator (use physical device)');
          console.log('2. Project not properly configured for push notifications');
          console.log('3. Need to run "expo prebuild" or "eas build" for development build');
        }
      }
      
      return null;
    }
  }

  /**
   * Stores the Expo push token in the user's account
   * @param userId The user's account ID
   * @returns Success status
   */
  async storePushToken(userId: string): Promise<boolean> {
    try {
      const token = await this.getExpoPushToken();
      if (!token) {
        console.log("No push token available to store");
        return false;
      }

      const { error } = await supabase.from("accounts").update({ expo_push_token: token }).eq("id", userId);

      if (error) {
        printError("push-notifications-store-error", error);
        return false;
      }

      console.log("Push token stored successfully for user:", userId);
      return true;
    } catch (error) {
      printError("push-notifications-store-error", error as Error);
      return false;
    }
  }

  /**
   * Removes the push token from the user's account (e.g., on logout)
   * @param userId The user's account ID
   */
  async removePushToken(userId: string): Promise<void> {
    try {
      const { error } = await supabase.from("accounts").update({ expo_push_token: null }).eq("id", userId);

      if (error) {
        printError("push-notifications-remove-error", error);
      } else {
        console.log("Push token removed for user:", userId);
      }
    } catch (error) {
      printError("push-notifications-remove-error", error as Error);
    }
  }

  /**
   * Updates the push token for the current user (useful for token refresh)
   * @param userId The user's account ID
   */
  async refreshPushToken(userId: string): Promise<void> {
    await this.storePushToken(userId);
  }
}

export const pushNotificationService = new PushNotificationService();

/**
 * Hook for managing push notifications in React components
 */
export const usePushNotifications = () => {
  const registerPushToken = async (userId: string) => {
    return await pushNotificationService.storePushToken(userId);
  };

  const removePushToken = async (userId: string) => {
    await pushNotificationService.removePushToken(userId);
  };

  const refreshPushToken = async (userId: string) => {
    await pushNotificationService.refreshPushToken(userId);
  };

  return {
    registerPushToken,
    removePushToken,
    refreshPushToken,
  };
};
