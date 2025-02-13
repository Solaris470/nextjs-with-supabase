import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default function Signup({ searchParams }: { searchParams: Message }) {
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="border p-8 rounded-lg flex flex-col min-w-64 max-w-64 mx-auto bg-white shadow-xl">
        <h1 className="text-2xl mb-4 font-medium mx-auto">Create an Account</h1>
        <p className="text-sm text-gray-500 mx-auto">
          Create a account to continue
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label className="text-gray-600" htmlFor="fullname">Full Name</Label>
          <Input name="fullname" placeholder="Enter your name" required />
          <Label className="text-gray-600" htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label className="text-gray-600" htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton className="bg-blue-500 text-white" formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <p className="text-sm text-gray-500 mx-auto">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 font-medium underline">
              Sign in
            </Link>
          </p>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
