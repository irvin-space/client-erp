import React, { useState, useEffect } from 'react';
// import { useState } from 'react';

//MUI
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

//AntDesign Iconos
import PlusOutlined from '@ant-design/icons/PlusOutlined';

//Librerias
import dayjs from 'dayjs';

//Proyect components
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';
import MuiTablaBase from '../componentesBase/MuiTablaBase';
import DataTable from '../componentesBase/DataTable2';
import FirstComponent from '../componentesBase/FirstComponent';
import { minHeight } from '@mui/system';

import useAuth from 'hooks/useAuth.js';
import { number } from 'framer-motion';
import BusquedaDeCuentasContablesPorSucursal from '../componentesBase/BusquedaDeCuentasContablesPorSucursal';

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

const AltaYCambiosAGastosNoDeducibles = ({ open, onClose, onOpen, tramiteInfo, onSelectedRow }) => {
  const [fecha, setFecha] = useState(dayjs());
  const [sucursal, setSucursal] = useState(useAuth().user?.sucursal || '');
  const [gasto, setGasto] = useState(0);
  const [concepto, setConcepto] = useState('');
  const [tipoDeCambio, setTipoDeCambio] = useState(0);

  const [cuentas, setCuentas] = useState([]); // Aqui se guardaran los valores que se muestren en la tabla

  useEffect(() => {
    if (tramiteInfo) {
      setTipoDeCambio(tramiteInfo.tipo_cambio);
    }
  }, [tramiteInfo]);

  //Actualizar valor de concepto
  const handleConcepto = (e) => {
    setConcepto(e.target.value);
  };

  //Actualizar valor de gasto
  const handleGasto = (e) => {
    setGasto(e.target.value);
  };
  //Actualizar valor de tipo de cambio
  const handleTipoDeCambio = (e) => {
    setTipoDeCambio(0);
    const inputValue = e.target.value;

    // Allow empty input or valid numeric input (including decimals)
    if (inputValue === '' || /^-?\d*\.?\d*$/.test(inputValue)) {
      const num = inputValue === '' ? NaN : parseFloat(inputValue);
      // Optionally: validate num is finite
      setTipoDeCambio(isNaN(num) ? 0 : num); // or keep as NaN/'' depending on UX
    }
  };

  console.log(tramiteInfo);

  const handleAgregar = (rowInformation) => {
    console.log('add item to array');
    console.log(rowInformation);
    let id = Math.floor(Math.random() * 100);

    const objetoBase = {
      cuenta: rowInformation.cuenta,
      descripcion: rowInformation.nombre_cuenta,
      concepto: '',
      referencia: '',
      cargo: 0,
      abono: '',
      segmento: 'Segmento'
      // test:'dummy'
    };

    setCuentas([...cuentas, objetoBase]);
  };

  const handleCancelar = () => {
    setCuentas([]);
  };

  return (
    <div>
      <Button sx={{ backgorundColor: 'red' }} variant="outlined" onClick={onOpen} color="primary">
        Nuevo Gasto
      </Button>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Box sx={{ width: '100%', height: '100%', paddingBottom: '24px' }}>
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
                    <FirstComponent value={fecha} onChange={setFecha} />
                  </Grid>
                  <Grid sx={{ display: 'flex', justifyContent: 'space-between' }} size={12}>
                    <Box sx={{ width: '49%' }}>
                      <ComponenteListaDinamica
                        label="Sucursal"
                        //   onChange={handleSucursalSelected}
                        instruccionSQL="combo_sucursales"
                        value={sucursal}
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
                        value={gasto}
                        onChange={(e) => {
                          handleGasto(e);
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      sx={{ width: '100%' }}
                      id="outlined-multiline-static"
                      label="Concepto"
                      multiline
                      rows={2}
                      value={concepto}
                      onChange={(e) => handleConcepto(e)}
                    />
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
                      disabled
                      // value={tipoDeCambio !== 0 && !isNaN(tipoDeCambio) ? tipoDeCambio.toFixed(4) : '0.0000'}
                      value={tipoDeCambio ? tipoDeCambio : '0.0000'}
                      onChange={handleTipoDeCambio}
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
                      disabled
                      defaultValue={'0.00'}
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
                      disabled
                      defaultValue={'0.00'}
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
                      disabled
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
              <BusquedaDeCuentasContablesPorSucursal handleSelectedSucursal={handleAgregar} />
              <MuiTablaBase
                seleccionable={false} 
                idPropiedad={'cuenta'}
                datos={cuentas}
                filtro={false}
                estructuraEncabezados={[
                  { propiedad: 'cuenta', encabezadoTitulo: 'Cuenta' },
                  { propiedad: 'descripcion', encabezadoTitulo: 'Descripción', renderizarBoton: false },
                  { propiedad: 'concepto', encabezadoTitulo: 'Concepto', editable: true },
                  { propiedad: 'referencia', encabezadoTitulo: 'Referencia', editable: true },
                  { propiedad: 'cargo', encabezadoTitulo: 'Cargo', formato: 'moneda', editable: true },
                  { propiedad: 'abono', encabezadoTitulo: 'Abono' }, //Esta columna podria tener numeros que deseo aplicarles un formato, por ejemplo 14698.36797721 --> 14,698.36
                  { propiedad: 'segmento', encabezadoTitulo: 'Segmento', editable: true, renderizarBoton: true }
                ]}
              />
            </Box>

            <br />

            {/* Botones */}
            <Stack sx={{ paddingBottom: '16px' }} direction="row">
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
