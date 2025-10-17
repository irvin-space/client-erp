import React, { useState, useCallback } from 'react';
import { Button, Box, Typography, Input } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// ------------------------------------------------------------------
// Función utilitaria para convertir el archivo a Base64
// Esto es un proceso asíncrono.
// ------------------------------------------------------------------
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // Solo tomamos la data Base64
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// ------------------------------------------------------------------
// Componente principal
// ------------------------------------------------------------------
const FileUploader = ({ onFileProcessed, tipo }) => {
  const [fileName, setFileName] = useState('');
  const [loadingg, setLoadingg] = useState(false);

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // 1. Mostrar nombre y tipo de carga
    setFileName(file.name);
    setLoadingg(true);

    try {
      // 2. Convertir el archivo a Base64
      const base64String = await fileToBase64(file);

      // 3. Crear el objeto de datos (payload)
      const fileData = {
        name: file.name,
        mimeType: file.type,
        base64: base64String,
      };

      // 4. Ejecutar el callback que enviará la data al componente padre
      onFileProcessed(fileData);

    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      // Puedes usar un mensaje('error', ...) aquí
    } finally {
      setLoadingg(false);
      file = '';
    }
  }, [onFileProcessed]);

  return (
    <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<UploadFileIcon />}
        disabled={loadingg}
      >
        {loadingg ? 'Procesando...' : 'Cargar Archivo (PDF/JPG)'}
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Button>
      {fileName && (
        <Typography variant="body2" sx={{ mt: 1, color: loadingg ? 'orange' : 'text.primary' }}>
          Archivo Seleccionado: **{fileName}**
        </Typography>
      )}
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
        Formatos aceptados: PDF, JPG, PNG.
      </Typography>
    </Box>
  );
};

export default FileUploader;