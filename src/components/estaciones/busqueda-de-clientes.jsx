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

//Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //   minWidthwidth: '1500px',
  width: '90vw',
height: '80vh',
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
  const [age, setAge] = useState('');
  const [searchInputConstrain, setSearchInputConstrain] = useState('contiene');

  const handleConsultar = () => {
    console.log('consulstar');
  }

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleSearchInputConstrain = (event, newSearchInputConstrain) => {
    setSearchInputConstrain(newSearchInputConstrain);
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
                <Input id="buscar-input" aria-describedby="buscar-helper-text" />
              </FormControl>

              {/* <FormHelperText id="buscar-helper-text">Buscar cliente</FormHelperText> */}
              {/* <FormControlLabel control={<Checkbox sx={{ marginLeft: '12px' }} defaultChecked />} label="Inicia con" /> */}

              <ToggleButtonGroup
                sx={{ height: '30px', width: '200px' }}
                value={searchInputConstrain}
                exclusive
                onChange={handleSearchInputConstrain}
                aria-label="t"
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
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={age} label="Age" onChange={handleChange}>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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
                />
              </Box>
            </Box>
            <br />
            <Box sx={{
                maxHeight: '40vh', // Limita la tabla a la altura establecida
                overflowY: 'auto', // Permite el scroll horizontal solo aqui
                                '& .MuiTableContainer-root': {
                                  maxHeight: 'none' // Asegura que no existan conflictos de limites internos
                                }
            }}>
                <DataTable/>
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
