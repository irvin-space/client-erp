import React from 'react';
import { useState, useEffect } from 'react';

//MUI
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

//Components del proyecto
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';
import useAuth from 'hooks/useAuth.js';
import { mensajes } from '../../utils/mensajes.js';

//Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  height: '380px',
  bgcolor: 'background.paper',
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden'
};

const Autoriza = ({ txtBoton, FolioAutorizacion, Tabla, Folio, Color, open, onClose, onOpen, onSelectRow, onProcesoPosterior }) => {
  const [password, setPassword] = useState('');
  const [nombreOperacion, setNombreOperacion] = useState('');

  //alert(onSelectRow.concepto);
  // Nuevo useEffect para registrar la acción de apertura
  useEffect(() => {
    if (open) {
      console.log('Abriendo modal', FolioAutorizacion);
      const Params = {
              operacion: `'${FolioAutorizacion}'`
            };

      handleFetch(Params);
    }
  }, [open]);

  const handleFetch = async (parametros) => {
      try {
            

            const response = await fetch('http://localhost:3001/dinamico/lista', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                instruccionSQL: 'Combo_Personal_Autoriza',
                parametros: parametros
              })
            });
      
            const data = await response.json();
            console.log('debajo esta el resultado del sp');
            console.log(data);
            // --- Lógica agregada para verificar si hay registros ---
            if (data[0] && data[0].length === 0) {
              // Si el primer array está vacío, muestra una alerta.
              {
                mensajes('aviso', 'Consulta Realizada');
              } // este es sweetalert2
            }
      
            setNombreOperacion(data[1][0].nombre_operacion);

            console.log('Nombre de la Operacion:', nombreOperacion);
          } catch (error) {
            console.log(error);
          } finally {
            console.log('Finalizando carga');
            //setIsLoading(false); //Terminar de cargar
          }
    };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  
  const handleAceptar = () => {
    
    if(password==='123'){
      mensajes('aviso', 'Proceso Autorizado');

      // Aquí se llama a la función del componente padre
      // para que realice la acción final.
      if (onProcesoPosterior) {
          onProcesoPosterior();
      }


      console.log('Aqui va el codiigo para actualizar la autorizacion en la tabla correspondiente');
      setPassword('');
      FolioAutorizacion = '0';
      onClose();
    }
    else{
      mensajes('error', 'Proceso No Autorizado');
      setPassword('');
      //FolioAutorizacion = '0';
      return;
    }
  }

  const handleCancelar = () => {
    console.log('Cancelar');
    setPassword('');
    FolioAutorizacion = '0';
    //setNombreOperacion('xxx');
    onClose();
  }

  const [usuario, setUsuario] = useState(useAuth().user.id_persona);
  const [sucursal, setSucursal] = useState(useAuth().user.sucursal);

  return (
    <Box>
      <Button onClick={onOpen} variant="outlined" color={Color ? Color : 'primary'}>
        {txtBoton ? txtBoton : 'Autorizar'}
      </Button>
      <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Container>
            {/* Encabezado */}
            <Box sx={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              
              <Typography variant="h4">Autorización de Proceso</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">{nombreOperacion}</Typography>
            <br />
            <Box sx={{ width: '100%' }}>
                <ComponenteListaDinamica
                  label="Autoriza"
                  instruccionSQL="Combo_Personal_Autoriza"
                  value={usuario}
                  onChange={setUsuario}
                  parametros={{
                    '@nOperacion': `'${FolioAutorizacion}'`
                  }}
                  valueKey="persona"
                  labelKey="nombre"
                />
              </Box>
              <br />
            <Box sx={{ backgroundColor: '', display: 'flex', flexDirection: 'row' }}>
              <FormControl variant="outlined" sx={{ width: '50%' }}>
                <TextField
                  id="password"
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </FormControl>

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 0 }}>
              <Button
                onClick={handleAceptar}
                variant="contained"
                color="success"
              >
                Aceptar
              </Button>
              <Button
                onClick={handleCancelar}
                variant="contained"
                color="error"
              >
                Cancelar
              </Button>
            </Box>
          </Container>
        </Box>
      </Modal>
    </Box>
  );
};

export default Autoriza;
