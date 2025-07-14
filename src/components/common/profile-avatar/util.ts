export const SKELETON_CLASSES = "aspect-square h-full w-full rounded-full animate-pulse" as const;

// Utility function to generate initials - supports fallback for new users
export const getInitials = (firstName: string | null, lastName: string | null): string => {
  // If both names are available, use them
  if (firstName && lastName) {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  // If only first name is available
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }

  // If only last name is available
  if (lastName) {
    return lastName.charAt(0).toUpperCase();
  }

  // Fallback for new users with no name set
  return "U";
};
