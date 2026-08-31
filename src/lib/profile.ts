import { supabase } from './supabase';

export async function uploadProfilePhoto(file: File, userId: string): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  try {
    // Upload image to Supabase Storage in profile-photos bucket
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('profile-photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading profile photo:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in profile photo upload:', error);
    return null;
  }
}

export async function updateUserProfilePhoto(userId: string, photoUrl: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ profile_image_url: photoUrl })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile photo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in update profile photo:', error);
    return false;
  }
}

export async function updateProfilePhoto(file: File, userId: string): Promise<string | null> {
  // Upload the photo
  const photoUrl = await uploadProfilePhoto(file, userId);
  
  if (!photoUrl) {
    return null;
  }

  // Update user record with new photo URL
  const success = await updateUserProfilePhoto(userId, photoUrl);
  
  if (!success) {
    return null;
  }

  return photoUrl;
}
