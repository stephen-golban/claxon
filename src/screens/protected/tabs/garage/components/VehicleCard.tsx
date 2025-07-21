import React from "react";
import { Pressable, View } from "react-native";
import { LoadingSpinner } from "@/components/common";
import { LicensePlateField } from "@/components/form-elements/license-plate";
import { CarIcon, TrashIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks";
import type { LicensePlateType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/services/api/vehicles";
import { getVehicleColorInfo } from "../utils/vehicleColorUtils";

/**
 * Props interface for VehicleCard component following Interface Segregation Principle
 */
export interface VehicleCardProps {
  vehicle: Vehicle;
  isLoading?: boolean;
  onPress: (vehicleId: string) => void;
  onToggleActive: (vehicleId: string) => void;
  onDelete: (vehicleId: string) => void;
}

/**
 * VehicleCard component following Single Responsibility Principle
 * Only responsible for displaying a single vehicle with its actions
 * Optimized with React.memo for performance
 */
export const VehicleCard = React.memo<VehicleCardProps>(
  ({ vehicle, isLoading = false, onPress, onToggleActive, onDelete }) => {
    const { isDark } = useColorScheme();
    const { color, gradientColors, carColor } = getVehicleColorInfo(vehicle.color, isDark);
    const isComplete = vehicle.phase === "done";

    const handlePress = () => onPress(vehicle.id);
    const handleToggleActive = () => onToggleActive(vehicle.id);
    const handleDelete = () => onDelete(vehicle.id);

    return (
      <Card className="mb-3 overflow-hidden">
        <CardContent className="p-0">
          {/* Status indicator */}
          <View className="absolute top-3 right-3 z-10">
            <View
              key={`status-${vehicle.id}-${vehicle.is_active}`}
              className={cn(
                "h-3 w-3 rounded-full border-2 border-white dark:border-gray-900",
                vehicle.is_active ? "bg-green-500 shadow-green-500/50" : "bg-gray-400 dark:bg-gray-600",
              )}
            />
          </View>

          {/* Main content area */}
          <Pressable onPress={handlePress} className="active:opacity-70">
            <View className="p-4">
              {/* Vehicle info header */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground mb-1">
                    {vehicle.brand} {vehicle.model}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    {vehicle.manufacture_year && (
                      <Text className="text-sm text-muted-foreground">{vehicle.manufacture_year}</Text>
                    )}
                    {vehicle.manufacture_year && color && <View className="h-1 w-1 rounded-full bg-muted-foreground" />}
                    {color && <Text className="text-sm text-muted-foreground">{color.description}</Text>}
                  </View>
                </View>
                <View className="ml-3">
                  <CarIcon size={32} color={carColor} gradientColors={gradientColors || undefined} />
                </View>
              </View>

              {/* Vehicle status badges */}
              <View className="flex-row items-center gap-2 mb-3">
                <Badge
                  key={`active-badge-${vehicle.id}-${vehicle.is_active}`}
                  variant={vehicle.is_active ? "default" : "secondary"}
                  className={cn(
                    "px-2 py-1",
                    vehicle.is_active ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800",
                  )}
                >
                  <Text
                    className={cn(
                      "text-xs font-medium",
                      vehicle.is_active ? "text-green-700 dark:text-green-300" : "text-gray-600 dark:text-gray-400",
                    )}
                  >
                    {vehicle.is_active ? "Active" : "Inactive"}
                  </Text>
                </Badge>

                <Badge
                  key={`complete-badge-${vehicle.id}-${isComplete}`}
                  variant={isComplete ? "default" : "secondary"}
                  className={cn(
                    "px-2 py-1",
                    isComplete ? "bg-blue-100 dark:bg-blue-900/30" : "bg-yellow-100 dark:bg-yellow-900/30",
                  )}
                >
                  <Text
                    className={cn(
                      "text-xs font-medium",
                      isComplete ? "text-blue-700 dark:text-blue-300" : "text-yellow-700 dark:text-yellow-300",
                    )}
                  >
                    {isComplete ? "Complete" : "Pending"}
                  </Text>
                </Badge>
              </View>
            </View>
          </Pressable>

          {/* License plate and actions for complete vehicles */}
          {isComplete && (
            <View className="px-4 pb-3">
              <View className="flex-row items-center justify-between">
                {/* License plate display */}
                <View className="flex-1 mr-3 max-w-[200px]">
                  <LicensePlateField
                    type={vehicle.plate_type as LicensePlateType}
                    left={vehicle.plate_left_part || ""}
                    right={vehicle.plate_right_part || ""}
                    onLeftChange={() => {}} // No-op for read-only
                    onRightChange={() => {}} // No-op for read-only
                    disabled={true}
                    compact
                  />
                </View>

                {/* Action buttons */}
                <View className="flex-row items-center gap-2">
                  <Button
                    key={`toggle-btn-${vehicle.id}-${vehicle.is_active}`}
                    variant={vehicle.is_active ? "secondary" : "default"}
                    size="xs"
                    onPress={handleToggleActive}
                    disabled={isLoading}
                    className={cn(
                      "px-3 py-1 h-7 flex-row items-center",
                      vehicle.is_active ? "bg-gray-100 dark:bg-gray-800" : "bg-green-100 dark:bg-green-900/30",
                    )}
                  >
                    {isLoading && <LoadingSpinner size={12} />}
                    <Text
                      className={cn(
                        "text-xs font-medium",
                        vehicle.is_active ? "text-gray-700 dark:text-gray-300" : "text-green-700 dark:text-green-300",
                      )}
                    >
                      {vehicle.is_active ? "Disable" : "Enable"}
                    </Text>
                  </Button>

                  <Button
                    variant="ghost"
                    size="xs"
                    onPress={handleDelete}
                    disabled={isLoading}
                    className="p-1 h-7 w-7 bg-red-50 dark:bg-red-900/20"
                  >
                    <TrashIcon size={12} className="text-red-600 dark:text-red-400" />
                  </Button>
                </View>
              </View>
            </View>
          )}

          {/* Action buttons only for incomplete vehicles */}
          {!isComplete && (
            <View className="flex-row items-center justify-end gap-2 px-4 pb-3">
              <Button
                key={`toggle-btn-incomplete-${vehicle.id}-${vehicle.is_active}`}
                variant={vehicle.is_active ? "secondary" : "default"}
                size="xs"
                onPress={handleToggleActive}
                disabled={isLoading}
                className={cn(
                  "px-3 py-1 h-7",
                  vehicle.is_active ? "bg-gray-100 dark:bg-gray-800" : "bg-green-100 dark:bg-green-900/30",
                )}
              >
                {isLoading && <LoadingSpinner size="small" />}
                <Text
                  className={cn(
                    "text-xs font-medium",
                    vehicle.is_active ? "text-gray-700 dark:text-gray-300" : "text-green-700 dark:text-green-300",
                  )}
                >
                  {vehicle.is_active ? "Disable" : "Enable"}
                </Text>
              </Button>

              <Button
                variant="ghost"
                size="xs"
                onPress={handleDelete}
                disabled={isLoading}
                className="p-1 h-7 w-7 bg-red-50 dark:bg-red-900/20"
              >
                <TrashIcon size={12} className="text-red-600 dark:text-red-400" />
              </Button>
            </View>
          )}
        </CardContent>
      </Card>
    );
  },
);

VehicleCard.displayName = "VehicleCard";
