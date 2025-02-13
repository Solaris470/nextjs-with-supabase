import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <>
        <form className="border p-8 rounded-lg flex-1 flex flex-col bg-white shadow-xl">
          <h1 className="text-2xl mb-4 font-medium mx-auto">Login to Account</h1>
          <p className="text-sm text-foreground text-gray-500">
            Please enter your email and password to continue
          </p>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label className="text-gray-600" htmlFor="email">Email Adress:</Label>
            <Input name="email" placeholder="you@example.com" required />
            <div className="flex justify-between items-center">
              <Label className="text-gray-600" htmlFor="password">Password</Label>
              {/* <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link> */}
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
            <SubmitButton className="bg-blue-500 text-white" pendingText="Signing In..." formAction={signInAction}>
              Sign in
            </SubmitButton>
            <p className="text-sm text-foreground mx-auto text-gray-500">
              Don't have an account?{" "} 
              <Link className="text-foreground font-medium underline text-blue-600" href="/sign-up">
                Create Account
              </Link>
            </p>
            <FormMessage message={searchParams} />
          </div>
        </form>
    </>
  );
}
