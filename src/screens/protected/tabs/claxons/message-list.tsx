import React from "react";
import { FlatList, View } from "react-native";
import { Separator } from "@/components/ui/separator";
import type { ClaxonWithRelations } from "@/services/api/claxons";
import type { OperationType } from "./hook";
import MessageCard from "./message-card";

interface MessageListProps {
  messages: ClaxonWithRelations[];
  isMessageLoading: (messageId: string, operation?: OperationType) => boolean;
  onMessagePress: (message: ClaxonWithRelations) => void;
  onMarkAsRead: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isMessageLoading, onMessagePress, onMarkAsRead }) => {
  const renderMessage = React.useCallback(
    ({ item, index }: { item: ClaxonWithRelations; index: number }) => (
      <View>
        <MessageCard
          message={item}
          isMarkAsReadLoading={isMessageLoading(item.id, "markAsRead")}
          onPress={onMessagePress}
          onMarkAsRead={onMarkAsRead}
        />
        {index < messages.length - 1 && <Separator />}
      </View>
    ),
    [messages.length, isMessageLoading, onMessagePress, onMarkAsRead],
  );

  const keyExtractor = React.useCallback((item: ClaxonWithRelations) => item.id, []);

  return (
    <View className="flex-1">
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

export default React.memo(MessageList);
