import { supabase, Photo } from './supabase';

export async function getPhotos() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }

  return data as Photo[];
}

export async function uploadPhoto(file: File, title: string, description: string, category: string) {
  if (!supabase) {
    return null;
  }

  // Upload image to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('photos')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('photos')
    .getPublicUrl(fileName);

  // Save photo metadata to database
  const date = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  const { data: photoData, error: dbError } = await supabase
    .from('photos')
    .insert([
      {
        title,
        description,
        image_url: publicUrl,
        category,
        date
      }
    ])
    .select()
    .single();

  if (dbError) {
    console.error('Error saving photo metadata:', dbError);
    return null;
  }

  return photoData as Photo;
}

export async function deletePhoto(photoId: string, imageUrl: string) {
  if (!supabase) {
    return false;
  }

  try {
    // Delete from database
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (dbError) {
      console.error('Error deleting photo from database:', dbError);
      return false;
    }

    // Delete from storage (extract filename from URL)
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase
        .storage
        .from('photos')
        .remove([fileName]);

      if (storageError) {
        console.error('Error deleting photo from storage:', storageError);
        // Continue even if storage deletion fails
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
}