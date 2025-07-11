import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { FlatList, Pressable, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

interface RecentSearch {
	_id: string;
	plate_number: string;
	searched_at: number;
	found: boolean;
}

interface RecentSearchesProps {
	searches: RecentSearch[];
	onSearchSelect: (search: RecentSearch) => void;
}

export function RecentSearches({
	searches,
	onSearchSelect,
}: RecentSearchesProps) {
	const RecentSearchItem = ({ search }: { search: RecentSearch }) => {
		return (
			<Pressable onPress={() => onSearchSelect(search)}>
				<View
					className={cn(
						"flex-row items-center justify-between p-3 rounded-lg border border-border",
						"active:bg-muted/50",
					)}
				>
					<View className="flex-1">
						<View className="flex-row items-center gap-2">
							<Text className="font-medium">🇲🇩 {search.plate_number}</Text>
							<Badge variant={search.found ? "default" : "secondary"}>
								<Text className="text-xs">
									{search.found ? "Found" : "Not found"}
								</Text>
							</Badge>
						</View>
						<Text className="text-xs text-muted-foreground mt-1">
							{dayjs(search.searched_at).fromNow()}
						</Text>
					</View>
					<Text className="text-xs text-muted-foreground">
						Tap to search again
					</Text>
				</View>
			</Pressable>
		);
	};

	const renderSearch = ({
		item,
		index,
	}: {
		item: RecentSearch;
		index: number;
	}) => (
		<View>
			<RecentSearchItem search={item} />
			{index < searches.length - 1 && <View className="h-2" />}
		</View>
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Searches</CardTitle>
				<Text className="text-sm text-muted-foreground">
					Tap any search to repeat it
				</Text>
			</CardHeader>
			<CardContent className="pt-0">
				<FlatList
					data={searches}
					renderItem={renderSearch}
					keyExtractor={(item) => item._id}
					showsVerticalScrollIndicator={false}
					scrollEnabled={false}
				/>
			</CardContent>
		</Card>
	);
}
