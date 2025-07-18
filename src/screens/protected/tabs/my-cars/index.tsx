import dayjs from "dayjs";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Container, EmptyState, ErrorScreen } from "@/components/common";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VEHICLE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useMyCarsTab } from "@/screens/protected/tabs/my-cars/hook";

import type { Vehicle } from "@/services/api/vehicles";

export function MyCarsTab() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "incomplete">("all");

  const { vehicles, isLoading, error, handleAddVehicle, handleVehiclePress, handleToggleActive } = useMyCarsTab();

  // Show error state if vehicles failed to load
  if (error) {
    return <ErrorScreen message="Failed to load vehicles" />;
  }

  const filteredVehicles = vehicles.filter((vehicle: Vehicle) => {
    switch (selectedFilter) {
      case "active":
        return vehicle.is_active && vehicle.phase === "done";
      case "incomplete":
        return vehicle.phase !== "done";
      default:
        return true;
    }
  });

  const getVehicleColor = (colorCode: string | null) => {
    if (!colorCode) return null;
    return VEHICLE_COLORS.find((color) => color.code === colorCode);
  };

  const getPhaseStatus = (phase: string | null) => {
    switch (phase) {
      case "done":
        return { label: "Complete", variant: "default" as const };
      default:
        return { label: "In Progress", variant: "outline" as const };
    }
  };

  const FilterButton = ({ filter, label, count }: { filter: typeof selectedFilter; label: string; count: number }) => (
    <Button
      variant={selectedFilter === filter ? "default" : "ghost"}
      size="sm"
      onPress={() => setSelectedFilter(filter)}
      className={cn("rounded-full", selectedFilter === filter && "shadow-sm")}
    >
      <View className="flex-row items-center gap-1">
        <Text className="text-sm">{label}</Text>
        {count > 0 && (
          <Badge variant={selectedFilter === filter ? "secondary" : "default"} className="px-1 py-0 ml-1">
            <Text className="text-xs">{count}</Text>
          </Badge>
        )}
      </View>
    </Button>
  );

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const color = getVehicleColor(vehicle.color);
    const status = getPhaseStatus(vehicle.phase);
    const isComplete = vehicle.phase === "done";

    return (
      <Pressable onPress={() => handleVehiclePress(vehicle.id)}>
        <Card className={cn("mb-3", !vehicle.is_active && "opacity-60")}>
          <CardContent className="p-4">
            <View className="flex-row items-start gap-3">
              {/* Vehicle Color Avatar */}
              <Avatar alt={`${vehicle.brand || "Unknown"} ${vehicle.model || "Vehicle"}`} className="h-12 w-12">
                <AvatarFallback style={{ backgroundColor: color?.rgba || "#ccc" }}>
                  <Text className="text-sm font-bold text-white">{vehicle.brand?.charAt(0) || "V"}</Text>
                </AvatarFallback>
              </Avatar>

              {/* Vehicle Info */}
              <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base">
                    {vehicle.brand || "Unknown"} {vehicle.model || "Vehicle"}
                  </Text>
                  <Badge variant={status.variant}>
                    <Text className="text-xs">{status.label}</Text>
                  </Badge>
                </View>

                <Text className="text-sm text-muted-foreground">
                  {vehicle.manufacture_year || "Unknown year"} •{" "}
                  {color?.description || vehicle.color || "Unknown color"}
                </Text>

                {isComplete && vehicle.plate_number && (
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-sm font-medium">🇲🇩 {vehicle.plate_number}</Text>
                  </View>
                )}

                {!isComplete && (
                  <Text className="text-xs text-orange-600 mt-1">Registration incomplete - tap to continue</Text>
                )}

                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-xs text-muted-foreground">Added {dayjs(vehicle.created_at).fromNow()}</Text>

                  <Button variant="ghost" size="sm" onPress={() => handleToggleActive(vehicle.id)} className="h-6 px-2">
                    <Text className="text-xs">{vehicle.is_active ? "Deactivate" : "Activate"}</Text>
                  </Button>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    );
  };

  const renderVehicle = ({ item }: { item: Vehicle; index: number }) => (
    <View>
      <VehicleCard vehicle={item} />
    </View>
  );

  const activeCount = vehicles.filter((v: Vehicle) => v.is_active && v.phase === "done").length;
  const incompleteCount = vehicles.filter((v: Vehicle) => v.phase !== "done").length;

  return (
    <Container loading={isLoading}>
      <Container.TopText title="My Cars" subtitle="Manage your registered vehicles" />

      <View className="flex-1 gap-4">
        {/* Add Vehicle Button */}
        <Button onPress={handleAddVehicle} className="rounded-full" size="lg">
          <Text className="font-medium">+ Add New Vehicle</Text>
        </Button>

        {/* Filter Tabs */}
        <View className="flex-row gap-2">
          <FilterButton filter="all" label="All" count={vehicles.length} />
          <FilterButton filter="active" label="Active" count={activeCount} />
          <FilterButton filter="incomplete" label="Incomplete" count={incompleteCount} />
        </View>

        {/* Vehicles List */}
        <View className="flex-1">
          {filteredVehicles.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <EmptyState
                title={
                  selectedFilter === "all"
                    ? "No vehicles yet"
                    : selectedFilter === "active"
                      ? "No active vehicles"
                      : "No incomplete registrations"
                }
                description={
                  selectedFilter === "all"
                    ? "Add your first vehicle to get started with Claxon"
                    : selectedFilter === "active"
                      ? "Complete your vehicle registrations to see them here"
                      : "All your vehicles are fully registered"
                }
                action={
                  selectedFilter === "all" ? (
                    <Button onPress={handleAddVehicle} className="rounded-full">
                      <Text>Add Your First Vehicle</Text>
                    </Button>
                  ) : undefined
                }
              />
            </View>
          ) : (
            <FlatList
              data={filteredVehicles}
              renderItem={renderVehicle}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </Container>
  );
}
