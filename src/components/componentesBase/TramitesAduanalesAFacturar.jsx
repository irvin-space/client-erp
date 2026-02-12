import React, { useState } from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

//Componentes del proyecto
import BusquedaDeClientes from '../servicios/busqueda-de-clientes';
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import MuiTablaBase from './MuiTablaBase';
import FirstComponent from './FirstComponent';
import RadioButtonsGroup from './RadioButtonsGroup';

import useSQL from '@/hooks/useSQL';

//Ant-design
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';

const TramitesAduanalesAFacturar = ({ isEnable }) => {
  const { executeFetch } = useSQL();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button disabled={!isEnable} variant="contained" onClick={handleOpen} fullWidth>
        Trámites Facturar
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            height: '80vh',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '90vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #00345D',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4,
            overflow: 'auto'
          }}
        >
          {/* Titulo */}
          <Box sx={{ backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h4">Trámites Aduanales a Facturar</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/*Cliente*/}
          <Grid container spacing={2} sx={{ mb: 4, backgroundColor: '' }}>
            <Grid size={8}>
              <BusquedaDeClientes />
            </Grid>
            <Grid size={4}>
              <ComponenteListaDinamica
                label="Sucursal"
                instruccionSQL={'combo_sucursales'}
                valueKey={'sucursal'}
                labelKey="nombre_sucursal"
                parametros={{ '@cCentro': "'      1'" }}
              />
            </Grid>
            <Grid size={8}>
              <TextField label="Pedimento" />
            </Grid>
            <Grid size={4}>
              <TextField label="Tipo Cambio" />
            </Grid>
          </Grid>
          {/* Ingresos Agencia Aduanal */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={12}>
              <Typography variant="h5">Ingresos Agencia Aduanal</Typography>
            </Grid>
            <Grid size={4}>
              <ComponenteListaDinamica label="Concepto" />
            </Grid>
            <Grid size={4}>
              <RadioButtonsGroup direction={'row'} values={['Entre Fechas', '*Todas*']} />
            </Grid>
            <Grid container size={4}>
              <Grid size={6}>
                <FirstComponent />
              </Grid>
              <Grid size={6}>
                <FirstComponent />
              </Grid>
            </Grid>
            <Grid size={12}>
              <MuiTablaBase
                seleccionable={true}
                estructuraEncabezados={[
                  { propiedad: 'test1', encabezadoTitulo: 'Trámite' },
                  { propiedad: 'test2', encabezadoTitulo: 'Pedimento' },
                  { propiedad: 'test3', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'test4', encabezadoTitulo: 'Nombre Concepto' },
                  { propiedad: 'test5', encabezadoTitulo: 'Moneda' },
                  { propiedad: 'test6', encabezadoTitulo: 'Cant' },
                  { propiedad: 'test7', encabezadoTitulo: 'Importe M.N.' },
                  { propiedad: 'test8', encabezadoTitulo: 'Importe M.E.' }
                ]}
              />
            </Grid>
          </Grid>

          {/* Gastos por Cuenta del Cliente */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={12}>
              <Typography variant="h5">Gastos por Cuenta del Cliente</Typography>
            </Grid>
            <Grid size={4}>
              <ComponenteListaDinamica label="Concepto" />
            </Grid>
            <Grid size={4}>
              <RadioButtonsGroup direction={'row'} values={['Entre Fechas', '*Todas*']} />
            </Grid>
            <Grid container size={4}>
              <Grid size={6}>
                <FirstComponent />
              </Grid>
              <Grid size={6}>
                <FirstComponent />
              </Grid>
            </Grid>
            <Grid size={12}>
              <MuiTablaBase
                seleccionable={true}
                estructuraEncabezados={[
                  { propiedad: 'test1', encabezadoTitulo: 'Trámite' },
                  { propiedad: 'test2', encabezadoTitulo: 'Pedimento' },
                  { propiedad: 'test3', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'test4', encabezadoTitulo: 'Nombre Concepto' },
                  { propiedad: 'test5', encabezadoTitulo: 'Moneda' },
                  { propiedad: 'test6', encabezadoTitulo: 'Cant' },
                  { propiedad: 'test7', encabezadoTitulo: 'Importe M.N.' },
                  { propiedad: 'test8', encabezadoTitulo: 'Importe M.E.' }
                ]}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Divider />
          <Grid container sx={{ mt: 2, backgroundColor: '' }}>
            <Grid container spacing={1} size={6}>
              <Grid size={2} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
                <Button variant="contained" fullWidth>
                  Iniciar
                </Button>
              </Grid>
              <Grid size={2} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
                <Button color="secondary" variant="contained" fullWidth>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
            <Grid container size={6}>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
                <Button variant="contained">Imprimir</Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default TramitesAduanalesAFacturar;
