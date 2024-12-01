// libs/roleUtils.ts
import { createClient } from "@/utils/supabase/client"
export async function getUserRole() {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user role:', error)
      return null
    }

    return data.role
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
}

export async function checkUserAccess(allowedRoles: string[]) {
  const userRole = await getUserRole()
  return userRole && allowedRoles.includes(userRole)
}