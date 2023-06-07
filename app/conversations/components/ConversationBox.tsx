"use client";

import { FullConversationType, FullMessageType } from "@/app/types";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useSession } from "next-auth/react";
import Avatar from "@/app/components/Avatar";
import clsx from "clsx";
import { Session } from "next-auth";
import { useMemo } from "react";

interface ConversationBoxProps {
  session: Session;
  data: FullConversationType;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  session,
  data,
  selected,
}) => {
  const router = useRouter();

  const lastMessage = data.messages.at(-1);
  const userEmail = session?.user?.email;
  const hasSeen = lastMessage?.seen?.some(({ email }) => email === userEmail);
  const otherUser = useMemo(() => {
    return data.users.filter((user) => user.email !== userEmail)[0];
  }, [data.users, userEmail]);

  return (
    <div
      onClick={() => router.push(`/conversations/${data.id}`)}
      className={clsx(
        "relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition hover:bg-neutral-100",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {data.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs font-light text-gray-400">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "truncate text-xs",
              hasSeen ? "text-gray-500" : "font-medium text-black"
            )}
          >
            {lastMessageText(lastMessage)}
          </p>
        </div>
      </div>
    </div>
  );
};

const lastMessageText = (lastMessage?: FullMessageType) => {
  if (lastMessage?.image) return "Sent an image";
  if (lastMessage?.body) return lastMessage.body;
  return "Started a conversation";
};

export default ConversationBox;
