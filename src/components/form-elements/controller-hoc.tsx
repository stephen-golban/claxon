import type React from "react";
import { Controller, type ControllerProps, type FieldValues, type Path, useFormContext } from "react-hook-form";

/**
 * Creates a Higher Order Component that wraps form fields with react-hook-form Controller
 * @returns A function that takes a component and returns a new component with form control
 */

// biome-ignore lint/suspicious/noExplicitAny: any is used to allow for any type of event
function withController<P extends object, T extends FieldValues = any>(
  WrappedComponent: React.ComponentType<
    P & {
      // biome-ignore lint/suspicious/noExplicitAny: any is used to allow for any type of value
      value: any;
      // biome-ignore lint/suspicious/noExplicitAny: any is used to allow for any type of event
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      error?: string;
    }
  >,
) {
  // Return a new component
  return function WithController({
    control,
    name,
    ...props
  }: Omit<P, "value" | "onChange" | "onBlur" | "error"> & {
    control?: ControllerProps<T>["control"];
    name: Path<T>;
  }) {
    const formContext = useFormContext<T>();
    const controllerControl = control || formContext.control;

    if (!controllerControl) {
      throw new Error("withController must be used within a FormProvider or with a control prop");
    }

    return (
      <Controller
        name={name}
        control={controllerControl}
        render={({ field, fieldState }) => (
          <WrappedComponent
            {...(props as P)}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  };
}

export { withController };
