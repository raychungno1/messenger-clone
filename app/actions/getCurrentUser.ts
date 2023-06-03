import prisma from "@/app/libs/prismadb";

import getSession from "./getSession";

const getCurrentUser = async () => {
  const session = await getSession();
  if (!session?.user?.email) return null;

  try {
    return await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
