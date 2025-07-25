import { ScrollView, View } from "react-native";
import { Container, ErrorScreen } from "@/components/common";
import { ProfileAvatar } from "@/components/common/profile-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { isProfileComplete } from "@/lib/utils";
import AccountForm from "./form";
import useAccountScreen from "./hook";

export function AccountTab() {
  const {
    user,
    statistics,
    isPending,
    isLoading,
    error,
    statsLoading,
    isSubmitting,
    handleSignOut,
    handleTogglePhoneSharing,
    handleLanguageChange,
    handleEditProfile,
    handleNotificationSettings,
  } = useAccountScreen();

  // Show error state if user data failed to load
  if (error || !user) {
    return <ErrorScreen message="Failed to load profile data" />;
  }

  // Check if user profile is complete
  const profileComplete = isProfileComplete(user);

  return (
    <Container loading={isPending || isLoading}>
      <Container.TopText
        title="Account"
        subtitle={
          profileComplete ? "Manage your profile and preferences" : "Complete your profile to access all features"
        }
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-y-6">
          {/* Profile Card - Conditional rendering based on profile completion */}
          {profileComplete ? (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="gap-y-4">
                <View className="flex-row items-center gap-x-4">
                  <ProfileAvatar
                    avatar_url={user.avatar_url}
                    first_name={user.first_name}
                    last_name={user.last_name}
                    isMeLoading={isLoading}
                  />
                  <View className="flex-1">
                    <Text className="font-medium">
                      {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : "No name set"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">{user.email || "No email set"}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {user.gender ? user.gender : "Personal details not set"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Language: {user.language === "ro" ? "Romanian" : user.language === "ru" ? "Russian" : "English"}
                    </Text>
                  </View>
                </View>
                <Button onPress={handleEditProfile}>
                  <Text>Edit Profile</Text>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>Finish setting up your account to access all features</CardDescription>
              </CardHeader>
              <CardContent className="gap-y-4">
                <Button onPress={handleEditProfile} className="rounded-full">
                  <Text>Complete Profile Setup</Text>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings */}
          <AccountForm
            onPhoneToggle={handleTogglePhoneSharing}
            onLanguageChange={handleLanguageChange}
            isSubmitting={isSubmitting}
            onNotificationSettings={handleNotificationSettings}
          />

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent className="gap-y-4">
              <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold">{statsLoading ? "..." : statistics?.vehicleCount || 0}</Text>
                  <Text className="text-sm text-muted-foreground">Registered Cars</Text>
                </View>
                <Separator orientation="vertical" className="mx-4" />
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold">{statsLoading ? "..." : statistics?.claxonsSent || 0}</Text>
                  <Text className="text-sm text-muted-foreground">Claxons Sent</Text>
                </View>
                <Separator orientation="vertical" className="mx-4" />
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold">{statsLoading ? "..." : statistics?.claxonsReceived || 0}</Text>
                  <Text className="text-sm text-muted-foreground">Claxons Received</Text>
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
              <Button variant="destructive" onPress={handleSignOut} className="rounded-full">
                <Text>Sign Out</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </Container>
  );
}
