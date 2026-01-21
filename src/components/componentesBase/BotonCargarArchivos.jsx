import React, { useState } from 'react';

//MUI
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const BotonCargarArchivos = ({label="Cargar archivos"}) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
    }
  };

  const removeFile = (fileName, lastModified) => {
    setFiles((prev) => prev.filter((file) => !(file.name === fileName && file.lastModified === lastModified)));
  };

  const clearAll = () => {
    setFiles([]);
  };

  return (
    <div>
      {/*Boton de cargar archivos*/}
      <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
        {label}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple />
      </Button>

      {/* Mostrar archivos cargados*/}
      {files.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Uploaded Files ({files.length}):</Typography>
            <Button size="small" onClick={clearAll} color="error">
              Clear All
            </Button>
          </div>

          <List dense>
            {files.map((file, index) => (
              <ListItem
                key={`${file.name}-${file.lastModified}-${index}`}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => removeFile(file.name, file.lastModified)} size="small">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default BotonCargarArchivos;
