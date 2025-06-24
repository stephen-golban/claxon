import { useTranslation } from "@/hooks";
import type React from "react";

import { LoadingSpinner } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface ISubmitButton {
  onSubmit(): void;
  isDisabled?: boolean;
  isSubmitting?: boolean;
  title?: string;
  className?: string;
}

const SubmitButton: React.FC<ISubmitButton> = ({
  onSubmit,
  title,
  className,
  isDisabled = false,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      onPress={onSubmit}
      disabled={isSubmitting || isDisabled}
      className={cn("rounded-full", className)}
      size="lg"
    >
      {isSubmitting ? <LoadingSpinner inverse /> : <Text>{title || t("buttons:continue")}</Text>}
    </Button>
  );
};

export { SubmitButton };
