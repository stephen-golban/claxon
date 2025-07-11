import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FlatList, View } from "react-native";
import { z } from "zod";

import { SubmitButton, TextField } from "@/components/form-elements";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { VEHICLE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

// Mock alert templates
const mockTemplates = [
	{
		_id: "template_1",
		category: "complaint",
		message_en: "Please check your parking - you're blocking the entrance.",
		icon: "⚠️",
	},
	{
		_id: "template_2",
		category: "compliment",
		message_en: "Thank you for your excellent parking!",
		icon: "👍",
	},
	{
		_id: "template_3",
		category: "question",
		message_en: "Could you please move your car? I need to get out.",
		icon: "❓",
	},
	{
		_id: "template_4",
		category: "notification",
		message_en: "Your headlights are still on.",
		icon: "💡",
	},
];

const messageSchema = z.object({
	message: z
		.string()
		.min(1, "Message is required")
		.max(500, "Message too long"),
	type: z.enum(["custom", "template"]),
	template_id: z.string().optional(),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface MessageComposerProps {
	vehicle: SearchResult;
	onSend: () => void;
	onCancel: () => void;
}

export function MessageComposer({
	vehicle,
	onSend,
	onCancel,
}: MessageComposerProps) {
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"custom" | "template">(
		"template",
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<MessageFormData>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			message: "",
			type: "template",
			template_id: undefined,
		},
		mode: "onChange",
	});

	const getVehicleColor = (colorCode: string) => {
		return VEHICLE_COLORS.find((color) => color.code === colorCode);
	};

	const getOwnerDisplayName = (owner: SearchResult["owner"]) => {
		if (owner.first_name && owner.last_name) {
			return `${owner.first_name} ${owner.last_name}`;
		}
		return "Anonymous Owner";
	};

	const handleTemplateSelect = (template: (typeof mockTemplates)[0]) => {
		setSelectedTemplate(template._id);
		setMessageType("template");
		form.setValue("message", template.message_en);
		form.setValue("type", "template");
		form.setValue("template_id", template._id);
	};

	const handleCustomMessage = () => {
		setSelectedTemplate(null);
		setMessageType("custom");
		form.setValue("message", "");
		form.setValue("type", "custom");
		form.setValue("template_id", undefined);
	};

	const handleSend = async (data: MessageFormData) => {
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			console.log("Sending message:", {
				...data,
				vehicle_id: vehicle.vehicle._id,
				recipient_id: vehicle.owner._id,
				license_plate: vehicle.vehicle.plate_number,
			});

			setIsSubmitting(false);
			onSend();
		}, 1500);
	};

	const color = getVehicleColor(vehicle.vehicle.color);
	const ownerName = getOwnerDisplayName(vehicle.owner);

	const TemplateButton = ({
		template,
	}: {
		template: (typeof mockTemplates)[0];
	}) => (
		<Button
			variant={selectedTemplate === template._id ? "default" : "outline"}
			onPress={() => handleTemplateSelect(template)}
			className="rounded-full mb-2"
		>
			<Text className="text-sm">
				{template.icon} {template.category}
			</Text>
		</Button>
	);

	return (
		<FormProvider {...form}>
			<View className="flex-1 gap-4">
				{/* Vehicle Info Card */}
				<Card>
					<CardContent className="p-4">
						<View className="flex-row items-start gap-3">
							<Avatar
								alt={`${vehicle.vehicle.brand} ${vehicle.vehicle.model}`}
								className="h-12 w-12"
							>
								<AvatarFallback
									style={{ backgroundColor: color?.rgba || "#ccc" }}
								>
									<Text className="text-sm font-bold text-white">
										{vehicle.vehicle.brand.charAt(0)}
									</Text>
								</AvatarFallback>
							</Avatar>

							<View className="flex-1 gap-1">
								<Text className="font-semibold text-base">
									{vehicle.vehicle.brand} {vehicle.vehicle.model}
								</Text>
								<Text className="text-sm text-muted-foreground">
									{vehicle.vehicle.manufacture_year} •{" "}
									{color?.description || vehicle.vehicle.color}
								</Text>
								<Text className="text-sm font-medium">
									🇲🇩 {vehicle.vehicle.plate_number}
								</Text>
								<Text className="text-sm text-muted-foreground">
									To: {ownerName}
								</Text>
							</View>
						</View>
					</CardContent>
				</Card>

				{/* Message Type Selection */}
				<Card>
					<CardHeader>
						<CardTitle>Choose Message Type</CardTitle>
					</CardHeader>
					<CardContent className="gap-3">
						{/* Template Messages */}
						<View>
							<Text className="text-sm font-medium mb-3">Quick Templates</Text>
							<View className="flex-row flex-wrap gap-2">
								{mockTemplates.map((template) => (
									<TemplateButton key={template._id} template={template} />
								))}
							</View>
						</View>

						<Separator />

						{/* Custom Message */}
						<View>
							<View className="flex-row items-center justify-between mb-3">
								<Text className="text-sm font-medium">Custom Message</Text>
								<Button
									variant={messageType === "custom" ? "default" : "outline"}
									size="sm"
									onPress={handleCustomMessage}
									className="rounded-full"
								>
									<Text className="text-xs">Write Custom</Text>
								</Button>
							</View>

							{messageType === "custom" && (
								<TextField
									name="message"
									placeholder="Type your message here..."
									multiline
									numberOfLines={4}
								/>
							)}
						</View>
					</CardContent>
				</Card>

				{/* Message Preview */}
				{form.watch("message") && (
					<Card>
						<CardHeader>
							<CardTitle>Message Preview</CardTitle>
						</CardHeader>
						<CardContent>
							<View className="p-3 bg-muted rounded-lg">
								<Text className="text-sm">{form.watch("message")}</Text>
							</View>
						</CardContent>
					</Card>
				)}

				{/* Action Buttons */}
				<View className="flex-row gap-3">
					<View className="flex-1">
						<Button
							variant="outline"
							onPress={onCancel}
							disabled={isSubmitting}
							className="rounded-full"
						>
							<Text>Cancel</Text>
						</Button>
					</View>
					<View className="flex-1">
						<SubmitButton
							title="Send Message"
							onSubmit={form.handleSubmit(handleSend)}
							isSubmitting={isSubmitting}
							isDisabled={!form.formState.isValid || !form.watch("message")}
						/>
					</View>
				</View>
			</View>
		</FormProvider>
	);
}
