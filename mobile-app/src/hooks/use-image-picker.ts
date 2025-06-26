import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export const useImagePicker = () => {
	const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

	const handlePick = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				...{
					quality: 1,
					base64: false,
					allowsEditing: true,
					mediaTypes: ["images"],
				},
			});

			if (!result.canceled && result.assets[0]) {
				const pickedImage = result.assets[0];

				setImage(pickedImage);
				return pickedImage;
			}
		} catch (error) {
			console.error(error);
		}
	};

	return {
		image,
		handlePick,
	};
};
