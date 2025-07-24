import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";
import { useGetMyClaxons, useMarkAsRead, useMarkAllAsRead, type ClaxonWithRelations } from "@/services/api/claxons";

/**
 * Filter types for claxon messages
 */
export type FilterType = "all" | "unread" | "received" | "sent";

/**
 * Operation types for per-message loading states
 */
export type OperationType = "markAsRead";

/**
 * Main hook for claxons tab following the garage pattern
 * Consolidates all claxon operations, filtering, search, loading states, and haptic feedback
 */
export default function useClaxonsTab() {
  // Data fetching
  const { data: claxons = [], isLoading, error } = useGetMyClaxons();

  // Mutations
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  // Per-message, per-operation loading state
  const [loadingStates, setLoadingStates] = useState<Record<string, Record<OperationType, boolean>>>({});

  // Loading state management
  const setMessageLoading = useCallback((messageId: string, operation: OperationType, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [operation]: loading,
      },
    }));
  }, []);

  const isMessageLoading = useCallback(
    (messageId: string, operation?: OperationType): boolean => {
      if (!operation) {
        // If no operation specified, return true if ANY operation is loading
        return Object.values(loadingStates[messageId] || {}).some(Boolean);
      }
      return loadingStates[messageId]?.[operation] || false;
    },
    [loadingStates],
  );

  // Haptic feedback functions
  const hapticLight = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const hapticMedium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const hapticSuccess = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Computed counts
  const counts = useMemo(() => {
    const unreadCount = claxons.filter((m) => !m.read && m.isReceived).length;
    const receivedCount = claxons.filter((m) => m.isReceived).length;
    const sentCount = claxons.filter((m) => !m.isReceived).length;

    return {
      all: claxons.length,
      unread: unreadCount,
      received: receivedCount,
      sent: sentCount,
    };
  }, [claxons]);

  // Filtered and searched messages
  const filteredMessages = useMemo(() => {
    let filtered = claxons;

    // Apply filters
    switch (selectedFilter) {
      case "unread":
        filtered = filtered.filter((m) => !m.read && m.isReceived);
        break;
      case "received":
        filtered = filtered.filter((m) => m.isReceived);
        break;
      case "sent":
        filtered = filtered.filter((m) => !m.isReceived);
        break;
      default:
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.displayMessage.toLowerCase().includes(query) ||
          m.license_plate.toLowerCase().includes(query) ||
          m.sender?.first_name?.toLowerCase().includes(query) ||
          m.sender?.last_name?.toLowerCase().includes(query) ||
          m.recipient?.first_name?.toLowerCase().includes(query) ||
          m.recipient?.last_name?.toLowerCase().includes(query),
      );
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [claxons, selectedFilter, searchQuery]);

  // Helper function to find message
  const findMessage = useCallback(
    (messageId: string) => {
      return claxons.find((m) => m.id === messageId);
    },
    [claxons],
  );

  // Message operations
  const handleMarkAsRead = useCallback(
    async (messageId: string) => {
      const message = findMessage(messageId);
      if (!message || message.read || !message.isReceived) return;

      try {
        setMessageLoading(messageId, "markAsRead", true);
        hapticMedium();
        await markAsReadMutation.mutateAsync(messageId);
      } finally {
        setMessageLoading(messageId, "markAsRead", false);
      }
    },
    [findMessage, setMessageLoading, hapticMedium, markAsReadMutation],
  );

  const handleMessagePress = useCallback(
    (message: ClaxonWithRelations) => {
      hapticLight();
      // TODO: Navigate to message detail view when implemented
      console.log("Message pressed:", message.id);

      // Auto-mark as read if it's an unread received message
      if (!message.read && message.isReceived) {
        handleMarkAsRead(message.id);
      }
    },
    [hapticLight, handleMarkAsRead],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (counts.unread === 0) return;

    try {
      hapticSuccess();
      await markAllAsReadMutation.mutateAsync();
    } catch {
      // Error is handled by the mutation's onError
    }
  }, [counts.unread, hapticSuccess, markAllAsReadMutation]);

  const handleFilterChange = useCallback(
    (filter: FilterType) => {
      if (filter !== selectedFilter) {
        hapticLight();
        setSelectedFilter(filter);
      }
    },
    [selectedFilter, hapticLight],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSendMessage = useCallback(() => {
    hapticLight();
    // TODO: Navigate to send message screen when implemented
    // router.push("/send-claxon");
    console.log("Send message pressed - navigation not implemented yet");
  }, [hapticLight]);

  // Empty state props based on current filter and search
  const getEmptyStateProps = useCallback(() => {
    if (searchQuery.trim()) {
      return {
        title: "No messages found",
        description: "Try adjusting your search terms",
        showAction: false,
      };
    }

    switch (selectedFilter) {
      case "unread":
        return {
          title: "All caught up!",
          description: "You've read all your messages",
          showAction: false,
        };
      case "received":
        return {
          title: "No received messages",
          description: "Received claxons will appear here",
          showAction: true,
          actionText: "Send Your First Claxon",
          onAction: handleSendMessage,
        };
      case "sent":
        return {
          title: "No sent messages",
          description: "Messages you send will appear here",
          showAction: true,
          actionText: "Send a Claxon",
          onAction: handleSendMessage,
        };
      default:
        return {
          title: "No messages yet",
          description: "Your claxon messages will appear here",
          showAction: true,
          actionText: "Send Your First Claxon",
          onAction: handleSendMessage,
        };
    }
  }, [searchQuery, selectedFilter, handleSendMessage]);

  return {
    // Data
    claxons: filteredMessages,
    isLoading,
    error,
    counts,

    // Search and filter state
    searchQuery,
    selectedFilter,

    // Loading state functions
    isMessageLoading,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    // Operations
    handleMessagePress,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleFilterChange,
    handleSearchChange,
    handleSendMessage,

    // UI helpers
    getEmptyStateProps,
  };
}
