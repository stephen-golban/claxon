import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 5;

export interface RecentSearch {
  _id: string;
  plate_number: string;
  searched_at: number;
  found: boolean;
}

export class RecentSearchesService {
  /**
   * Gets all recent searches from AsyncStorage
   * @returns Array of recent searches, sorted by most recent first
   */
  async getRecentSearches(): Promise<RecentSearch[]> {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (!stored) {
        return [];
      }

      const searches: RecentSearch[] = JSON.parse(stored);
      // Sort by most recent first
      return searches.sort((a, b) => b.searched_at - a.searched_at);
    } catch (error) {
      console.error("Error getting recent searches:", error);
      return [];
    }
  }

  /**
   * Adds a new search to recent searches
   * @param plateNumber The plate number that was searched
   * @param found Whether the search found results
   */
  async addRecentSearch(plateNumber: string, found: boolean): Promise<void> {
    try {
      const existingSearches = await this.getRecentSearches();

      // Remove any existing search for the same plate number
      const filteredSearches = existingSearches.filter((search) => search.plate_number !== plateNumber);

      // Create new search entry
      const newSearch: RecentSearch = {
        _id: `search_${Date.now()}`,
        plate_number: plateNumber,
        searched_at: Date.now(),
        found,
      };

      // Add to beginning and limit to MAX_RECENT_SEARCHES
      const updatedSearches = [newSearch, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);

      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Error adding recent search:", error);
    }
  }

  /**
   * Clears all recent searches
   */
  async clearRecentSearches(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  }
}

export const recentSearchesService = new RecentSearchesService();
