import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";
import { SKELETON_CLASSES } from "./util";

const LoadingSkeleton = memo(() => (
  <Avatar alt="Profile Avatar">
    <AvatarFallback>
      <Skeleton className={SKELETON_CLASSES} />
    </AvatarFallback>
  </Avatar>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
