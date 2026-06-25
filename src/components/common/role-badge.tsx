import { Badge } from "@/components/ui/badge";
import { ROLE_VARIANT_MAP, DEFAULT_ROLE_VARIANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const variant = ROLE_VARIANT_MAP[role] ?? DEFAULT_ROLE_VARIANT;

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium border-0", variant, className)}
    >
      {role}
    </Badge>
  );
}
