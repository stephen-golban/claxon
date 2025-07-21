import React from "react";
import { Alert, View } from "react-native";
import { LoadingSpinner } from "@/components/common";
import { LicensePlateField } from "@/components/form-elements/license-plate";
import { SettingsIcon, TrashIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { LicensePlateType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/services/api/vehicles";

/**
 * Props interface for VehicleCard component following Interface Segregation Principle
 */
export interface VehicleCardProps {
  vehicle: Vehicle;
  isToggleLoading?: boolean;
  isDeleteLoading?: boolean;
  onEditLicensePlate: (vehicleId: string) => void;
  onEditVehicleDetails: (vehicleId: string) => void;
  onToggleActive: (vehicleId: string) => void;
  onDelete: (vehicleId: string) => void;
}

export const VehicleCard = React.memo<VehicleCardProps>(
  ({
    vehicle,
    isToggleLoading = false,
    isDeleteLoading = false,
    onEditLicensePlate,
    onEditVehicleDetails,
    onToggleActive,
    onDelete,
  }) => {
    const isComplete = vehicle.phase === "done";

    const handleEditAction = () => {
      if (!isComplete) {
        // If setup needed, go directly to license plate setup
        onEditLicensePlate(vehicle.id);
      } else {
        // If complete, show edit options
        Alert.alert(
          "Edit Vehicle",
          "Choose what you'd like to edit:",
          [
            {
              text: "License Plate",
              onPress: () => onEditLicensePlate(vehicle.id),
            },
            {
              text: "Vehicle Details",
              onPress: () => onEditVehicleDetails(vehicle.id),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: true },
        );
      }
    };

    const handleToggleActive = () => onToggleActive(vehicle.id);

    const handleDelete = () => {
      Alert.alert("Delete Vehicle", `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(vehicle.id),
        },
      ]);
    };

    return (
      <Card className="mb-4 bg-card">
        <CardContent className="p-5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">
                {vehicle.brand} {vehicle.model}
              </Text>
              {vehicle.manufacture_year && (
                <Text className="text-sm text-muted-foreground mt-0.5">{vehicle.manufacture_year}</Text>
              )}
            </View>

            <View className="flex-row gap-2">
              <Badge variant={vehicle.is_active ? "default" : "secondary"} className="rounded-full px-2.5 py-1">
                <Text className="text-xs font-medium">{vehicle.is_active ? "Active" : "Inactive"}</Text>
              </Badge>
              {!isComplete && (
                <Badge variant="outline" className="rounded-full px-2.5 py-1">
                  <Text className="text-xs">Setup needed</Text>
                </Badge>
              )}
            </View>
          </View>

          {/* License plate - only show if complete */}
          {isComplete && (
            <View className="mb-4">
              <View className="bg-muted/50 rounded-lg p-3 items-center">
                <LicensePlateField
                  type={vehicle.plate_type as LicensePlateType}
                  left={vehicle.plate_left_part || ""}
                  right={vehicle.plate_right_part || ""}
                  onLeftChange={() => {}}
                  onRightChange={() => {}}
                  disabled={true}
                />
              </View>
            </View>
          )}

          {/* Action buttons */}
          <View className="flex-row gap-2 items-center">
            {isComplete && (
              <Button
                variant={vehicle.is_active ? "secondary" : "default"}
                size="sm"
                onPress={handleToggleActive}
                disabled={isToggleLoading}
              >
                {isToggleLoading ? (
                  <LoadingSpinner size={14} />
                ) : (
                  <Text className="text-sm font-medium">{vehicle.is_active ? "Turn Off" : "Turn On"}</Text>
                )}
              </Button>
            )}

            <Button
              size="sm"
              onPress={handleEditAction}
              className={cn("flex-row items-center gap-1.5", !isComplete && "flex-1")}
            >
              <SettingsIcon size={14} className="text-primary-foreground" />
              {!isComplete && <Text className="text-sm font-medium">Setup</Text>}
            </Button>

            <Button size="sm" onPress={handleDelete} disabled={isDeleteLoading} className="bg-destructive/10">
              {isDeleteLoading ? (
                <LoadingSpinner size={14} className="text-destructive" />
              ) : (
                <TrashIcon size={14} className="text-destructive" />
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    );
  },
);

VehicleCard.displayName = "VehicleCard";
