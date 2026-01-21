import React, { useState } from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';


//Componentes del proyecto
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import RadioButtonsGroup from './RadioButtonsGroup';
import FirstComponent from './FirstComponent';

//Ant-design
import { FileSearchOutlined } from '@ant-design/icons';

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

const VerChequeDeGastos = ({ isEnable }) => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button disabled={!isEnable} variant="outlined" onClick={handleOpen} startIcon={<FileSearchOutlined />}>
        Ver Cheque De Gastos
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '55vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #00345D',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4
          }}
        >
          {/* Titulo */}
          <Box sx={{ marginBottom: '15px', backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h4">Cheque de Gastos por Cuenta del Cliente</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/*Facturas De Gastos*/}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={12}>
              <Typography variant="h4">Facturas de Gastos</Typography>
            </Grid>
            <Grid container size={9}>
              <Grid size={3}>
                <ComponenteListaDinamica
                  label="Sucursal"
                  //   onChange={handleSucursalSelected}
                  instruccionSQL="combo_sucursales"
                  //   value={tramiteSeleccionado?.sucursal ? tramiteSeleccionado.sucursal : sucursal}
                  valueKey="sucursal"
                  labelKey="nombre_sucursal"
                  retornaObjeto={false}
                  parametros={{
                    '@cCentro': "'      1'"
                  }}
                  // lEditando={true}
                />
              </Grid>
              <Grid size={3}>
                <TextField label="Factura" />
              </Grid>
              <Grid size={3}>
                <TextField label="Folio Factura" />
              </Grid>
              <Grid size={3}>
                <TextField label="Beneficiario" />
              </Grid>
              <Grid size={3}>
                <TextField label="Concepto" />
              </Grid>
              <Grid size={3}>
                <TextField label="Fecha" />
              </Grid>
              <Grid size={3}>
                <TextField label="Estado Actual" />
              </Grid>
            </Grid>
            {/* Importe, Importe M.E */}
            <Grid container size={3} sx={{ backgroundColor: 'red' }}>
              <Grid size={12}>
                <TextField label="Importe" />
              </Grid>
              <Grid size={12}>
                <TextField label="Importe M.E." />
              </Grid>
            </Grid>
          </Grid>
          {/*Cheques*/}
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h4">Cheque</Typography>
            </Grid>
            <Grid container size={9}>
              <Grid size={3}>
                <ComponenteListaDinamica
                  label="Sucursal"
                  //   onChange={handleSucursalSelected}
                  instruccionSQL="combo_sucursales"
                  //   value={tramiteSeleccionado?.sucursal ? tramiteSeleccionado.sucursal : sucursal}
                  valueKey="sucursal"
                  labelKey="nombre_sucursal"
                  retornaObjeto={false}
                  parametros={{
                    '@cCentro': "'      1'"
                  }}
                  // lEditando={true}
                />
              </Grid>
              <Grid size={3}>
                <TextField label="Folio Cheque" />
              </Grid>
              <Grid size={3}>
                <TextField label="Número" />
              </Grid>
              <Grid size={3}>
                <TextField label="Chequera" />
              </Grid>
              <Grid size={6}>
                {/* <TextField label="Concepto" /> */}
                <RadioButtonsGroup label={'Tipo'} values={['Cheque', 'Transferencia']} direction={'row'} />
              </Grid>
              <Grid size={3}>
                <TextField label="Fecha" />
              </Grid>
              <Grid size={3}>
                <TextField label="Estado Actual" />
              </Grid>
            </Grid>
            {/* Importe, Importe M.E */}
            <Grid container size={3} sx={{ backgroundColor: 'red' }}>
              <Grid size={12}>
                <TextField label="Importe" />
              </Grid>
              <Grid size={12}>
                <TextField label="Importe M.E." />
              </Grid>
              <Grid size={12}>
                <TextField label="Moneda" />
              </Grid>
              <Grid size={12}>
                <TextField label="Tipo Cambio" />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default VerChequeDeGastos;
