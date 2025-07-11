import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { Pressable, View } from "react-native";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import type { ClaxonMessage } from "../types";

dayjs.extend(relativeTime);

interface MessageItemProps {
	message: ClaxonMessage;
	onPress: (message: ClaxonMessage) => void;
	onMarkAsRead?: (messageId: string) => void;
}

export function MessageItem({
	message,
	onPress,
	onMarkAsRead,
}: MessageItemProps) {
	const isReceived = message.isReceived;
	const displayContact = isReceived ? message.sender : message.recipient;
	const displayName =
		displayContact?.first_name && displayContact?.last_name
			? `${displayContact.first_name} ${displayContact.last_name}`
			: "Anonymous";

	const handlePress = () => {
		onPress(message);
		if (!message.read && onMarkAsRead) {
			onMarkAsRead(message._id);
		}
	};

	const timeAgo = dayjs(message._creationTime).fromNow();

	return (
		<Pressable
			onPress={handlePress}
			className={cn(
				"flex-row items-start gap-3 p-4",
				!message.read && "bg-muted/20",
				"active:bg-muted/40",
			)}
		>
			{/* Avatar */}
			<Avatar alt={displayName} className="h-10 w-10">
				<AvatarFallback>
					<Text className="text-sm font-medium">
						{displayName.charAt(0).toUpperCase()}
					</Text>
				</AvatarFallback>
			</Avatar>

			{/* Content */}
			<View className="flex-1 gap-1">
				{/* Header Row */}
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-2 flex-1">
						<Text
							className={cn(
								"font-medium text-sm",
								!message.read && "font-semibold",
							)}
						>
							{displayName}
						</Text>
						{!message.read && (
							<View className="h-2 w-2 bg-primary rounded-full" />
						)}
					</View>
					<Text className="text-xs text-muted-foreground">{timeAgo}</Text>
				</View>

				{/* License Plate */}
				<View className="flex-row items-center gap-2">
					<Text className="text-xs text-muted-foreground">
						{isReceived ? "📥" : "📤"} {message.license_plate}
					</Text>
					{message.template?.category && (
						<Badge variant="secondary" className="px-1.5 py-0.5">
							<Text className="text-xs">{message.template.category}</Text>
						</Badge>
					)}
				</View>

				{/* Message Preview */}
				<Text
					className={cn(
						"text-sm text-foreground mt-1",
						!message.read && "font-medium",
					)}
					numberOfLines={2}
				>
					{message.displayMessage}
				</Text>
			</View>
		</Pressable>
	);
}
