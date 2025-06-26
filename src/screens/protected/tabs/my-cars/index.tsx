import dayjs from "dayjs";
import React, { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Container, EmptyState } from "@/components/common";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VEHICLE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { VehicleForm } from "./components";

type VehicleFormData = {
	brand: string;
	model: string;
	manufacture_year: number;
	color: string;
	vin_code: string;
};

// Mock vehicle data based on your database schema
interface MockVehicle {
	_id: string;
	_creationTime: number;
	brand: string;
	model: string;
	vin_code: string;
	updated_at: number;
	is_active: boolean;
	profile_id: string;
	manufacture_year: number;
	plate_number?: string;
	plate_country?: string;
	plate_left_part?: string;
	plate_right_part?: string;
	color: string;
	phase: "index" | "vehicle_details" | "vehicle_plate" | "done";
	plate_type?: string;
}

const mockVehicles: MockVehicle[] = [
	{
		_id: "vehicle_1",
		_creationTime: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
		brand: "Dacia",
		model: "Logan",
		vin_code: "UU1LSDA1234567890",
		updated_at: Date.now() - 2 * 24 * 60 * 60 * 1000,
		is_active: true,
		profile_id: "current_user",
		manufacture_year: 2019,
		plate_number: "C 123 ABC",
		plate_country: "MD",
		plate_left_part: "C",
		plate_right_part: "123",
		color: "BLU",
		phase: "done",
		plate_type: "standard_current",
	},
	{
		_id: "vehicle_2",
		_creationTime: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
		brand: "Toyota",
		model: "Camry",
		vin_code: "4T1BF1FK5CU123456",
		updated_at: Date.now() - 5 * 24 * 60 * 60 * 1000,
		is_active: true,
		profile_id: "current_user",
		manufacture_year: 2021,
		plate_number: "B 456 DEF",
		plate_country: "MD",
		plate_left_part: "B",
		plate_right_part: "456",
		color: "WHI",
		phase: "done",
		plate_type: "standard_current",
	},
	{
		_id: "vehicle_3",
		_creationTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
		brand: "BMW",
		model: "X5",
		vin_code: "5UXWX9C53D0A12345",
		updated_at: Date.now() - 1 * 24 * 60 * 60 * 1000,
		is_active: true,
		profile_id: "current_user",
		manufacture_year: 2022,
		color: "BLK",
		phase: "vehicle_details", // In progress
		plate_type: undefined,
	},
];

export function MyCarsTab() {
	const [vehicles, setVehicles] = useState(mockVehicles);
	const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "incomplete">("all");
	const [showAddForm, setShowAddForm] = useState(false);

	const filteredVehicles = vehicles.filter((vehicle) => {
		switch (selectedFilter) {
			case "active":
				return vehicle.is_active && vehicle.phase === "done";
			case "incomplete":
				return vehicle.phase !== "done";
			default:
				return true;
		}
	});

	const getVehicleColor = (colorCode: string) => {
		return VEHICLE_COLORS.find((color) => color.code === colorCode);
	};

	const getPhaseStatus = (phase: string) => {
		switch (phase) {
			case "done":
				return { label: "Complete", variant: "default" as const };
			case "vehicle_details":
				return { label: "Details Needed", variant: "secondary" as const };
			case "vehicle_plate":
				return { label: "Plate Needed", variant: "secondary" as const };
			default:
				return { label: "In Progress", variant: "outline" as const };
		}
	};

	const handleAddVehicle = () => {
		setShowAddForm(true);
	};

	const handleSaveVehicle = (data: VehicleFormData) => {
		console.log("Save vehicle:", data);
		// In real app, this would save to the database
		const newVehicle: MockVehicle = {
			_id: `vehicle_${Date.now()}`,
			_creationTime: Date.now(),
			brand: data.brand,
			model: data.model,
			vin_code: data.vin_code,
			updated_at: Date.now(),
			is_active: true,
			profile_id: "current_user",
			manufacture_year: data.manufacture_year,
			color: data.color,
			phase: "vehicle_plate", // Next step would be license plate
		};

		setVehicles((prev) => [newVehicle, ...prev]);
		setShowAddForm(false);
	};

	const handleCancelAdd = () => {
		setShowAddForm(false);
	};

	const handleVehiclePress = (vehicle: MockVehicle) => {
		console.log("Vehicle pressed:", vehicle._id);
		// Navigate to vehicle details or edit
	};

	const handleToggleActive = (vehicleId: string) => {
		setVehicles((prev) =>
			prev.map((vehicle) => (vehicle._id === vehicleId ? { ...vehicle, is_active: !vehicle.is_active } : vehicle)),
		);
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

	const VehicleCard = ({ vehicle }: { vehicle: MockVehicle }) => {
		const color = getVehicleColor(vehicle.color);
		const status = getPhaseStatus(vehicle.phase);
		const isComplete = vehicle.phase === "done";

		return (
			<Pressable onPress={() => handleVehiclePress(vehicle)}>
				<Card className={cn("mb-3", !vehicle.is_active && "opacity-60")}>
					<CardContent className="p-4">
						<View className="flex-row items-start gap-3">
							{/* Vehicle Color Avatar */}
							<Avatar alt={`${vehicle.brand} ${vehicle.model}`} className="h-12 w-12">
								<AvatarFallback style={{ backgroundColor: color?.rgba || "#ccc" }}>
									<Text className="text-sm font-bold text-white">{vehicle.brand.charAt(0)}</Text>
								</AvatarFallback>
							</Avatar>

							{/* Vehicle Info */}
							<View className="flex-1 gap-1">
								<View className="flex-row items-center justify-between">
									<Text className="font-semibold text-base">
										{vehicle.brand} {vehicle.model}
									</Text>
									<Badge variant={status.variant}>
										<Text className="text-xs">{status.label}</Text>
									</Badge>
								</View>

								<Text className="text-sm text-muted-foreground">
									{vehicle.manufacture_year} • {color?.description || vehicle.color}
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
									<Text className="text-xs text-muted-foreground">Added {dayjs(vehicle._creationTime).fromNow()}</Text>

									<Button
										variant="ghost"
										size="sm"
										onPress={() => handleToggleActive(vehicle._id)}
										className="h-6 px-2"
									>
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

	const renderVehicle = ({ item, index }: { item: MockVehicle; index: number }) => (
		<View>
			<VehicleCard vehicle={item} />
		</View>
	);

	const activeCount = vehicles.filter((v) => v.is_active && v.phase === "done").length;
	const incompleteCount = vehicles.filter((v) => v.phase !== "done").length;

	return (
		<Container>
			<Container.TopText title="My Cars" subtitle="Manage your registered vehicles" />

			<View className="flex-1 gap-4">
				{/* Add Vehicle Form or Button */}
				{showAddForm ? (
					<VehicleForm onSubmit={handleSaveVehicle} onCancel={handleCancelAdd} />
				) : (
					<Button onPress={handleAddVehicle} className="rounded-full" size="lg">
						<Text className="font-medium">+ Add New Vehicle</Text>
					</Button>
				)}

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
							keyExtractor={(item) => item._id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
						/>
					)}
				</View>
			</View>
		</Container>
	);
}
