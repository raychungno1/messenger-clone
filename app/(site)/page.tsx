import Image from "next/image";
import { redirect } from "next/navigation";

import AuthForm from "./components/AuthForm";
import getSession from "../actions/getSession";
import { NextPage } from "next";
import { NextRequest } from "next/server";

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect("/conversations");
  }

  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height={48}
          width={48}
          className="mx-auto w-auto"
          src="/images/logo.png"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}
