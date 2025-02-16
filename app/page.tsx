import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default async function Index() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();


  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      This is Home page <a href="/sign-in" className="text-blue-500">Please Login </a>
    </>
  );
}
