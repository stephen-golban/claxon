import { useState } from "react";
import { View } from "react-native";

import { Container, EmptyState } from "@/components/common";
import LicensePlateForm, { type LicensePlateFormData } from "@/components/forms/license-plate";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAddRecentSearch, useClearRecentSearches, useGetRecentSearches } from "@/hooks/use-recent-searches";
import { type SearchResult, useSearchVehicleByPlate } from "@/services/api/vehicles";
// Import RecentSearch type from the service
import type { RecentSearch } from "@/services/storage/recent-searches";
import { MessageComposer } from "./components/message-composer";
import { RecentSearches } from "./components/recent-searches";
import { SearchResults } from "./components/search-results";

export function SearchTab() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<SearchResult | null>(null);
  const [showMessageComposer, setShowMessageComposer] = useState(false);

  // API hooks
  const searchVehicle = useSearchVehicleByPlate();
  const addRecentSearch = useAddRecentSearch();
  const clearRecentSearches = useClearRecentSearches();
  const { data: recentSearches = [], isLoading: isLoadingRecentSearches } = useGetRecentSearches();

  const handleSearch = async (data: LicensePlateFormData) => {
    setHasSearched(true);
    const plateNumber = `${data.plate.left} ${data.plate.right}`;

    try {
      const results = await searchVehicle.mutateAsync(plateNumber);
      setSearchResults(results);

      // Add to recent searches
      await addRecentSearch.mutateAsync({
        plateNumber,
        found: results.length > 0,
      });
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);

      // Still add to recent searches even if search failed
      await addRecentSearch.mutateAsync({
        plateNumber,
        found: false,
      });
    }
  };

  const handleSendMessage = (vehicle: SearchResult) => {
    setSelectedVehicle(vehicle);
    setShowMessageComposer(true);
  };

  const handleMessageSent = () => {
    setShowMessageComposer(false);
    setSelectedVehicle(null);
    // Show success message or navigate to inbox
    console.log("Message sent successfully!");
  };

  const handleCancelMessage = () => {
    setShowMessageComposer(false);
    setSelectedVehicle(null);
  };

  const handleRecentSearchSelect = async (recentSearch: RecentSearch) => {
    // Trigger search with the recent search plate number
    const [left, right] = recentSearch.plate_number.split(" ");
    if (left && right) {
      await handleSearch({
        plate: { left, right },
        type: "cars.standard.default", // Default type for recent searches
      });
    }
  };

  const handleClearRecentSearches = async () => {
    try {
      await clearRecentSearches.mutateAsync();
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  };

  if (showMessageComposer && selectedVehicle) {
    return (
      <Container>
        <Container.TopText title="Send Message" subtitle={`Send a claxon to ${selectedVehicle.vehicle.plate_number}`} />
        <MessageComposer vehicle={selectedVehicle} onSend={handleMessageSent} onCancel={handleCancelMessage} />
      </Container>
    );
  }

  const isLoading = searchVehicle.isPending || addRecentSearch.isPending;

  return (
    <Container>
      <Container.TopText
        title="Search License Plate"
        subtitle="Enter a license plate number to send a message to the car owner"
      />

      <View className="flex-1 gap-4">
        {/* Search Form */}
        <LicensePlateForm onSubmit={handleSearch} isLoading={isLoading} />

        {/* Search Results */}
        {hasSearched && (
          <View className="flex-1">
            {searchResults.length > 0 ? (
              <SearchResults results={searchResults} onSendMessage={handleSendMessage} />
            ) : (
              <Card>
                <CardContent className="items-center py-8">
                  <Text className="text-4xl mb-2">🔍</Text>
                  <Text className="font-medium text-center mb-1">No vehicle found</Text>
                  <Text className="text-sm text-muted-foreground text-center">
                    This license plate is not registered in Claxon
                  </Text>
                </CardContent>
              </Card>
            )}
          </View>
        )}

        {/* Recent Searches - Only show if no search has been performed */}
        {!hasSearched && recentSearches.length > 0 && (
          <RecentSearches
            searches={recentSearches}
            onSearchSelect={handleRecentSearchSelect}
            onClearAll={handleClearRecentSearches}
            isClearingAll={clearRecentSearches.isPending}
          />
        )}

        {/* Empty State - Only show if no recent searches and no search performed */}
        {!hasSearched && recentSearches.length === 0 && !isLoadingRecentSearches && (
          <View className="flex-1 items-center justify-center">
            <EmptyState
              title="Ready to search"
              description="Enter a license plate number above to find the vehicle owner and send them a message"
            />
          </View>
        )}
      </View>
    </Container>
  );
}
