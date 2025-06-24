export const SKELETON_CLASSES = "aspect-square h-full w-full rounded-full animate-pulse" as const;

// Utility function to generate initials - extracted and optimized
export const getInitials = (firstName = "", lastName = "") => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};
