"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const fullname = formData.get("fullname")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Step 1: Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  // Step 2: Check for sign-up errors
  if (error) {
    console.error(error.code + " " + error.message);
    return { error: error.message };
  }

  // Step 3: Capture and log the userId if sign-up is successful
  const userId = data.user?.id; // This is the new user's ID
  console.log("New user signed up with userId:", userId);

  // Step 4: Optionally store the userId in your database
  if (userId) {
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: userId, // Use the captured userId here
          full_name: fullname,
          email: email,
        },
      ]);

    if (insertError) {
      console.error("Error adding user to database:", insertError.message);
      return { error: "Error adding user to database" };
    }
  }

  // Step 5: Redirect to sign-in page with success message
  return encodedRedirect(
    "success",
    "/sign-in",
    "สมัครสมาชิกเสร็จสิ้น โปรดยืนยันอีเมล"
  );
};


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const fetchUserRole = async () => {
    const { data: user } = await supabase.auth.getUser();
    
  }

  if (error) {
    return encodedRedirect("error", "/sign-in", "อีเมลหรือรหัสผ่านผิด");
  }

  return redirect("/task");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
