import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Container } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { supabase } from "@/services/api/client";
import { ProfileForm } from "./form";
import type { ProfileFormData } from "./schema";

export function AccountTab() {
	const { t } = useTranslation();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	// Query current user data
	// const { data: user, isPending, isLoading } = useCurrentUser();

	// Mutations
	// const updateUserMutation = useUpdateUser();
	// const deleteUserMutation = useDeleteUser();

	const handleSaveProfile = async (data: ProfileFormData) => {
		try {
			// await updateUserMutation.mutateAsync({
			// 	dob: data.dob?.toISOString(),
			// 	gender: data.gender,
			// 	language: data.language,
			// 	avatarUrl: data.avatar?.uri || user?.avatarUrl || undefined,
			// 	privacySettings: user?.privacySettings,
			// 	isPhonePublic: data.share_phone,
			// 	notificationPreferences: user?.notificationPreferences,
			// });

			Alert.alert("Success", "Profile updated successfully!");
			setIsEditing(false);
		} catch (error) {
			console.error("Profile update error:", error);
			Alert.alert("Error", "Failed to update profile");
		}
	};

	const handleSignOut = () => {
		Alert.alert("Sign Out", "Are you sure you want to sign out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Sign Out",
				style: "destructive",
				onPress: async () => {
					await supabase.auth.signOut();
					router.replace("/");
				},
			},
		]);
	};

	const handleDeleteAccount = () => {
		Alert.alert(
			"Delete Account",
			"This action cannot be undone. Are you sure you want to delete your account?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							// await deleteUserMutation.mutateAsync();
							await supabase.auth.signOut();
							router.replace("/");
						} catch (error) {
							console.error("Account deletion error:", error);
							Alert.alert("Error", "Failed to delete account");
						}
					},
				},
			],
		);
	};

	// Show loading state while fetching user data
	// if (isPending || isLoading) {
	// 	return (
	// 		<Container>
	// 			<Container.TopText title="Account" subtitle="Loading..." />
	// 			<View className="flex-1 items-center justify-center">
	// 				<Text>Loading profile...</Text>
	// 			</View>
	// 		</Container>
	// 	);
	// }

	if (isEditing) {
		return (
			<Container>
				<Container.TopText
					title="Edit Profile"
					subtitle="Update your personal information"
				/>
				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<ProfileForm
						onSubmit={handleSaveProfile}
						// isLoading={updateUserMutation.isPending}
						// initialData={user as User}
					/>
					<Button
						variant="outline"
						onPress={() => setIsEditing(false)}
						className="mt-4"
					>
						<Text>Cancel</Text>
					</Button>
				</ScrollView>
			</Container>
		);
	}

	return (
		<Container>
			<Container.TopText
				title="Account"
				subtitle="Manage your profile and preferences"
			/>

			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="gap-y-6">
					{/* Profile Card */}
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>
								Your personal details and preferences
							</CardDescription>
						</CardHeader>
						<CardContent className="gap-y-4">
							<View className="flex-row items-center justify-between">
								{/* <View className="flex-1">
									<Text className="font-medium">
										{user?.firstName && user?.lastName
											? `${user.firstName} ${user.lastName}`
											: "No name set"}
									</Text>
									<Text className="text-sm text-muted-foreground">
										{user?.email || "No email set"}
									</Text>
									<Text className="text-sm text-muted-foreground">
										{user?.gender && user?.dob
											? `${user.gender} • Born ${new Date(user.dob).getFullYear()}`
											: "Personal details not set"}
									</Text>
									<Text className="text-sm text-muted-foreground">
										Language:{" "}
										{user?.language === "ro"
											? "Romanian"
											: user?.language === "ru"
												? "Russian"
												: "English"}
									</Text>
								</View> */}
							</View>
							<Button onPress={() => setIsEditing(true)}>
								<Text>Edit Profile</Text>
							</Button>
						</CardContent>
					</Card>

					{/* Privacy Settings */}
					<Card>
						<CardHeader>
							<CardTitle>Privacy Settings</CardTitle>
							<CardDescription>
								Control your privacy and data sharing
							</CardDescription>
						</CardHeader>
						<CardContent className="gap-y-4">
							<View className="flex-row items-center justify-between">
								<View className="flex-1">
									<Text className="font-medium">Share Phone Number</Text>
									<Text className="text-sm text-muted-foreground">
										Allow other users to see your phone number
									</Text>
								</View>
								<Text className="text-sm text-muted-foreground">
									{/* {user?.isPhonePublic ? "Enabled" : "Disabled"} */}
								</Text>
							</View>
							<Separator />
							<View className="flex-row items-center justify-between">
								<View className="flex-1">
									<Text className="font-medium">Notification Preferences</Text>
									<Text className="text-sm text-muted-foreground">
										Manage how you receive notifications
									</Text>
								</View>
								<Button variant="outline" size="sm">
									<Text>Configure</Text>
								</Button>
							</View>
						</CardContent>
					</Card>

					{/* Account Statistics */}
					<Card>
						<CardHeader>
							<CardTitle>Account Statistics</CardTitle>
							<CardDescription>Your activity overview</CardDescription>
						</CardHeader>
						<CardContent className="gap-y-4">
							<View className="flex-row justify-between">
								<View className="flex-1 items-center">
									<Text className="text-2xl font-bold">0</Text>
									<Text className="text-sm text-muted-foreground">
										Registered Cars
									</Text>
								</View>
								<Separator orientation="vertical" className="mx-4" />
								<View className="flex-1 items-center">
									<Text className="text-2xl font-bold">0</Text>
									<Text className="text-sm text-muted-foreground">
										Claxons Sent
									</Text>
								</View>
								<Separator orientation="vertical" className="mx-4" />
								<View className="flex-1 items-center">
									<Text className="text-2xl font-bold">0</Text>
									<Text className="text-sm text-muted-foreground">
										Claxons Received
									</Text>
								</View>
							</View>
						</CardContent>
					</Card>

					{/* Account Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Account Actions</CardTitle>
							<CardDescription>Manage your account</CardDescription>
						</CardHeader>
						<CardContent className="gap-y-3">
							<Button variant="outline" onPress={handleSignOut}>
								<Text>Sign Out</Text>
							</Button>
							<Button variant="destructive" onPress={handleDeleteAccount}>
								<Text>Delete Account</Text>
							</Button>
						</CardContent>
					</Card>
				</View>
			</ScrollView>
		</Container>
	);
}
