import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { ERROR_CODES } from "@/lib/constants";
import { printError, translateError } from "@/lib/utils";
import { AccountService } from "./accounts";
import { supabase } from "./client";

export class AuthService {
  private account: AccountService;

  constructor() {
    this.account = new AccountService();
  }

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
      throw new Error(ERROR_CODES.AUTH.AUTHENTICATION_FAILED);
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
      throw new Error(ERROR_CODES.AUTH.RESEND_CODE_FAILED);
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
      throw new Error(ERROR_CODES.AUTH.VERIFY_CODE_FAILED);
    }

    if (!data || !data.user) {
      printError("auth-verifyCode-error", new Error("User not found"));
      throw new Error(ERROR_CODES.USER.NOT_FOUND);
    }

    const body = { id: data.user.id, phone: data.user.phone || phone };

    const accountService = new AccountService();
    const account = await accountService.upsert(body, data.user.id);
    return { ...data, account };
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
