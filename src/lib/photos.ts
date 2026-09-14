import { supabase, Photo } from './supabase';

// Função para comprimir imagem no lado do cliente
export async function compressImage(file: File, maxWidth: number = 600, quality: number = 0.92): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      console.log('Imagem original:', file.size, 'bytes', img.width, 'x', img.height);
      
      // Calcula novas dimensões mantendo aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Desenha a imagem comprimida
      ctx?.drawImage(img, 0, 0, width, height);

      // Converte para blob com qualidade reduzida
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            console.log('Imagem comprimida:', compressedFile.size, 'bytes', width, 'x', height);
            console.log('Redução:', ((file.size - compressedFile.size) / file.size * 100).toFixed(1), '%');
            resolve(compressedFile);
          } else {
            reject(new Error('Falha ao comprimir imagem'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Falha ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
}

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

  // Comprime a imagem antes de fazer upload
  const compressedFile = await compressImage(file, 400, 0.7);

  // Upload da imagem comprimida para Supabase Storage
  const fileName = `${Date.now()}-${compressedFile.name}`;
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('photos')
    .upload(fileName, compressedFile);

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