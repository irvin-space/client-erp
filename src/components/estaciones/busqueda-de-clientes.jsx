import React from 'react';
import { useState } from 'react';

//MUI
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//Components del proyecto
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';
import DataTable from '../componentesBase/DataTable2';
import { setIn } from 'formik';
import { maxHeight } from '@mui/system';

//Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //   minWidthwidth: '1500px',
  width: '90vw',
  maxHeight: '80vh',
  //   maxHeight: '80vh',
  //   height: '70vh',
  bgcolor: 'background.paper',
  //   bgcolor: 'primary.lighter', // white
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden'
};

const BusquedaDeClientes = ({ open, onClose, onOpen }) => {
  const [isLoading, setIsLoading] = useState(false); // Cargando

  const [inputBusquedaDeCliente, setInputBusquedaDeCliente] = useState('');
  const [buscarPor, setBuscarPor] = useState('Nombre');
  const [searchInputConstrain, setSearchInputConstrain] = useState('contiene');
  const [busquedaSucursal, setBusquedaSucursal] = useState('');

  const [arregloDeClientes,setArregloDeClientes] = useState([])

  const handleFetch = async (orden, texto, principio, sucursal) => {
    try {
      const response = await fetch('http://localhost:3001/dinamico/lista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccionSQL: 'ser_busca_cliente',
          parametros: {
            '@cOrden': orden,
            '@cTexto': texto,
            '@bPrincipio': principio == 'contiene' ? 1 : 0,
            '@nSucursal': sucursal
          }
        })
      });

      const data = await response.json();

      console.log(data);
      setArregloDeClientes(data)
    } catch (e) {
      console.log(e);
    }
  };

  const handleConsultar = () => {
    console.log('consulstar');
    console.log('inputBusquedaDeCliente', inputBusquedaDeCliente);
    console.log('searchInputConstrain:', searchInputConstrain);
    console.log('buscarPor:', buscarPor);
    console.log('sucursal:', busquedaSucursal);
    handleFetch(buscarPor, inputBusquedaDeCliente, searchInputConstrain, busquedaSucursal);
  };

  const handleInputBusquedaDeCliente = (event) => {
    console.log(event.target.value);
    setInputBusquedaDeCliente(event.target.value);
  };

  const handleChange = (event) => {
    console.log('buscar por', event.target.value);
    setBuscarPor(event.target.value);
  };

  const handleSearchInputConstrain = (event, newSearchInputConstrain) => {
    console.log('input constrain', newSearchInputConstrain);
    setSearchInputConstrain(newSearchInputConstrain);
  };

  const handleBusquedaSucursal = (e) => {
    console.log(e);
    if (e == 'Todos') {
      setBusquedaSucursal('Todos');
    }
    setBusquedaSucursal(e);
  };

  return (
    <div>
      <Button onClick={onOpen} variant="outlined">
        ...
      </Button>
      <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Container>
            {/* Encabezado */}
            <Box sx={{ backgroundColor: '', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
              {/* <Box sx={{ backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
              <Typography variant="h4">Búsqueda de Clientes</Typography>
            </Box>
            <br />
            <Box sx={{ backgroundColor: '', display: 'flex', flexDirection: 'row' }}>
              <FormControl sx={{ width: '35%' }}>
                <InputLabel htmlFor="buscar-input">Buscar</InputLabel>
                <Input onChange={handleInputBusquedaDeCliente} id="buscar-input" aria-describedby="buscar-helper-text" />
              </FormControl>

              {/* <FormHelperText id="buscar-helper-text">Buscar cliente</FormHelperText> */}
              {/* <FormControlLabel control={<Checkbox sx={{ marginLeft: '12px' }} defaultChecked />} label="Inicia con" /> */}

              <ToggleButtonGroup
                sx={{ height: '30px', width: '200px' }}
                value={searchInputConstrain}
                exclusive
                onChange={handleSearchInputConstrain}
                aria-label="contiene-empieza-con"
              >
                <ToggleButton value="contiene" aria-label="contiene">
                  <Typography variant="p">Contiene</Typography>
                </ToggleButton>
                <ToggleButton value="empieza" aria-label="empieza">
                  <Typography variant="p">Empieza con</Typography>
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Busqueda por  */}
              <FormControl sx={{ width: '25%' }}>
                <InputLabel id="demo-simple-select-label">Buscar Por</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={buscarPor}
                  label="Buscar-Por"
                  onChange={handleChange}
                >
                  <MenuItem value={'Nombre'}>Nombre</MenuItem>
                  <MenuItem value={'RFC'}>RFC</MenuItem>
                  <MenuItem value={'Anterior'}>Anterior</MenuItem>
                  <MenuItem value={'Cliente'}>Cliente</MenuItem>
                  <MenuItem value={'Agente'}>Agente</MenuItem>
                  <MenuItem value={'Comercial'}>Comercial</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ width: '25%' }}>
                <ComponenteListaDinamica
                  label="Sucursal"
                  instruccionSQL="combo_sucursales"
                  parametros={{
                    '@cCentro': "'      1'"
                  }}
                  valueKey="sucursal"
                  labelKey="nombre_sucursal"
                  extraOption="Todos"
                  onChange={handleBusquedaSucursal}
                />
              </Box>
            </Box>
            <br />
            <Box
              sx={{
                flexGrow: 1,
                maxHeight: '50vh', // Limita la tabla a la altura establecida
                overflowY: 'auto', // Permite el scroll horizontal solo aqui
                '& .MuiTableContainer-root': {
                  maxHeight: 'none' // Asegura que no existan conflictos de limites internos
                }
              }}
            >
              <DataTable datos={arregloDeClientes} />
            </Box>
            <br />
            <Button
              onClick={handleConsultar}
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Consultar
            </Button>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

export default BusquedaDeClientes;
