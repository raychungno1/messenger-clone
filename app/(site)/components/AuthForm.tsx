"use client";

import { useCallback, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "";
  const [isLoading, setIsLoading] = useState(false);

  // Form variant
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  // Auth functionality
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const authenticate: (...args: Parameters<typeof signIn>) => void = (
    provider,
    options,
    authorizationParams
  ) => {
    setIsLoading(true);
    signIn(provider, { ...options, redirect: false }, authorizationParams)
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
          return;
        }

        if (callback?.ok) {
          toast.success("Logged in!");
          router.push(callbackUrl);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (variant === "REGISTER") {
      setIsLoading(true);
      axios
        .post("/api/register", data)
        .then(() => authenticate("credentials", data))
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    } else if (variant === "LOGIN") {
      authenticate("credentials", data);
    }
  };

  const socialLogin = (action: string) => {
    setIsLoading(true);
    signIn(action, { callbackUrl });
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign In" : "Register"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-center">
              <span className="bg-white px-2 text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialLogin("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialLogin("google")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an acount" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
