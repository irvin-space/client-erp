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
import { Text } from 'lucide-react';

const FacturaDeCliente = ({ isEnable }) => {
  const { executeFetch } = useSQL();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button disabled={!isEnable} variant="contained" onClick={handleOpen} fullWidth>
        Documentos Relacionados
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
            <Typography variant="h4">Facturas de Cliente</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/*Cliente*/}
          <Grid container spacing={2} sx={{ mb: 4, backgroundColor: '' }}>
            <Grid size={2}>
              <FirstComponent label={'Desde'}/>
            </Grid>
            <Grid size={2}>
              <FirstComponent label={'Hasta'}/>
            </Grid>
          </Grid>
          {/* Tabla */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={12}>
              <MuiTablaBase
                seleccionable={true}
                estructuraEncabezados={[
                  { propiedad: 'test1', encabezadoTitulo: 'Fáctura' },
                  { propiedad: 'test2', encabezadoTitulo: 'Fiscal' },
                  { propiedad: 'test3', encabezadoTitulo: 'Fecha' },
                  { propiedad: 'test4', encabezadoTitulo: 'Moneda' },
                  { propiedad: 'test5', encabezadoTitulo: 'Importe' },
                  { propiedad: 'test6', encabezadoTitulo: 'Estado' },
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
                  Consultar
                </Button>
              </Grid>
              <Grid size={2} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
                <Button color='secondary' variant="contained" fullWidth>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default FacturaDeCliente;
