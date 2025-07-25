import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { getSupabaseErrorCode, printError, translateError } from "@/lib/utils";
import { pushNotificationService } from "../notifications/push-notifications";
import { supabase } from "./client";

export class AuthService {
  /**
   * Authenticates a user via phone number by sending an OTP
   * @param phone The phone number to authenticate
   * @returns The authentication data
   * @throws Error if the authentication fails
   */
  async authenticate(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: "sms" },
    });

    if (error) {
      printError("auth-authenticate-error", error);
      throw getSupabaseErrorCode(error);
    }

    return data;
  }

  /**
   * Resends an OTP to the user's phone number
   * @param phone The phone number to resend the OTP to
   * @returns The OTP data
   * @throws Error if the OTP cannot be resent
   */
  async resendCode(phone: string) {
    const { data, error } = await supabase.auth.resend({
      phone,
      type: "sms",
    });

    if (error) {
      printError("auth-resendCode-error", error);
      throw getSupabaseErrorCode(error);
    }

    return data;
  }

  /**
   * Verifies an OTP code sent to the user's phone
   * @param params Object containing phone number and verification code
   * @returns Authentication data with user profile
   * @throws Error if verification fails or user not found
   */
  async verifyCode({ phone, code }: { phone: string; code: string }) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });

    if (error) {
      printError("auth-verifyCode-error", error);
      throw getSupabaseErrorCode(error);
    }

    // Register push token after successful authentication
    if (data.user?.id) {
      // Run push token registration in background - don't block auth flow
      pushNotificationService.storePushToken(data.user.id).catch((error) => {
        printError("auth-verifyCode-pushToken-error", error);
      });
    }

    return data;
  }
}

const authService = new AuthService();
// ============================================================================
// HOOKS
// ============================================================================

export const useAuthenticate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.authenticate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    mutationKey: ["auth", "authenticate"],
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useResendCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.resendCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    mutationKey: ["auth", "resendCode"],
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};

export const useVerifyCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.verifyCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    mutationKey: ["auth", "verifyCode"],
    onError: (error) => {
      toast.error(translateError(error.message));
    },
  });
};
