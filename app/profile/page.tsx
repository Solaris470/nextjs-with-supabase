'use client'

import { useEffect, useState } from 'react';
import { Card, Button, Label, TextInput, Avatar } from 'flowbite-react';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useUserRole } from '@/context/userRoleContext';

export default function ProfilePage() {
    const supabase = createClient();
    const { role, loading: roleLoading } = useUserRole();
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
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;
            
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name, email, role, profile_image')
                .eq('id', currentUser.id)
                .single();

            if (error) throw error;

            setUser(data);
            setFormData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);

        try {
            // Generate a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `profiles/${user.id}/${fileName}`;

            // Upload file
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const imageUrl = data.publicUrl;

            // Update user profile image in the database
            await supabase.from('users').update({ profile_image: imageUrl }).eq('id', user.id);
            
            setUser(prev => (prev ? { ...prev, profile_image: imageUrl } : null));
            setFormData(prev => ({ ...prev, profile_image: imageUrl }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }
    if (roleLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">Loading role...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Profile</h2>
                        <Button color={isEditing ? "gray" : "blue"} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
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
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="full_name">Full Name</Label>
                            <TextInput id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} disabled={!isEditing} required />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <TextInput id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} required />
                        </div>
                        
                        <div>
                            <Label htmlFor="role">Role</Label>
                            {formData.role !== 'admin' ? (
                                <p>{formData.role}</p>
                            ) : (
                                <TextInput id="role" name="role" value={formData.role} onChange={handleInputChange} disabled={!isEditing} required />
                            )}
                        </div>

                        {isEditing && <Button type="submit" color="success">Save Changes</Button>}
                    </form>
                </div>
            </Card>
        </div>
    );
}
