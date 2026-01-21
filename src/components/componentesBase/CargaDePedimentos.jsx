import React, { useState } from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

//Ant design
import { UploadOutlined } from '@ant-design/icons';

//Componentes propios del proyecto
import BotonCargarArchivos from './BotonCargarArchivos';

//Componente CargaDePedimentos
const CargaDePedimentos = ({isEnable}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button disabled={!isEnable} variant="outlined" onClick={handleOpen} startIcon={<UploadOutlined />}>
        Cargar Pedimentos
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: { xs: '90vw', sm: '70vw', md: '65vw', lg: '55vw', xl: '40vw' },
            backgroundColor: 'background.paper',
            border: '8px solid #00345D',
            borderRadius: '16px',
            boxShadow: 24,
            p: 4
          }}
        >
          <Box sx={{ marginBottom: '15px', backgroundColor: { xs: '', sm: '', md: '', lg: '', xl: '' } }}>
            <Typography variant="h5">Carga de Pedimentos</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Sucursal,Fecha,Tramite */}
          <Grid container spacing={2} sx={{ backgroundColor: '', display: 'flex', flexDirection: 'row' }}>
            <Grid size={{ xs: 12 }} sx={{ backgroundColor: '' }}>
              <TextField variant="outlined" label={'Trámite'} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{ backgroundColor: '' }}>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                      <Tab sx={{ width: '30%' }} label="Archivo Excel" {...a11yProps(0)} />
                      <Tab sx={{ width: '30%' }} label="Captura Manual" {...a11yProps(1)} />
                      <Tab sx={{ width: '30%' }} label="Pedimento" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={value} index={0}>
                    <BotonCargarArchivos label="Archivo XLS" />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    Item Two
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    Item Three
                  </CustomTabPanel>
                </Box>
              </Box>
              <Box sx={{ mb: 0 }}></Box>
            </Grid>
          </Grid>
          {/* Pedimento*/}
          <Grid container spacing={2}>
            <Grid sx={{ backgroundColor: '' }} size={6}>
              <Box >
                <TextField fullWidth multiline rows={8} label="Pedimento" variant="outlined" />
              </Box>
            </Grid>
            <Grid sx={{ backgroundColor: '' }} size={6}>
              <TextField label="Cove" variant="outlined" />
              <TextField label="Digitalización" variant="outlined" />
              <TextField label="Cant. Pedimentos" variant="outlined" />
              <TextField label="Cant.Partidas" variant="outlined" />
              <TextField label="Pedimento original" variant="outlined" />
            </Grid>
          </Grid>
          {/* Botones Cargar,Seleccionar */}
          <Grid container>
            <Grid size={12}>
              <Button variant="contained">Seleccionar</Button>
              <Button variant="contained">Cargar</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default CargaDePedimentos;
