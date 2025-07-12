import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SKELETON_CLASSES } from "./util";

const LoadingSkeleton = memo(() => (
  <Avatar alt="Profile Avatar" className="h-12 w-12">
    <AvatarFallback>
      <Skeleton className={SKELETON_CLASSES} />
    </AvatarFallback>
  </Avatar>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
