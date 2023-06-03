"use client";

import { FullConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import Avatar from "@/app/components/Avatar";
import clsx from "clsx";

interface ConversationBoxProps {
  data: FullConversationType;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = data.messages.at(-1);
  const userEmail = session.data?.user?.email;
  const hasSeen = lastMessage?.seen?.some(({ email }) => email === userEmail);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avatar user={userEmail ? otherUser : null!} />
      <div className="min-w-0 flex-1">
        {userEmail ? (
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {data.name || otherUser?.name}
              </p>
              {lastMessage?.createdAt && (
                <p className="text-xs text-gray-400 font-light">
                  {format(new Date(lastMessage.createdAt), "p")}
                </p>
              )}
            </div>
            <p
              className={clsx(
                "truncate text-xs",
                hasSeen ? "text-gray-500" : "text-black font-medium"
              )}
            >
              {lastMessageText}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 font-light">Loading</p>
        )}
      </div>
    </div>
  );
};

export default ConversationBox;
