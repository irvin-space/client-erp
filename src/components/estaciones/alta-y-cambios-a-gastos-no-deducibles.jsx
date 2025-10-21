import React from 'react';
import { useState } from 'react';

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
import MuiTablaBase from '../componentesBase/MuiTablaBase';
import DataTable from '../componentesBase/DataTable2';
import FirstComponent from '../componentesBase/FirstComponent';
import { minHeight } from '@mui/system';

//Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height : '80vh',
  display: 'flex',
  justifyContent: 'center',
  bgcolor: 'background.paper',
  // backgroundColor: 'lightgray',
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
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Box sx={{ width: '100%', height:'100%',  paddingBottom: '24px'}}>
            {/* Encabezado */}
            <Box sx={{ backgroundColor: '', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
              {/* <Box sx={{ backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
              <Typography variant="h4">Alta y Cambios a Gastos No Deducibles</Typography>
            </Box>
            <br />

            {/* Formulario */}
            <Grid container spacing={2}>
              <Grid sx={{ backgroundColor: 'lightred' }} size={5}>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FirstComponent />
                  </Grid>
                  <Grid sx={{ display: 'flex', justifyContent: 'space-between' }} size={12}>
                    <Box sx={{ width: '49%' }}>
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
                    </Box>

                    <Box sx={{ width: '50%' }}>
                      
                      <TextField
                      sx={{
                        width: '100%',
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
                      variant="outlined"
                    />
                    </Box>
                  </Grid>

                  <Grid size={12}>
                    <TextField sx={{ width: '100%' }} id="outlined-multiline-static" label="Concepto" multiline rows={2} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={{ backgroundColor: '' }} size={7}>
                <Grid
                  sx={{ backgroundColor: '', height: '50%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                  container
                  spacing={2}
                >
                  <Grid sx={{ backgroundColor: '' }} size={3}>
                    <ComponenteListaDinamica label={'Moneda'} />
                  </Grid>
                  <Grid sx={{ backgroundColor: '' }} size={3}>
                    <TextField
                      sx={{
                        width: '100%',
                        backgroundColor: '',
                        '& .MuiInput-root': {
                          paddingBottom: '10px' // reduce bottom padding
                        },
                        '& .MuiInputBase-input': {
                          paddingTop: '10px' // pushes text down
                        }
                      }}
                      id="standard-basic"
                      label="Tipo cambio"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid sx={{ backgroundColor: '', height: '50%', display: 'flex', alignItems: 'flex-end' }} container spacing={2}>
                  <Grid size={4}>
                    <TextField
                      sx={{
                        width: '100%',
                        backgroundColor: '',
                        '& .MuiInput-root': {
                          paddingBottom: '10px' // reduce bottom padding
                        },
                        '& .MuiInputBase-input': {
                          paddingTop: '10px' // pushes text down
                        }
                      }}
                      id="standard-basic"
                      label="Importe"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      sx={{
                        width: '100%',
                        backgroundColor: '',
                        '& .MuiInput-root': {
                          paddingBottom: '10px' // reduce bottom padding
                        },
                        '& .MuiInputBase-input': {
                          paddingTop: '10px' // pushes text down
                        }
                      }}
                      id="standard-basic"
                      label="Importe M.E."
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      sx={{
                        width: '100%',
                        backgroundColor: '',
                        '& .MuiInput-root': {
                          paddingBottom: '10px' // reduce bottom padding
                        },
                        '& .MuiInputBase-input': {
                          paddingTop: '10px' // pushes text down
                        }
                      }}
                      id="standard-basic"
                      label="Estado Actual"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <br />

            {/* Tabla */}
            <Box>
              <MuiTablaBase
                estructuraEncabezados={[
                  { propiedad: 'test1', encabezadoTitulo: 'Cuenta' },
                  { propiedad: 'test2', encabezadoTitulo: 'Descripción' },
                  { propiedad: 'test3', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'test4', encabezadoTitulo: 'Referencia' },
                  { propiedad: 'test5', encabezadoTitulo: 'Cargo' },
                  { propiedad: 'test6', encabezadoTitulo: 'Abono' },
                  { propiedad: 'test7', encabezadoTitulo: 'Segmento' },
                ]}
              />
              {/* <DataTable datos={[]} /> */}
            </Box>

            <br />

            {/* Botones */}
            <Stack sx={{paddingBottom:'16px'}} direction="row">
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
