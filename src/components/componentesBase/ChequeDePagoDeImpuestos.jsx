import React, { useState, useEffect } from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

//Componentes del proyecto
import useSQL from '../../hooks/useSQL';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  bgcolor: 'background.paper',
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
};

const ChequeDePagoDeImpuestos = ({ tramite }) => {
  const [open, setOpen] = useState(false);
  const [chequeData, setChequeData] = useState(null);


  const { data, loading, error, executeFetch } = useSQL();


  useEffect(() => {
    console.log('tramite', tramite);

    const handleFetch = async () => {
      if(tramite) {
        const response = await executeFetch('CONSULTA_CHEQUE_TRAMITE', { '@nTramite': tramite });
        if (response.success) {
          console.log('respo1nse', response.data);
          setChequeData(response.data[0][0]);
        }
      }
    }
    handleFetch();



  }, [tramite]);


  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <div>
      <Button sx={{ mx: 2 }} variant='contained' onClick={handleOpen}>Ver Cheque de Impuestos</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ marginBottom: '15px' }}>
            <Typography variant="h5">Cheque de Pago de impuestos</Typography>
          </Box>
          <Grid container spacing={2}>
            {/* Trámite */}
            <Grid size={6}>
              <TextField value={chequeData ? chequeData?.tramite_aduana : ''} label="Trámite" variant="outlined" fullWidth slotProps={{ input: { readOnly: true } }} />
            </Grid>
            <Grid size={6}>
              <TextField value={chequeData ? chequeData?.fecha_cheque : ''} label="Fecha" variant="outlined" fullWidth slotProps={{ input: { readOnly: true } }} />
            </Grid>
            <Grid size={6}>
              <TextField value={chequeData ? chequeData?.cheque : ''} label="Folio Cheque" variant="outlined" fullWidth slotProps={{ input: { readOnly: true } }} />
            </Grid>
            <Grid size={6}>
              <TextField value={chequeData ? chequeData?.estado_Actual : ''} label="Estado Actual" variant="outlined" fullWidth slotProps={{ input: { readOnly: true } }} />
            </Grid>
            <Grid size={6}>
              <TextField value={chequeData ? chequeData?.tipo : ''} label="Tipo" variant="outlined" fullWidth slotProps={{ input: { readOnly: true } }} />
            </Grid>
            <Grid size={6}>
              <TextField value={chequeData ? chequeData?.numero_cheque : ''} label="Número" variant="outlined" fullWidth slotProps={{ input: { readOnly: true } }} />
            </Grid>
            <Grid size={12}>
              <TextField value={chequeData ? chequeData?.nombre_chequera : ''} label="Chequera" variant="outlined" fullWidth slotProps={{ input: { readOnly: true } }} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
            <Box sx={{ backgroundColor: '', display: 'flex', flexDirection: 'column' }}>
              <TextField value={chequeData ? chequeData?.importe : ''} variant="outlined" label={'Importe'} />
              <TextField value={chequeData ? chequeData?.importe_me : ''} variant="outlined" label={'Importe M.E.'} />
              <TextField value={chequeData ? chequeData?.moneda : ''} variant="outlined" label={'Moneda'} />
              <TextField value={chequeData ? chequeData?.tipo_cambio : ''} variant="outlined" label={'Tipo Cambio'} />
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ChequeDePagoDeImpuestos; 
