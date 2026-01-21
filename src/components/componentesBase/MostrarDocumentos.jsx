import React, { useState } from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Componentes del proyecto
import MuiTablaBase from './MuiTablaBase';
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import FirstComponent from './FirstComponent';
import RadioButtonsGroup from './RadioButtonsGroup';

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     // border: '2px solid #000',
//     border: '2px solid purple',
//     boxShadow: 24,
//     p: 4,
// };

const MostrarDocumentos = () => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Mostrar Documentos
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '50vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #00345D',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4
          }}
        >
          {/* Titulo */}
          <Box sx={{ marginBottom: '15px', backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h5">Documentos Ligados a Conceptos de Factura</Typography>
          </Box>
          {/* Tramite */}
          <Box sx={{ mb: 2 }}>
            <TextField label="Trámite" variant="outlined" />
          </Box>
          {/* Tabla */}
          <Grid
            container
            spacing={2}
            sx={{ mb: 2, backgroundColor: 'lightgreen', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
          >
            <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{ backgroundColor: 'pink' }}>
              <MuiTablaBase
                estructuraEncabezados={[
                  { propiedad: 'test1', encabezadoTitulo: 'Fact. Prov' },
                  { propiedad: 'test2', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'test3', encabezadoTitulo: 'Nombre Concepto' },
                  { propiedad: 'test4', encabezadoTitulo: 'Extensión' }
                ]}
              />
            </Grid>
          </Grid>
          {/*Descripcion/Comentarios*/}
          <Grid container spacing={2}>
            <Grid sx={{ backgroundColor: '' }} size={6}>
              <TextField label="Descripción" variant="outlined" multiline rows={3} fullWidth />
            </Grid>
            <Grid sx={{ backgroundColor: '' }} size={6}>
              <TextField label="Comentarios" variant="outlined" multiline rows={3} fullWidth />
            </Grid>
          </Grid>
          {/* Boton */}
          <Grid sx={{ mt: 2 }} container>
            <Grid size={12}>
              <Button variant="contained">Continuar</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default MostrarDocumentos;
