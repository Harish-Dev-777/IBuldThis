"use client";
import { Id } from "@/convex/_generated/dataModel";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";

interface iAppProps {
  roomId: Id<"posts">;
  userId: string;
}

export function PostPresence({ roomId, userId }: iAppProps) {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return null;
  }

  return <PostPresenceInner roomId={roomId} userId={userId} />;
}

function PostPresenceInner({ roomId, userId }: iAppProps) {
  const presenceState = usePresence(api.presence, roomId, userId);

  if (!presenceState || presenceState.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        Viewing now
      </p>
      <div className="text-black">
        <FacePile presenceState={presenceState} />
      </div>
    </div>
  );
}
