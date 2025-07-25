import { FlatList, View } from "react-native";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VEHICLE_COLORS } from "@/lib/constants";
import type { SearchResult } from "@/services/api/vehicles";

interface SearchResultsProps {
  results: SearchResult[];
  onSendMessage: (vehicle: SearchResult) => void;
}

export function SearchResults({ results, onSendMessage }: SearchResultsProps) {
  const getVehicleColor = (colorCode: string) => {
    return VEHICLE_COLORS.find((color) => color.code === colorCode);
  };

  const getOwnerDisplayName = (owner: SearchResult["owner"]) => {
    if (owner.first_name && owner.last_name) {
      return `${owner.first_name} ${owner.last_name}`;
    }
    return "Anonymous Owner";
  };

  const VehicleResultCard = ({ result }: { result: SearchResult }) => {
    const color = getVehicleColor(result.vehicle.color);
    const ownerName = getOwnerDisplayName(result.owner);

    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <View className="flex-row items-start gap-3">
            {/* Vehicle Color Avatar */}
            <Avatar alt={`${result.vehicle.brand} ${result.vehicle.model}`} className="h-12 w-12">
              <AvatarFallback style={{ backgroundColor: color?.rgba || "#ccc" }}>
                <Text className="text-sm font-bold text-white">{result.vehicle.brand.charAt(0)}</Text>
              </AvatarFallback>
            </Avatar>

            {/* Vehicle & Owner Info */}
            <View className="flex-1 gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-base">
                  {result.vehicle.brand} {result.vehicle.model}
                </Text>
              </View>

              <Text className="text-sm text-muted-foreground">
                {result.vehicle.manufacture_year} • {color?.description || result.vehicle.color}
              </Text>

              <View className="flex-row items-center gap-2 mt-1">
                <Text className="text-sm font-medium">🇲🇩 {result.vehicle.plate_number}</Text>
              </View>

              <Text className="text-sm text-muted-foreground mt-1">Owner: {ownerName}</Text>

              {/* Action Button */}
              <Button onPress={() => onSendMessage(result)} className="rounded-full mt-2" size="sm">
                <Text className="text-sm">Send Message</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    );
  };

  const renderResult = ({ item }: { item: SearchResult }) => <VehicleResultCard result={item} />;

  return (
    <View className="flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <Text className="text-sm text-muted-foreground">
            Found {results.length} vehicle{results.length !== 1 ? "s" : ""}
          </Text>
        </CardHeader>
        <CardContent className="pt-0">
          <FlatList
            data={results}
            renderItem={renderResult}
            keyExtractor={(item) => item.vehicle._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </CardContent>
      </Card>
    </View>
  );
}
