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
import BusquedaDeDomicilios from './BusquedaDeDomicilios';
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import MuiTablaBase from './MuiTablaBase';
import ImprimirFacturaDeVentas from './ImprimirFacturaDeVentas';
import FirstComponent from './FirstComponent';
import RadioButtonsGroup from './RadioButtonsGroup';

//Ant-design
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';

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

const AltaDeDomicilios = ({ isEnable, datosCliente }) => {
  const [open, setOpen] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [colonia, setColonia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado,setEstado] = useState('')
  const [pais,setPais] = useState('')

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectedRow = (rowInfo) => {
    console.log('rowInfo domicilio', rowInfo);
    console.log(rowInfo.domicilio_extendido);
    const domcilioInfo = rowInfo.domicilio_extendido.split('\r');
    const parteDireccion = domcilioInfo[0];
    setDireccion(parteDireccion);
    const parteColonia = domcilioInfo[1];
    setColonia(parteColonia)
    const parteCodigoPostal = domcilioInfo[2];
    setCodigoPostal(parteCodigoPostal)
    const parteCiudad = domcilioInfo[3];
    setCiudad(parteCiudad)
    const parteEstado = domcilioInfo[4];
    setEstado(parteEstado)
  };

  return (
    <div>
      <Button disabled={!isEnable} variant="outlined" onClick={handleOpen} startIcon={<EnvironmentOutlined />}>
        Alta de Domicilios
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            height: '80vh',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '50vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #00345D',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4,
            overflow: 'auto'
          }}
        >
          {/* Titulo */}
          <Box sx={{ backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h4">Alta de Domicilios</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Cliente, Tipo, Descripcion, Direccion, Num Ext, Interior, Colonia, C. SAT Colonia, Codigo Postal, Ciudad, Estado - Pais, Ruta de REparto, Orden Ruta, Entre Calles, C. SAT Municipio, C. SAT Localidad */}
          <Grid container spacing={2} sx={{ mb: 2, backgroundColor: '' }}>
            <Grid size={12}>
              <TextField label="Cliente" fullWidth />
            </Grid>
            <Grid container size={12} sx={{ backgroundColor: 'light' }}>
              <Grid size={12}>
                <TextField label="Tipo" />
              </Grid>
              <Grid size={12}>
                <TextField label="Descripción" fullWidth />
              </Grid>
              <Grid size={12}>
                <TextField label="Dirección" fullWidth value={direccion} />
              </Grid>
              <Grid size={3}>
                <TextField label="Núm Ext" />
              </Grid>
              <Grid size={3}>
                <TextField label="Interior" />
              </Grid>
              <Grid size={6}>
                <TextField label="Colonia" fullWidth value={colonia} />
              </Grid>
              <Grid size={6}>
                <TextField label="C. SAT Colonia" fullWidth />
              </Grid>
              <Grid size={3}>
                <TextField label="Código Postal" value={codigoPostal} />
              </Grid>
              <Grid size={6}>
                <TextField label="Ciudad!!!" fullWidth value={ciudad} />
              </Grid>
              <Grid size={6}>
                <TextField label="Estado, País" fullWidth />
              </Grid>
              <Grid size={4}>
                <TextField label="Ruta de Reparto!!!" />
              </Grid>
              <Grid size={3}>
                <TextField label="Oren Ruta" />
              </Grid>
            </Grid>
            <Grid size={12} sx={{ backgroundColor: '' }}>
              <TextField fullWidth label="Entre calles" multiline rows={3} />
            </Grid>
            <Grid container size={12}>
              <Grid size={4}>
                <TextField label="C. SAT Municipio" />
              </Grid>
              <Grid size={4}>
                <TextField label="C. SAT Localidad" />
              </Grid>
            </Grid>
          </Grid>
          {/* Botones */}
          <Divider />
          <Grid container sx={{ mt: 2, backgroundColor: '' }}>
            <Grid sx={{ display: 'flex', justifyContent: '', backgroundColor: '' }} size={2}>
              {/* <Button variant="contained" fullWidth>
                Buscar
              </Button> */}
              <BusquedaDeDomicilios isEnable={true} onSelectedRow={handleSelectedRow} />
            </Grid>
            <Grid container size={10}>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
                <Button variant="contained">Guardar</Button>
                <Button color="secondary" variant="contained">
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default AltaDeDomicilios;
