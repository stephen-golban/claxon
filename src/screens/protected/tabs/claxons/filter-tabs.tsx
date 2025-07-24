import React from "react";
import { View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { FilterType } from "./hook";

interface FilterTabsProps {
  selectedFilter: FilterType;
  counts: {
    all: number;
    unread: number;
    received: number;
    sent: number;
  };
  onFilterChange: (filter: FilterType) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ selectedFilter, counts, onFilterChange }) => {
  const FilterButton = React.useCallback(
    ({ filter, label, count }: { filter: FilterType; label: string; count?: number }) => (
      <Button
        variant={selectedFilter === filter ? "default" : "ghost"}
        size="sm"
        onPress={() => onFilterChange(filter)}
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
    ),
    [selectedFilter, onFilterChange],
  );

  return (
    <View className="flex-row gap-2">
      <FilterButton filter="all" label="All" count={counts.all} />
      <FilterButton filter="unread" label="Unread" count={counts.unread} />
      <FilterButton filter="received" label="Received" count={counts.received} />
      <FilterButton filter="sent" label="Sent" count={counts.sent} />
    </View>
  );
};

export default React.memo(FilterTabs);
