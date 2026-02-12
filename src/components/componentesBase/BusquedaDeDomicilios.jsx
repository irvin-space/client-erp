import React, { useState } from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Componentes del proyecto
import BusquedaDeClientes from '../servicios/busqueda-de-clientes';
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import MuiTablaBase from './MuiTablaBase';
import ImprimirFacturaDeVentas from './ImprimirFacturaDeVentas';
import FirstComponent from './FirstComponent';
import RadioButtonsGroup from './RadioButtonsGroup';

import useSQL from '@/hooks/useSQL';

//Ant-design
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import { width } from '@mui/system';

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

const BusquedaDeDomicilios = ({ isEnable, onSelectedRow, datosCliente }) => {
  const { executeFetch } = useSQL();

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState(0);
  const [domicilioClienteInfo, setDomicilioClienteInfo] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [openBusquedaDeClientesModal, setOpenBusquedaDeClientesModal] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    console.log('new value', newValue);
    console.log('e', event.target.innerText);
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  const handleClienteSeleccionado = async (e) => {
    console.log(e);
    console.log('abc');
    if (value == 0) {
      //Call Stored Procedure TRAE_DOMICILIOS_CLIENTE
      console.log('clientes');
      const { success, data } = await executeFetch('TRAE_DOMICILIOS_CLIENTE', { cliente: e.cliente });

      console.log(success);
      console.log(data);
      if (success) {
        console.log(data[0].length);
        if (data[0].length > 0) {
          setDomicilioClienteInfo(data[0]);
          console.log('se selecciono la infooo')
        }
      }
    }
    setClienteSeleccionado(e.nombre_cliente);
    setOpenBusquedaDeClientesModal(false);
  };

  const handleSelectedRow = (e)=>{
    console.log('ftft',e)
    onSelectedRow(e)
    handleClose()
  }

  return (
    <div>
      <Button disabled={!isEnable} variant="outlined" onClick={handleOpen}>
        Buscar
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
            <Typography variant="h4">Búsqueda de Domicilios</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Clientes,Proveedores*/}
          <Grid container spacing={2} sx={{ mb: 2, backgroundColor: '' }}>
            <Grid size={12}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Clientes" {...a11yProps(0)} />
                    <Tab label="Proveedores" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0} sx={{ backgroundColor: 'red' }}>
                  <Box sx={{mb:2}}>
                    <BusquedaDeClientes
                      value={clienteSeleccionado ? clienteSeleccionado : ''}
                      onSelectedRow={(e) => handleClienteSeleccionado(e)}
                      open={openBusquedaDeClientesModal}
                      onClose={() => setOpenBusquedaDeClientesModal(false)}
                      onOpen={() => setOpenBusquedaDeClientesModal(true)}
                    />
                  </Box>
                  {/* Tabla */}
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <MuiTablaBase
                        onSelectRow={(e)=>handleSelectedRow(e)}
                        idPropiedad="domicilio"
                        datos={domicilioClienteInfo}
                        seleccionable={true}
                        estructuraEncabezados={[
                          { propiedad: 'descripcion', encabezadoTitulo: 'Descripción' },
                          { propiedad: 'domicilio_corto', encabezadoTitulo: 'Domicilio' },
                          { propiedad: 'nombre_ciudad', encabezadoTitulo: 'Ciudad' },
                          { propiedad: 'tipo', encabezadoTitulo: 'Tipo' }
                        ]}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label={'Datos'}
                        multiline
                        rows={5}
                        fullWidth
                        value={domicilioClienteInfo.length >0 ? domicilioClienteInfo[0].domicilio_extendido : ''}
                      />
                    </Grid>
                  </Grid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  Item Two
                </CustomTabPanel>
              </Box>
            </Grid>
          </Grid>

          {/* Botones */}
          <Divider />
          <Grid container sx={{ mt: 2, backgroundColor: '' }}>
            <Grid container size={12}>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
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

export default BusquedaDeDomicilios;
