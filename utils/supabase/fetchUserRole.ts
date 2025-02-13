import { createClient } from "@/utils/supabase/client";

export async function fetchUserRole(userId: string): Promise<string | null> {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
  
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  
    return data?.role || null;
  }