import React from 'react';
import { useState } from 'react';

//MUI
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//Components del proyecto
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';

//Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //   minWidthwidth: '1500px',
  width: '20vw',
height: '30vh',
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

const Autoriza = ({ open, onClose, onOpen, texto, Color }) => {
const [isLoading, setIsLoading] = useState(false); // Cargando
  
  const handleAceptar = () => {
    console.log('Aceptar');
  }

  const handleAutorizar = (event) => {
    console.log('consultar');
  };

 
  return (
    <div>
      <Button onClick={onOpen} variant="outlined" color={Color ? Color : 'primary'}>
        {texto ? texto : 'Autorizar'}
      </Button>
      <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Container>
            {/* Encabezado */}
            <Box sx={{ backgroundColor: '', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
              {/* <Box sx={{ backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
              <Typography variant="h4">Autorización de Proceso</Typography>
            </Box>
            <br />
            <Box sx={{ backgroundColor: '', display: 'flex', flexDirection: 'row' }}>
              <FormControl sx={{ width: '35%' }}>
                <InputLabel htmlFor="buscar-input">Persona</InputLabel>
                <Input id="buscar-input" aria-describedby="buscar-helper-text" />
              </FormControl>

              
              <Box sx={{ width: '25%' }}>
                <ComponenteListaDinamica
                  label="Autoriza"
                  instruccionSQL="combo_personal"
                  parametros={{
                    '@cCentro': "'      1'",
                    '@cRol': "'%'"
                  }}
                  valueKey="persona"
                  labelKey="nombre"
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

            </Box>
            <br />
            <Button
              onClick={handleAceptar}
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Aceptar
            </Button>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

export default Autoriza;
