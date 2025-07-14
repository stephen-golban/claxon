import { memo, useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useGetMe } from "@/services/api/accounts";
import LoadingSkeleton from "./loading-skeleton";
import { getInitials } from "./util";

const ProfileAvatar = memo(() => {
  const me = useGetMe();

  // Memoize initials calculation - only recalculate when name data changes
  const initials = useMemo(() => {
    return getInitials(me.data?.first_name ?? null, me.data?.last_name ?? null);
  }, [me.data?.first_name, me.data?.last_name]);

  // Show loading skeleton only when user data is loading
  if (me.isLoading || me.isPending) {
    return <LoadingSkeleton />;
  }

  return (
    <Avatar alt="Profile Avatar" className="h-12 w-12">
      <AvatarFallback>
        <Text>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";

export { ProfileAvatar };
