import { useState } from "react";

export function usePasswordInput() {
  const [isValid, setIsValid] = useState(false);

  const validatePassword = (password: string) => {
    const isValidPassword = password.length >= 8;
    setIsValid(isValidPassword);
    return isValidPassword;
  };

  return {
    isValid,
    validatePassword,
  };
}
