import React, { useState } from 'react';

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
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { TextField } from '@mui/material';

//Ant Design
import { SearchOutlined } from '@ant-design/icons';

//Components del proyecto
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';
import DataTable from '../componentesBase/DataTable2';

//Hooks
import useAuth from '../../hooks/useAuth';

//Custom Hooks
import useSQL from '../../hooks/useSQL';

//Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height: '80vh',
  display: 'flex',
  justifyContent: 'center',
  bgcolor: 'background.paper',
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden'
};

const BusquedaDeClientes = ({ open, onClose, onOpen, onSelectedRow, editando, label, value }) => {
  const { data, loading, error, executeFetch } = useSQL();

  const [isLoading, setIsLoading] = useState(false); // Cargando
  const [inputBusquedaDeCliente, setInputBusquedaDeCliente] = useState('');
  const [buscarPor, setBuscarPor] = useState('Nombre');
  const [searchInputConstrain, setSearchInputConstrain] = useState('contiene');
  const [busquedaSucursal, setBusquedaSucursal] = useState(useAuth().user?.sucursal || '');
  const [arregloDeClientes, setArregloDeClientes] = useState([]);

  const handleFetch = async (orden, texto, principio, sucursal) => {
    try {
      const response = await fetch(VITE_URL_ENVIRONMENT + '/dinamico/lista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccionSQL: 'ser_busca_cliente',
          parametros: {
            '@cOrden': orden,
            '@cTexto': texto,
            '@bPrincipio': principio == 'contiene' ? 0 : 1,
            '@nSucursal': `'${sucursal}'`
          }
        })
      });

      const data = await response.json();

      console.log(data);
      setArregloDeClientes(data);
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
    let sucursalValue = e;

    if (sucursalValue === '*Todos*' || sucursalValue === 'Todos') {
      sucursalValue = '%';
    }
    setBusquedaSucursal(sucursalValue);

    // if (e == 'Todos' || e == '*Todos*') {
    //   setBusquedaSucursal('%');
    // } else {
    //   setBusquedaSucursal(e);
    // }
  };

  const handleRowSelect = (row) => {
    console.log('Selected row:', row);
    // Do something with the selected row
    // e.g., close modal and send data up, or store in state
    onSelectedRow(row);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}> {/* <-- Asegura que el div principal tome todo el ancho */}
      
      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', width:'100%', gap:1 }}>
        <TextField
          id="standard-basic"
          label={label||"Cliente"}
          variant="standard"
          fullWidth
          value={value}
          disabled={editando}
          sx={{flexGrow: 1}}
        />

        <Button onClick={onOpen} variant="outlined" disabled ={editando} sx={{ height: '56px', minWidth: '48px', p: 1.5,flexShink: 0 }}>
          <SearchOutlined style={{ fontSize: '1.5em', color: '#00345D' }} />
        </Button>
      </Box>

      <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box sx={{ width: '95%', height: '100%' }}>
            {/* Encabezado */}
            <Box sx={{ backgroundColor: '', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
              {/* <Box sx={{ backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
              <Typography variant="h4">Búsqueda de Clientes</Typography>
            </Box>
            <br />
            {/* Componentes de busqueda */}
            <Grid container spacing={2}>
              <Grid size={2}>
                <ComponenteListaDinamica
                  label="Sucursal"
                  instruccionSQL="combo_sucursales"
                  parametros={{
                    '@cCentro': "'      1'"
                  }}
                  valueKey="sucursal"
                  value={busquedaSucursal}
                  labelKey="nombre_sucursal"
                  extraOption="*Todos*"
                  onChange={handleBusquedaSucursal}
                />
              </Grid>
              <Grid size={2}>
                <FormControl fullWidth>
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
              </Grid>

              <Grid size={3}>
                <ToggleButtonGroup
                  value={searchInputConstrain}
                  exclusive
                  onChange={handleSearchInputConstrain}
                  aria-label="contiene-empieza-con"
                  fullWidth
                  sx={{ height: '100%' }}
                >
                  <ToggleButton value="contiene" aria-label="contiene">
                    <Typography variant="p">Contiene</Typography>
                  </ToggleButton>
                  <ToggleButton value="empieza" aria-label="empieza">
                    <Typography variant="p">Empieza con</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid size={3}>
                <FormControl>
                  <InputLabel htmlFor="buscar-input">Buscar</InputLabel>
                  <Input onChange={handleInputBusquedaDeCliente} id="buscar-input" aria-describedby="buscar-helper-text" />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            {/* Tabla */}
            <Box
              sx={{
                flexGrow: 1,
                maxHeight: '40vh', // Limita la tabla a la altura establecida
                overflowY: 'auto', // Permite el scroll horizontal solo aqui
                '& .MuiTableContainer-root': {
                  maxHeight: 'none' // Asegura que no existan conflictos de limites internos
                }
              }}
            >
              <DataTable datos={arregloDeClientes} onSelectRow={handleRowSelect} />
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
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default BusquedaDeClientes;
