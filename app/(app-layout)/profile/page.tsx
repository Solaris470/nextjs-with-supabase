"use client";

import { useEffect, useState } from "react";
import { Card, Button, Label, TextInput, Avatar } from "flowbite-react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useUserRole } from "@/context/userRoleContext";

export default function ProfilePage() {
  const supabase = createClient();
  const { role, loading: roleLoading } = useUserRole();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: "",
    full_name: "",
    email: "",
    role: "",
    profile_image: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, role, profile_image ,phone_number")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;

      setUser(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      // Generate a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `profiles/${user.id}/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const imageUrl = data.publicUrl;

      // Update user profile image in the database
      await supabase
        .from("users")
        .update({ profile_image: imageUrl })
        .eq("id", user.id);

      setUser((prev) => (prev ? { ...prev, profile_image: imageUrl } : null));
      setFormData((prev) => ({ ...prev, profile_image: imageUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
  
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
        })
        .eq("id", user.id);
  
      if (error) throw error;
  
      alert("Profile updated successfully!");
      setIsEditing(false);
      fetchUserProfile(); // ดึงข้อมูลใหม่
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating profile. Please try again.");
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container h-screen mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile</h2>
            <button onClick={() => setIsEditing(!isEditing)}>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
              </svg>
            </button>
          </div>

          <div className="flex justify-center relative">
            <Avatar size="xl" img={user?.profile_image} rounded />
            <input
              type="file"
              className="absolute w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>
          <form className="space-y-4" onSubmit={handleUpdateProfile}>
            <div>
              <Label htmlFor="email" className="font-bold text-md">
                Email
              </Label>
              <p>{formData.email}</p>
            </div>

            <div>
              <Label htmlFor="role" className="font-bold text-md">
                Role
              </Label>
              {formData.role !== "admin" ? (
                <p>{formData.role}</p>
              ) : (
                <TextInput
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              )}
            </div>

            <div className="">
              <Label htmlFor="full_name" className="font-bold text-md">
                Name
              </Label>
              {!isEditing ? (
                <p>{formData.full_name}</p>
              ) : (
                <div>
                  <TextInput
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              )}
            </div>

            <div className="">
              <Label htmlFor="phone_number" className="font-bold text-md">
                Phone Number
              </Label>
              {!isEditing ? (
                <p>{formData.phone_number}</p>
              ) : (
                <div>
                  <TextInput
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button type="submit" color="success">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  color="gray"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
}
