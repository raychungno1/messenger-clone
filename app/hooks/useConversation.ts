import { useParams } from "next/navigation";

const useConversation = () => {
  const { conversationId = "" } = useParams();
  return { conversationId, isOpen: !!conversationId };
};

export default useConversation;
