import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  export const fetchDataById = async (id: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('to_do') // ชื่อ Table ใน Supabase
      .select('*') // ฟิลด์ที่ต้องการดึง
      .eq('id', id)
      .single(); // ต้องการข้อมูลแค่ 1 รายการ
  
    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
    return data;
  };