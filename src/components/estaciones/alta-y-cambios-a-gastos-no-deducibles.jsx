import React from 'react';

//MUI
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

//Proyect components
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';
import DataTable from '../componentesBase/DataTable2';
import FirstComponent from '../componentesBase/FirstComponent';

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
  //   bgcolor: 'background.paper',
  //backgroundColor: 'white',
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden',
  overflowY: 'auto'
};

const handleGuardar = () => {
  console.log('Boton guardar se presiono');
};

const handleCancelar = () => {
  console.log('Boton cancelar se presiono');
};

const AltaYCambiosAGastosNoDeducibles = ({ open, onClose, onOpen, onSelectedRow }) => {
  return (
    <div>
      <Button sx={{ backgorundColor: 'red' }} variant="outlined" onClick={onOpen} color="primary">
        Nuevo Gasto
      </Button>
      <Modal sx={{ paddingBottom: '18px' }} open={open} onClose={onClose}>
        <Box sx={style}>
          <Box sx={{ width: '95%', height: '100%', backgroundColor: '' }}>
            {/* Encabezado */}
            <Box sx={{ backgroundColor: '', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
              {/* <Box sx={{ backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
              <Typography variant="h4">Alta y Cambios a Gastos No Deducibles</Typography>
            </Box>

            {/* Formulario */}
            <Grid container spacing={2}>
              <Grid sx={{ backgroundColor: 'lightred' }} size={6}>
                <Grid container spacing={2}>
                  <Grid sx={{ display: 'flex', justifyContent: 'space-between' }} size={12}>
                    <TextField
                      sx={{
                        width: '49%',
                        backgroundColor: '',
                        '& .MuiInput-root': {
                          paddingBottom: '10px' // reduce bottom padding
                        },
                        '& .MuiInputBase-input': {
                          paddingTop: '10px' // pushes text down
                        }
                      }}
                      id="standard-basic"
                      label="Gasto"
                      variant="standard"
                    />
                    <Box sx={{ width: '50%' }}>
                      <FirstComponent />
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <ComponenteListaDinamica
                      label="Sucursal"
                      //   onChange={handleSucursalSelected}
                      instruccionSQL="combo_sucursales"
                      //   value={selectedTramite?.sucursal ? selectedTramite?.sucursal : sucursal}
                      valueKey="sucursal"
                      labelKey="nombre_sucursal"
                      retornaObjeto={false}
                      parametros={{
                        '@cCentro': "'      1'"
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField id="outlined-multiline-static" label="Concepto" multiline rows={4} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={{ backgroundColor: 'lightblue' }} size={6}>
                <p>b</p>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <br />

            {/* Tabla */}
            <Box sx={{ height: '40%' }}>
              <DataTable datos={[]} />
            </Box>

            <br />

            {/* Botones */}
            <Stack direction="row">
              <Button sx={{ marginRight: '8px' }} variant="contained" onClick={handleGuardar}>
                Guardar
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancelar}>
                Cancelar
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AltaYCambiosAGastosNoDeducibles;
