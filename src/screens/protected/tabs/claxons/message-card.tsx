import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, View } from "react-native";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { ClaxonWithRelations } from "@/services/api/claxons";

dayjs.extend(relativeTime);

interface MessageCardProps {
  message: ClaxonWithRelations;
  isMarkAsReadLoading?: boolean;
  onPress: (message: ClaxonWithRelations) => void;
  onMarkAsRead?: (messageId: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, isMarkAsReadLoading = false, onPress, onMarkAsRead }) => {
  const isReceived = message.isReceived;
  const displayContact = isReceived ? message.sender : message.recipient;
  const displayName =
    displayContact?.first_name && displayContact?.last_name
      ? `${displayContact.first_name} ${displayContact.last_name}`
      : "Anonymous";

  const handlePress = React.useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(message);
  }, [onPress, message]);

  const handleMarkAsRead = React.useCallback(() => {
    if (!message.read && onMarkAsRead && isReceived) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onMarkAsRead(message.id);
    }
  }, [message.read, message.id, onMarkAsRead, isReceived]);

  const timeAgo = dayjs(message.created_at).fromNow();

  // Get category icon and color
  const getCategoryInfo = () => {
    if (!message.template) return { icon: "💬", color: "bg-blue-100 dark:bg-blue-900" };

    switch (message.template.category) {
      case "compliment":
        return { icon: "👍", color: "bg-green-100 dark:bg-green-900" };
      case "complaint":
        return { icon: "⚠️", color: "bg-red-100 dark:bg-red-900" };
      case "question":
        return { icon: "❓", color: "bg-yellow-100 dark:bg-yellow-900" };
      case "notification":
        return { icon: "💡", color: "bg-blue-100 dark:bg-blue-900" };
      default:
        return { icon: message.template.icon || "💬", color: "bg-gray-100 dark:bg-gray-900" };
    }
  };

  const { icon, color } = getCategoryInfo();

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        "flex-row items-start gap-3 p-4 transition-colors",
        !message.read && isReceived && "bg-primary/5",
        "active:bg-muted/40",
      )}
    >
      {/* Avatar with category indicator */}
      <View className="relative">
        <Avatar alt={displayName} className="h-12 w-12">
          <AvatarFallback>
            <Text className="text-sm font-medium">{displayName.charAt(0).toUpperCase()}</Text>
          </AvatarFallback>
        </Avatar>
        {/* Category icon overlay */}
        <View className={cn("absolute -bottom-1 -right-1 h-6 w-6 rounded-full items-center justify-center", color)}>
          <Text className="text-xs">{icon}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 gap-2">
        {/* Header Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1">
            <Text className={cn("font-medium text-sm", !message.read && isReceived && "font-semibold")}>
              {displayName}
            </Text>
            <Text className="text-xs text-muted-foreground">{isReceived ? "→" : "←"}</Text>
            {!message.read && isReceived && <View className="h-2 w-2 bg-primary rounded-full" />}
          </View>
          <Text className="text-xs text-muted-foreground">{timeAgo}</Text>
        </View>

        {/* License Plate and Category */}
        <View className="flex-row items-center gap-2">
          <Badge variant="outline" className="px-2 py-1">
            <Text className="text-xs font-mono">{message.license_plate}</Text>
          </Badge>
          {message.template?.category && (
            <Badge variant="secondary" className="px-2 py-1">
              <Text className="text-xs capitalize">{message.template.category}</Text>
            </Badge>
          )}
          {message.type === "custom" && (
            <Badge variant="default" className="px-2 py-1">
              <Text className="text-xs">Custom</Text>
            </Badge>
          )}
        </View>

        {/* Message Preview */}
        <Text
          className={cn("text-sm text-foreground leading-5", !message.read && isReceived && "font-medium")}
          numberOfLines={2}
        >
          {message.displayMessage}
        </Text>

        {/* Action Row */}
        {!message.read && isReceived && onMarkAsRead && (
          <View className="flex-row justify-end mt-1">
            <Button
              variant="ghost"
              size="sm"
              onPress={handleMarkAsRead}
              disabled={isMarkAsReadLoading}
              className="rounded-full px-3 py-1"
            >
              <Text className="text-xs">{isMarkAsReadLoading ? "Marking..." : "Mark as read"}</Text>
            </Button>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default React.memo(MessageCard);
