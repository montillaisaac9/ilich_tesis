// components/ImageUploader.tsx
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';

interface ImgurData {
  link: string;      // URL de la imagen subida
  deletehash: string; // Hash para eliminar la imagen
}

interface ImgurResponse {
  data: ImgurData;
  success: boolean;
  status: number;
}

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [deleteHash, setDeleteHash] = useState<string>('');

  // Reemplaza con tu Client-ID de Imgur
  const IMGUR_CLIENT_ID = '3f9f759ca008161'; 
  // Opcional: si deseas asignar la imagen a un álbum, ingresa el hash del álbum, o déjalo vacío
  const ALBUM_HASH = 'TEST'; 

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    setLoading(true);

    // Crear un FormData para enviar el archivo
    const formData = new FormData();
    formData.append('image', file);
    if (ALBUM_HASH) {
      formData.append('album', ALBUM_HASH);
    }
    formData.append('type', 'file'); // Indica que es un archivo

    try {
      const response = await axios.post<ImgurResponse>(
        'https://api.imgur.com/3/image',
        formData,
        {
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
        }
      );

      if (response.data.success) {
        setImageUrl(response.data.data.link);
        setDeleteHash(response.data.data.deletehash);
      } else {
        alert('Error al subir la imagen. Intenta de nuevo.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error('Error al subir la imagen:', axiosError.response?.data || axiosError);
      alert(axiosError.response?.data?.error || 'Error al subir la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteHash) {
      alert('No se cuenta con el delete hash para eliminar la imagen.');
      return;
    }

    try {
      const response = await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      });

      if (response.data.success) {
        alert('Imagen eliminada correctamente.');
        setImageUrl('');
        setDeleteHash('');
      } else {
        alert('Error al eliminar la imagen.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error('Error al eliminar la imagen:', axiosError.response?.data || axiosError);
      alert(axiosError.response?.data?.error || 'Error al eliminar la imagen');
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Subir imagen a Imgur</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir imagen'}
        </button>
      </form>

      {imageUrl && (
        <div style={{ marginTop: '1rem' }}>
          <p>URL de la imagen:</p>
          <img src={imageUrl} alt="Imagen subida" style={{ maxWidth: '300px' }} />
          <div>
            <input type="text" value={imageUrl} readOnly style={{ width: '100%' }} />
          </div>
          <button onClick={handleDelete} style={{ marginTop: '0.5rem' }}>
            Eliminar imagen
          </button>
        </div>
      )}
    </div>
  );
}
