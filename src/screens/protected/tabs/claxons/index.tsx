import { View } from "react-native";
import { Container, ErrorScreen } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import EmptyState from "./empty-state";
import FilterTabs from "./filter-tabs";
import useClaxonsTab from "./hook";
import MessageList from "./message-list";

export function ClaxonsTab() {
  const {
    claxons,
    isLoading,
    error,
    counts,
    searchQuery,
    selectedFilter,
    isMarkingAllAsRead,
    isMessageLoading,
    handleMessagePress,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleFilterChange,
    handleSearchChange,
    getEmptyStateProps,
  } = useClaxonsTab();

  if (error) {
    return <ErrorScreen message="Failed to load messages" />;
  }

  const emptyStateProps = getEmptyStateProps();

  return (
    <Container loading={isLoading}>
      <View className="flex-1">
        <Container.TopText title="Inbox" subtitle="Manage your claxon messages" />

        {/* Header Actions */}
        {counts.unread > 0 && (
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-muted-foreground">
              {counts.unread} unread message{counts.unread !== 1 ? "s" : ""}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className="rounded-full"
            >
              <Text className="text-sm">{isMarkingAllAsRead ? "Marking..." : "Mark all read"}</Text>
            </Button>
          </View>
        )}

        {/* Search */}
        <View className="mb-4">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            className="rounded-full"
          />
        </View>

        {/* Filter Tabs */}
        <View className="mb-4">
          <FilterTabs selectedFilter={selectedFilter} counts={counts} onFilterChange={handleFilterChange} />
        </View>

        {/* Messages List or Empty State */}
        <View className="flex-1 bg-card rounded-lg border border-border overflow-hidden">
          {claxons.length === 0 ? (
            <EmptyState {...emptyStateProps} />
          ) : (
            <MessageList
              messages={claxons}
              isMessageLoading={isMessageLoading}
              onMessagePress={handleMessagePress}
              onMarkAsRead={handleMarkAsRead}
            />
          )}
        </View>
      </View>
    </Container>
  );
}
