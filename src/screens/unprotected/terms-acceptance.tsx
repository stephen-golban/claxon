import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Trans } from "react-i18next";
import {
	BottomSheet,
	BottomSheetContent,
	useBottomSheet,
} from "@/components/ui/bottom-sheet";
import { Text } from "@/components/ui/text";
import { useTranslation } from "@/hooks";
import { cn } from "@/lib/utils";

export default function TermsAcceptance({
	type,
	center = true,
}: {
	type: "login" | "signup";
	center?: boolean;
}) {
	const { t } = useTranslation();
	const bottomSheet = useBottomSheet();
	const [opened, setOpened] = React.useState<"terms" | "privacy" | null>(null);

	const snapPoints = React.useMemo(() => ["90%"], []);

	const handleOpenTerms = () => {
		bottomSheet.open();
		setOpened("terms");
	};

	const handleOpenPrivacy = () => {
		bottomSheet.open();
		setOpened("privacy");
	};

	return (
		<>
			<Text className={cn("text-primary", center && "text-center")}>
				<Trans
					i18nKey={`getStarted:terms-${type}.text`}
					components={{
						text: <Text className="text-primary" />,
						termsLink: (
							<Text
								className="text-primary font-bold"
								onPress={handleOpenTerms}
							/>
						),
						privacyLink: (
							<Text
								className="text-primary font-bold"
								onPress={handleOpenPrivacy}
							/>
						),
					}}
				/>
			</Text>

			<BottomSheet>
				<BottomSheetContent
					ref={bottomSheet.ref}
					snapPoints={snapPoints}
					enablePanDownToClose
					enableContentPanningGesture
				>
					<BottomSheetScrollView
						className="px-6"
						contentContainerClassName="flex-grow pb-10"
						showsVerticalScrollIndicator={true}
					>
						<Text className="text-foreground text-2xl font-semibold text-center mb-4">
							{opened === "terms"
								? t(`getStarted:terms-${type}:termsOfUse`)
								: t(`getStarted:terms-${type}:privacyPolicy`)}
						</Text>

						<Text className="text-muted-foreground text-base leading-relaxed">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
							voluptatum voluptatem doloremque Lorem ipsum dolor sit amet
							consectetur adipisicing elit. Ipsum, alias ipsa. Nulla dolor
							officia impedit dolores voluptate ut velit, consequatur expedita
							dolorem ex rem, quam at eum error? Ab, earum! Lorem ipsum dolor
							sit amet consectetur adipisicing elit. Expedita magnam
							consequuntur harum nemo praesentium in error maxime inventore
							laborum pariatur! Rerum mollitia pariatur iste eum hic quia,
							itaque enim laudantium. Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Quisquam voluptatum voluptatem doloremque Lorem
							ipsum dolor sit amet consectetur adipisicing elit. Ipsum, alias
							ipsa. Nulla dolor officia impedit dolores voluptate ut velit,
							consequatur expedita dolorem ex rem, quam at eum error? Ab, earum!
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
							magnam consequuntur harum nemo praesentium in error maxime
							inventore laborum pariatur! Rerum mollitia pariatur iste eum hic
							quia, itaque enim laudantium. Lorem ipsum dolor sit amet
							consectetur adipisicing elit. Quisquam voluptatum voluptatem
							doloremque Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Ipsum, alias ipsa. Nulla dolor officia impedit dolores
							voluptate ut velit, consequatur expedita dolorem ex rem, quam at
							eum error? Ab, earum! Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Expedita magnam consequuntur harum nemo
							praesentium in error maxime inventore laborum pariatur! Rerum
							mollitia pariatur iste eum hic quia, itaque enim laudantium. Lorem
							ipsum dolor sit amet consectetur adipisicing elit. Quisquam
							voluptatum voluptatem doloremque Lorem ipsum dolor sit amet
							consectetur adipisicing elit. Ipsum, alias ipsa. Nulla dolor
							officia impedit dolores voluptate ut velit, consequatur expedita
							dolorem ex rem, quam at eum error? Ab, earum! Lorem ipsum dolor
							sit amet consectetur adipisicing elit. Expedita magnam
							consequuntur harum nemo praesentium in error maxime inventore
							laborum pariatur! Rerum mollitia pariatur iste eum hic quia,
							itaque enim laudantium. Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Quisquam voluptatum voluptatem doloremque Lorem
							ipsum dolor sit amet consectetur adipisicing elit. Ipsum, alias
							ipsa. Nulla dolor officia impedit dolores voluptate ut velit,
							consequatur expedita dolorem ex rem, quam at eum error? Ab, earum!
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
							magnam consequuntur harum nemo praesentium in error maxime
							inventore laborum pariatur! Rerum mollitia pariatur iste eum hic
							quia, itaque enim laudantium.
						</Text>
					</BottomSheetScrollView>
				</BottomSheetContent>
			</BottomSheet>
		</>
	);
}
