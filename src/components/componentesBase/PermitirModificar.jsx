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

const PermitirModificar = ({isEnable}) => {
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
        Permitir Modificar
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
            <Typography variant="h4">Registro de Autorización</Typography>
          </Box>
          <Divider sx={{mb:2}}/>
          {/* Mensaje */}
          <Box>
            <Typography sx={{ mb: 2 }} variant="h5">
              Este proceso requiere de una Clave de Autorización para continuar
            </Typography>
            <Typography sx={{ mb: 2 }} variant="h5">
              Autorización de Proceso: <span>Modificar conceptos de un Trámite Aduanal</span>
            </Typography>
          </Box>
          {/* Importancia, Nivel de Usuario, Clave del Sistema */}
          <Grid container spacing={2} sx={{ mb: 2, backgroundColor: '', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Grid size={{ xs: 12, sm: 6, md: 8 }} sx={{ backgroundColor: '' }}>
              <Typography variant="h5" align="center">
                Importancia: <span>ABC</span>
              </Typography>
              <Typography variant="h5" align="center">
                Nivel de Usuario: <span>ABC</span>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {/* <TextField label="Clave del sistema" /> */}
                <FormControl variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Clave del Sistema</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'hide the password' : 'display the password'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          {/*Autoriza, Clave del Usuario*/}
          <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'center' }} container spacing={2}>
            <Grid sx={{ backgroundColor: '' }} size={8}>
              <ComponenteListaDinamica
                label="Autoriza"
                instruccionSQL="combo_sucursales"
                valueKey="sucursal"
                labelKey="nombre_sucursal"
                retornaObjeto={false}
                parametros={{ '@cCentro': "'      1'" }}
                // value= sucursal
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Clave del Usuario</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Grid>
          </Grid>
          {/* Consultar */}
          <Grid container>
            <Grid sx={{ display: 'flex', justifyContent: 'space-around' }} size={12}>
              <Button variant="contained">Continuar</Button>
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

export default PermitirModificar;
