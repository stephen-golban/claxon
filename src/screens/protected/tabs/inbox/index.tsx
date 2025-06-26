import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { Container, EmptyState } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { MessageItem } from "./components/message-item";
import { mockMessages } from "./mock-data";
import type { ClaxonMessage } from "./types";

dayjs.extend(relativeTime);

export function InboxTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "received" | "sent">("all");
  const [messages, setMessages] = useState(mockMessages);

  const filteredMessages = useMemo(() => {
    let filtered = messages;

    // Apply filters
    switch (selectedFilter) {
      case "unread":
        filtered = filtered.filter((m) => !m.read);
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

    return filtered.sort((a, b) => b._creationTime - a._creationTime);
  }, [messages, selectedFilter, searchQuery]);

  const unreadCount = messages.filter((m) => !m.read).length;
  const receivedCount = messages.filter((m) => m.isReceived).length;
  const sentCount = messages.filter((m) => !m.isReceived).length;

  const handleMessagePress = (message: ClaxonMessage) => {
    // Handle message press - could navigate to detail view
    console.log("Message pressed:", message._id);
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, read: true } : msg)));
  };

  const handleMarkAllAsRead = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
  };

  const FilterButton = ({ filter, label, count }: { filter: typeof selectedFilter; label: string; count?: number }) => (
    <Button
      variant={selectedFilter === filter ? "default" : "ghost"}
      size="sm"
      onPress={() => setSelectedFilter(filter)}
      className={cn("rounded-full", selectedFilter === filter && "shadow-sm")}
    >
      <View className="flex-row items-center gap-1">
        <Text className="text-sm">{label}</Text>
        {count !== undefined && count > 0 && (
          <Badge variant={selectedFilter === filter ? "secondary" : "default"} className="px-1 py-0 ml-1">
            <Text className="text-xs">{count}</Text>
          </Badge>
        )}
      </View>
    </Button>
  );

  const renderMessage = ({ item, index }: { item: ClaxonMessage; index: number }) => (
    <View>
      <MessageItem message={item} onPress={handleMessagePress} onMarkAsRead={handleMarkAsRead} />
      {index < filteredMessages.length - 1 && <Separator />}
    </View>
  );

  const getEmptyStateProps = () => {
    if (searchQuery.trim()) {
      return {
        title: "No messages found",
        description: "Try adjusting your search terms",
      };
    }

    switch (selectedFilter) {
      case "unread":
        return {
          title: "All caught up!",
          description: "You've read all your messages",
        };
      case "received":
        return {
          title: "No received messages",
          description: "Received claxons will appear here",
        };
      case "sent":
        return {
          title: "No sent messages",
          description: "Messages you send will appear here",
        };
      default:
        return {
          title: "No messages yet",
          description: "Your claxon messages will appear here",
        };
    }
  };

  return (
    <Container>
      <Container.TopText title="Inbox" subtitle="Manage your claxon messages" />

      <View className="flex-1 gap-4">
        {/* Header Actions */}
        {unreadCount > 0 && (
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </Text>
            <Button variant="ghost" size="sm" onPress={handleMarkAllAsRead} className="rounded-full">
              <Text className="text-sm">Mark all read</Text>
            </Button>
          </View>
        )}

        {/* Search */}
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="rounded-full"
        />

        {/* Filter Tabs */}
        <View className="flex-row gap-2">
          <FilterButton filter="all" label="All" count={messages.length} />
          <FilterButton filter="unread" label="Unread" count={unreadCount} />
          <FilterButton filter="received" label="Received" count={receivedCount} />
          <FilterButton filter="sent" label="Sent" count={sentCount} />
        </View>

        {/* Messages List */}
        <View className="flex-1 bg-card rounded-lg border border-border overflow-hidden">
          {filteredMessages.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <EmptyState {...getEmptyStateProps()} />
            </View>
          ) : (
            <FlatList
              data={filteredMessages}
              renderItem={renderMessage}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            />
          )}
        </View>
      </View>
    </Container>
  );
}
