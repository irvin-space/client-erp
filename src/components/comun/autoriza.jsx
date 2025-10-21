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
import useSQL from 'hooks/useSQL.js';

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

const Autoriza = ({ txtBoton, FolioAutorizacion, Tabla, Folio, Componente, Color, open, onClose, onOpen, onSelectRow, onProcesoPosterior }) => {
  const [password, setPassword] = useState('');
  const [nombreOperacion, setNombreOperacion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [usuario, setUsuario] = useState(useAuth().user?.id_persona || '');
  const [usuarioLogged, setUsuarioLogged] = useState(usuario);
  const [sucursal, setSucursal] = useState(useAuth().user?.sucursal || '');

  // 1. Use el hook useSQL
const { loading, error, executeFetch } = useSQL();

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
    // Usa executeFetch para la llamada inicial
    const result = await executeFetch('Combo_Personal_Autoriza', parametros);
      
      if (result.success && result.data && result.data[1] && result.data[1][0]) {
        setNombreOperacion(result.data[1][0].nombre_operacion);
      } else {
        mensajes('error', 'No se pudo obtener el nombre de la operación.');
      }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAceptar = async () => {
    
    const Params = {
      sucursal: `'${sucursal}'`,
      solicita: `'${usuarioLogged}'`,
      autoriza: `'${usuario}'`,
      operacion: `'${FolioAutorizacion}'`,
      componente: `'${Componente}'`,
      tabla: `'${Tabla}'`,
      folio: `'${Folio}'`,
      justificacion: `''`
    };
    
    if(password===contrasena){
      console.log('Proceso Autorizado');

      // 3. Usa executeFetch para registrar la autorización
      const result = await executeFetch('Registra_Autorizacion_Web', Params, true);

      if (result.success) {
              //mensajes('aviso', 'Autorización registrada con éxito.');
              // Ejecuta el proceso posterior si existe
        if (onProcesoPosterior) {
          onProcesoPosterior();
        }
              setPassword('');
        onClose();
      }
      else{
        mensajes('error', 'Error al registrar la autorización');
      }
    }
    else{
      mensajes('error', 'Proceso No Autorizado');
      setPassword('');
      return;
    }
  }

  const handleCancelar = () => {
    console.log('Cancelar');
    setPassword('');
    onClose();
  }

  const handleListaSeleccion = (value, objeto) => {
    setUsuario(objeto.persona);
    setContrasena(objeto.contrasena)
  }

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
                  onChange={handleListaSeleccion}
                  parametros={{
                    '@nOperacion': `'${FolioAutorizacion}'`
                  }}
                  valueKey="persona"
                  labelKey="nombre"
                  retornaObjeto={false}
                  lEditando= {false}
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