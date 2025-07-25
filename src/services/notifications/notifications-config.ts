import * as Notifications from "expo-notifications";
import { printError } from "@/lib/utils";

/**
 * Configure notification behavior and handlers
 */
export const configureNotifications = () => {
  // Configure how notifications are displayed when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Set notification categories (optional - for interactive notifications)
  Notifications.setNotificationCategoryAsync("claxon", [
    {
      identifier: "view",
      buttonTitle: "View",
      options: {
        opensAppToForeground: true,
      },
    },
    {
      identifier: "dismiss",
      buttonTitle: "Dismiss",
      options: {
        opensAppToForeground: false,
        isDestructive: true,
      },
    },
  ]).catch((error) => {
    printError("notifications-category-setup-error", error);
  });
};

/**
 * Set up notification listeners for the app
 */
export const setupNotificationListeners = () => {
  // Handle notifications received while app is in foreground
  const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
    console.log("Notification received in foreground:", notification);
    // You can add custom handling here, like updating app state
  });

  // Handle notification responses (when user taps notification)
  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Notification response:", response);

    const data = response.notification.request.content.data;

    // Handle different notification types
    if (data?.type === "claxon") {
      // Navigate to claxon or inbox screen
      console.log("Claxon notification tapped:", data.claxon_id);
      // You can use router.push() here if needed
    }
  });

  // Return cleanup function
  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
};

/**
 * Request notification permissions and setup
 */
export const initializeNotifications = async () => {
  try {
    configureNotifications();
    setupNotificationListeners();
    console.log("Notifications initialized successfully");
  } catch (error) {
    printError("notifications-initialization-error", error as Error);
  }
};
