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
import FirstComponent from './FirstComponent';
import RadioButtonsGroup from './RadioButtonsGroup';

//Ant-design
import { PlusCircleOutlined } from '@ant-design/icons';

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

const ComplementoDeTramitesAduanales = ({ isEnable }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button disabled={!isEnable} variant="outlined" onClick={handleOpen} startIcon={<PlusCircleOutlined />}>
        Complementar Trámite
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '50vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #000',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4
          }}
        >
          <Box sx={{ marginBottom: '15px', backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h5">Complemento de Pagos de Trámites Aduanales </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Sucursal,Fecha,Tramite */}
          <Grid container spacing={2} sx={{ backgroundColor: '', display: 'flex', flexDirection: 'row' }}>
            <Grid size={{ xs: 12, md: 8 }} sx={{ backgroundColor: '', display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ mb: 1, width: '35%' }}>
                <ComponenteListaDinamica
                  label="Sucursal"
                  instruccionSQL="combo_sucursales"
                  valueKey="sucursal"
                  labelKey="nombre_sucursal"
                  retornaObjeto={false}
                  parametros={{ '@cCentro': "'      1'" }}
                  // value= sucursal
                />
              </Box>
              <Box sx={{ mb: 0 }}>
                <FirstComponent label={'Fecha'} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ backgroundColor: '',mb:2 }}>
              <TextField variant="outlined" label={'Trámite'} />
            </Grid>
          </Grid>
          {/* Tipo Transporte, Clasificacion, Proyecto, Cant. Facturas, Valor Aduana : Cove, Digitalizacion, Cant.Pedimentos, Cant.Partidas, Pedimento Original*/}
          <Grid sx={{ mb: 2 }} container spacing={2}>
            <Grid sx={{ backgroundColor: '', display: 'flex', flexDirection: 'column' }} size={{ xs: 12, md: 12 }}>
              <RadioButtonsGroup label="Tipo transporte" direction="row" values={['Aéreo', 'Terrestre', 'Maritimo', 'Todos']} />
              <RadioButtonsGroup label="Clasificación" direction="row" values={['Consolidado', 'Individual', 'Ambos']} />
              <Box sx={{ width: '50%' }}>
                <ComponenteListaDinamica
                  label="Proyecto"
                  instruccionSQL="SELECT * FROM Proyectos_Facturacion"
                  valueKey="proyecto"
                  labelKey="nombre_proyecto"
                  retornaObjeto={false}
                  // parametros={{ '@cCentro': "'      1'" }}
                  // value= sucursal
                />
              </Box>
            </Grid>
            <Grid container  sx={{ backgroundColor: ''}} size={{ xs: 12, md: 12 }}>
              <Grid>
                <TextField label="Cant. Facturas" variant="outlined" />
              </Grid>
              <Grid>
                <TextField label="Valor Aduana" variant="outlined" />
              </Grid>
              <Grid>
                <TextField label="Cove" variant="outlined" />
              </Grid>
              <Grid>
                <TextField label="Digitalización" variant="outlined" />
              </Grid>
              <Grid>
                <TextField label="Cant. Pedimentos" variant="outlined" />
              </Grid>
              <Grid>
                <TextField label="Cant.Partidas" variant="outlined" />
              </Grid>
              <Grid>
                <TextField label="Pedimento original" variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
          {/* Consultar */}
          <Grid container>
            <Grid size={12}>
              <Button variant="contained">Continuar</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ComplementoDeTramitesAduanales;
