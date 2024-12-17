import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const fetchDataById = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks") // ชื่อ Table ใน Supabase
    .select(
      `
        id,
        to_do_name,
        description,
        status,
        priority,
        start_date,
        end_date,
        assigned_by:to_do_assigned_by_fkey(id, full_name), 
        assigned_to:to_do_assigned_to_fkey(id, full_name), 
        completed_date,
        attachments,
        created_at,
        updated_at
      `
    ) // ฟิลด์ที่ต้องการดึง
    .eq("id", id)
    .single(); // ต้องการข้อมูลแค่ 1 รายการ

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
  return data;
};
