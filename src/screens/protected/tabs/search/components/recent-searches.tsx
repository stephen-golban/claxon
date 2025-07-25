import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FlatList, Pressable, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { RecentSearch } from "@/services/storage/recent-searches";

dayjs.extend(relativeTime);

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSearchSelect: (search: RecentSearch) => void;
  onClearAll: () => void;
  isClearingAll?: boolean;
}

export function RecentSearches({ searches, onSearchSelect, onClearAll, isClearingAll = false }: RecentSearchesProps) {
  const RecentSearchItem = ({ search }: { search: RecentSearch }) => {
    return (
      <Pressable
        onPress={() => onSearchSelect(search)}
        className={cn(
          "flex-row items-center justify-between p-4 rounded-xl",
          "bg-muted/30 active:bg-muted/50 border border-border/50",
        )}
      >
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="font-semibold">🇲🇩 {search.plate_number}</Text>
            <Badge variant={search.found ? "default" : "secondary"}>
              <Text className="text-xs">{search.found ? "Found" : "Not found"}</Text>
            </Badge>
          </View>
          <Text className="text-xs text-muted-foreground mt-1">{dayjs(search.searched_at).fromNow()}</Text>
        </View>
        <Text className="text-xs text-muted-foreground">Tap to search again</Text>
      </Pressable>
    );
  };

  const renderSearch = ({ item, index }: { item: RecentSearch; index: number }) => (
    <View>
      <RecentSearchItem search={item} />
      {index < searches.length - 1 && <View className="h-3" />}
    </View>
  );

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold mb-1">Recent Searches</Text>
          <Text className="text-sm text-muted-foreground">Tap any search to repeat it</Text>
        </View>
        <Button variant="ghost" size="sm" onPress={onClearAll} disabled={isClearingAll} className="rounded-full">
          <Text>{isClearingAll ? "Clearing..." : "Clear"}</Text>
        </Button>
      </View>
      <FlatList
        data={searches}
        renderItem={renderSearch}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}
