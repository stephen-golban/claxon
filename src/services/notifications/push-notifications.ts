import Constants from 'expo-constants';
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
   * Handle registration errors
   */
  private handleRegistrationError(errorMessage: string): void {
    console.error('Push notification registration error:', errorMessage);
    printError("push-notifications-registration-error", new Error(errorMessage));
  }

  /**
   * Register for push notifications following Expo official docs pattern
   * @returns The push token string or null if registration fails
   */
  async registerForPushNotificationsAsync(): Promise<string | null> {
    // Set up Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Check if running on physical device
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        this.handleRegistrationError('Permission not granted to get push token for push notification!');
        return null;
      }
      
      // Get project ID from expo config
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      
      if (!projectId) {
        this.handleRegistrationError('Project ID not found');
        return null;
      }
      
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        
        console.log('Push token generated:', pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        this.handleRegistrationError(`${e}`);
        return null;
      }
    } else {
      this.handleRegistrationError('Must use physical device for push notifications');
      return null;
    }
  }

  /**
   * Gets the Expo push token for the current device (wrapper for registerForPushNotificationsAsync)
   * @returns The push token or null if not available
   */
  async getExpoPushToken(): Promise<string | null> {
    return await this.registerForPushNotificationsAsync();
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
