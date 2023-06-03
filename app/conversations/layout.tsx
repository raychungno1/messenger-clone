import getConversations from "../actions/getConversations";
import getSession from "../actions/getSession";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getSession();
  const conversations = await getConversations();

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList session={session!} initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
