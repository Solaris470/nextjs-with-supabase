'use client'
// types/user.ts
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  profile_image: string;
}

// pages/profile.tsx
import { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Avatar } from 'flowbite-react';
import { createClient } from '@/utils/supabase/client';

export default function ProfilePage() {
    const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: '',
    full_name: '',
    email: '',
    role: '',
    profile_image: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, email, role, profile_image')
          .eq('id', currentUser.id)
          .single();

        if (error) throw error;

        setUser(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          profile_image: formData.profile_image
        })
        .eq('id', user?.id);

      if (error) throw error;

      setUser(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error instanceof Error ? error.message : 'Unknown error');
      alert('Error updating profile. Please try again.');
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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile</h2>
            <Button
              color={isEditing ? "gray" : "blue"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="flex justify-center">
            <Avatar
              size="xl"
              img={user?.profile_image}
              rounded
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <TextInput
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <TextInput
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <Label htmlFor="profile_image">Profile Image URL</Label>
              <TextInput
                id="profile_image"
                name="profile_image"
                value={formData.profile_image}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <Button type="submit" color="success">
                Save Changes
              </Button>
            )}
          </form>
        </div>
      </Card>
    </div>
  );
}