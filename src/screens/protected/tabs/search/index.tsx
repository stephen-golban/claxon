import React, { useState } from "react";
import { View } from "react-native";

import { Container, EmptyState } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";

import { MessageComposer } from "./components/message-composer";
import { RecentSearches } from "./components/recent-searches";
import { SearchResults } from "./components/search-results";
import SearchVehiclePlateForm from "./form";
import type { SearchVehiclePlateFormData } from "./form/schema";

// Mock data for search results
interface SearchResult {
  vehicle: {
    _id: string;
    brand: string;
    model: string;
    manufacture_year: number;
    color: string;
    plate_number: string;
    is_active: boolean;
  };
  owner: {
    _id: string;
    first_name?: string;
    last_name?: string;
    share_phone: boolean;
  };
}

interface RecentSearch {
  _id: string;
  plate_number: string;
  searched_at: number;
  found: boolean;
}

const mockSearchResults: SearchResult[] = [
  {
    vehicle: {
      _id: "vehicle_1",
      brand: "Dacia",
      model: "Logan",
      manufacture_year: 2019,
      color: "BLU",
      plate_number: "C 123 ABC",
      is_active: true,
    },
    owner: {
      _id: "owner_1",
      first_name: "Maria",
      last_name: "Popescu",
      share_phone: true,
    },
  },
];

const mockRecentSearches: RecentSearch[] = [
  {
    _id: "search_1",
    plate_number: "C 123 ABC",
    searched_at: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    found: true,
  },
  {
    _id: "search_2",
    plate_number: "B 456 DEF",
    searched_at: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    found: false,
  },
  {
    _id: "search_3",
    plate_number: "M 789 GHI",
    searched_at: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    found: true,
  },
];

export function SearchTab() {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(mockRecentSearches);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<SearchResult | null>(null);
  const [showMessageComposer, setShowMessageComposer] = useState(false);

  const handleSearch = async (data: SearchVehiclePlateFormData) => {
    setIsSearching(true);
    setHasSearched(true);

    // Simulate API call
    setTimeout(() => {
      const plateNumber = `${data.plate.left} ${data.plate.right}`;

      // Mock search logic - in real app this would be an API call
      const results = mockSearchResults.filter((result) => result.vehicle.plate_number === plateNumber);

      setSearchResults(results);

      // Add to recent searches
      const newSearch: RecentSearch = {
        _id: `search_${Date.now()}`,
        plate_number: plateNumber,
        searched_at: Date.now(),
        found: results.length > 0,
      };

      setRecentSearches((prev) => [newSearch, ...prev.slice(0, 4)]); // Keep last 5
      setIsSearching(false);
    }, 1500);
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

  const handleRecentSearchSelect = (recentSearch: RecentSearch) => {
    // Auto-fill the form with the recent search
    console.log("Selected recent search:", recentSearch.plate_number);
  };

  if (showMessageComposer && selectedVehicle) {
    return (
      <Container>
        <Container.TopText title="Send Message" subtitle={`Send a claxon to ${selectedVehicle.vehicle.plate_number}`} />
        <MessageComposer vehicle={selectedVehicle} onSend={handleMessageSent} onCancel={handleCancelMessage} />
      </Container>
    );
  }

  return (
    <Container loading={isSearching}>
      <Container.TopText
        title="Search License Plate"
        subtitle="Enter a license plate number to send a message to the car owner"
      />

      <View className="flex-1 gap-4">
        {/* Search Form */}
        <SearchVehiclePlateForm onSubmit={handleSearch} />

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
          <RecentSearches searches={recentSearches} onSearchSelect={handleRecentSearchSelect} />
        )}

        {/* Empty State - Only show if no recent searches and no search performed */}
        {!hasSearched && recentSearches.length === 0 && (
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
