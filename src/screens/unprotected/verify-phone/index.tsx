import { View } from "react-native";
import { Container } from "@/components/common";
import { OtpField } from "@/components/form-elements";
import { Text } from "@/components/ui/text";

import { useTranslation } from "@/hooks";
import { formatPhoneNumber } from "@/lib/utils";
import { useVerifyPhoneScreen } from "./hook";
import OtpResend from "./otp-resend";

interface IVerifyPhoneScreen {
	phone: string;
}

export default function VerifyPhoneScreen({ phone }: IVerifyPhoneScreen) {
	const { t } = useTranslation();
	const { control, isSubmitting, handleSubmit, reset } =
		useVerifyPhoneScreen(phone);

	const formattedPhone = formatPhoneNumber(phone);

	return (
		<Container loading={isSubmitting}>
			<Container.TopText
				title={t("verificationCode:sentNewline")}
				subtitle={t("verificationCode:sent", { phone: formattedPhone })}
			/>

			<Text className="mt-4 text-3xl font-bold text-dark dark:text-light">
				{t("verificationCode:code")}
			</Text>

			<View className="mt-4 flex-1">
				<OtpField name="otp" control={control} onFilled={handleSubmit} />
				<OtpResend phone={phone} onResend={() => reset({ otp: "" })} />
			</View>
		</Container>
	);
}
