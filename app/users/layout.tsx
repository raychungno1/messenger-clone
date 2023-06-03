import Sidebar from "../components/sidebar/Sidebar";

const UsersLayout = async ({ children }: React.PropsWithChildren) => {
  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">{children}</div>
    </Sidebar>
  );
};

export default UsersLayout;
