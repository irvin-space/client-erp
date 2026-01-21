import React, { useState } from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Componentes del proyecto
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import FirstComponent from './FirstComponent';
import RadioButtonsGroup from './RadioButtonsGroup';

//Ant-design
import { EditOutlined } from '@ant-design/icons';

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

const ImprimirFacturaDeVentas = ({isEnable}) => {
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
      <Button variant="outlined" onClick={handleOpen} startIcon={<EditOutlined />}>
        Imprimir
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '25vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #00345D',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4
          }}
        >
          {/* Titulo */}
          <Box sx={{ marginBottom: '15px', backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h4">Impresión de Facturas de Venta</Typography>
          </Box>
          <Divider sx={{mb:2}}/>
          {/* Factura, Cliente, Importe Original, Saldo Actual, Fecha */}
          <Grid container spacing={2} sx={{ mb: 2, backgroundColor: ''}}>
            <Grid size={6} sx={{ backgroundColor: '' }}>
              <TextField label='Factura'/>
            </Grid>
            <Grid size={6} sx={{ backgroundColor: '' }}>
              <TextField label='Fecha'/>
            </Grid>
            <Grid size={12} sx={{ backgroundColor: '' }}>
              <TextField fullWidth label='Cliente'/>
            </Grid>
            <Grid size={12} sx={{ backgroundColor: '' }}>
              <TextField label='Importe Original'/>
            </Grid>
            <Grid size={12} sx={{ backgroundColor: '' }}>
              <TextField label='Saldo Actual'/>
            </Grid>
          </Grid>
          {/*Salida del Reporte*/}
          <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'center' }} container spacing={2}>
            <Grid sx={{ backgroundColor: '' }} size={8}>
              <ComponenteListaDinamica
                label="Salida del Reporte"
                instruccionSQL="combo_sucursales"
                valueKey="sucursal"
                labelKey="nombre_sucursal"
                retornaObjeto={false}
                parametros={{ '@cCentro': "'      1'" }}
                // value= sucursal
              />
            </Grid>
          </Grid>
          {/* Botones */}
          <Grid container>
            <Grid sx={{ display: 'flex', justifyContent: 'space-around' }} size={12}>
              <Button variant="contained">Aceptar</Button>
              <Button variant="contained" color="secondary">
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ImprimirFacturaDeVentas;
