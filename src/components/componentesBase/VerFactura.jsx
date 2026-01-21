import React, { useState } from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
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
import ImprimirFacturaDeVentas from './ImprimirFacturaDeVentas';
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

const VerFactura = ({ isEnable }) => {
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
      <Button disabled={!isEnable} variant="outlined" onClick={handleOpen} startIcon={<EditOutlined />}>
        Ver Factura
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            height: '80vh',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '60vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #00345D',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4,
            overflow: 'auto'
          }}
        >
          {/* Titulo */}
          <Box sx={{ marginBottom: '15px', backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h4">Facturas de Ventas</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Mensaje */}
          {/* <Box>
            <Typography sx={{ mb: 2 }} variant="h5">
              Este proceso requiere de una Clave de Autorización para continuar
            </Typography>
            <Typography sx={{ mb: 2 }} variant="h5">
              Autorización de Proceso: <span>Modificar conceptos de un Trámite Aduanal</span>
            </Typography>
          </Box> */}
          {/* Sucursal, Factura, Cliente, F.Interno, F.Factura, F.Vencimiento, Moneda, Tipo de Cambio, Agente, Estado Actual, Comentarios de la Factura */}
          <Grid container spacing={2} sx={{ mb: 2, backgroundColor: '', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Grid container size={8} sx={{ backgroundColor: '' }}>
              <Grid size={3}>
                <TextField label="Sucursal" />
              </Grid>
              <Grid size={3}>
                <TextField label="F.Interno" />
              </Grid>
              <Grid size={3}>
                <TextField label="Tipo de Cambio" />
              </Grid>
              <Grid size={3}>
                <TextField label="Factura" />
              </Grid>
              <Grid size={3}>
                <TextField label="F.Vencimiento" />
              </Grid>
              <Grid size={3}>
                <TextField label="Agente" />
              </Grid>
              <Grid size={3}>
                <TextField label="Cliente" />
              </Grid>
              <Grid size={3}>
                <TextField label="Moneda" />
              </Grid>
              <Grid size={3}>
                <TextField label="Estado Actual" />
              </Grid>
            </Grid>
            <Grid size={4} sx={{ backgroundColor: '' }}>
              <TextField fullWidth label="Comentarios" multiline rows={6} />
            </Grid>
          </Grid>
          {/*Tablas*/}
          <Grid sx={{ mb: 6, display: 'flex', justifyContent: 'center' }} container spacing={4}>
            <Grid sx={{ backgroundColor: '' }} size={12}>
              <Typography variant="h5">Ingresos Agengcia Aduanal</Typography>
              <MuiTablaBase
                estructuraEncabezados={[
                  { propiedad: 'test1', encabezadoTitulo: 'Trámite' },
                  { propiedad: 'test1', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'test1', encabezadoTitulo: 'Nombre Concepto' },
                  { propiedad: 'test1', encabezadoTitulo: 'Moneda' },
                  { propiedad: 'test1', encabezadoTitulo: 'Cant.' },
                  { propiedad: 'test1', encabezadoTitulo: 'Importe M.N.' },
                  { propiedad: 'test1', encabezadoTitulo: 'Importe M.E.' }
                ]}
              />
            </Grid>
            <Grid sx={{ backgroundColor: '' }} size={12}>
              <Typography variant="h5">Gastos por cuenta del cliente</Typography>
              <MuiTablaBase
                estructuraEncabezados={[
                  { propiedad: 'test1', encabezadoTitulo: 'Trámite' },
                  { propiedad: 'test1', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'test1', encabezadoTitulo: 'Nombre Concepto' },
                  { propiedad: 'test1', encabezadoTitulo: 'Moneda' },
                  { propiedad: 'test1', encabezadoTitulo: 'Cant.' },
                  { propiedad: 'test1', encabezadoTitulo: 'Importe M.N.' },
                  { propiedad: 'test1', encabezadoTitulo: 'Importe M.E.' }
                ]}
              />
            </Grid>
          </Grid>
          {/*  */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label="Saldo Actual" />
              <TextField label="SubTotal Ingresos" />
              <TextField label="I.V.A." />
              <TextField label="Retencion IVA" />
              <TextField label="subTotal Gastos" />
              <TextField label="SubTotal" />
              <TextField label="Anticipo" />
              <TextField label="Total" />
            </Grid>
          </Grid>
          {/* Botones */}
          <Grid container sx={{ mt: 6 }}>
            <Grid sx={{ display: 'flex', justifyContent: 'space-evenly' }} size={12}>
              <Button variant="contained">Distribución de Proyectos</Button>
              <Button variant="contained">Ver Movimientos </Button>
              <Button variant="contained">Estado de Cuenta</Button>
              {/* <Button variant="contained">Imprimir</Button> */}
              <ImprimirFacturaDeVentas/>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default VerFactura;
