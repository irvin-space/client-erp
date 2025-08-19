import React from 'react';
import { useContext, useState } from 'react';
import { MyContext } from '../../context';

// Mensajes
import { mensajes } from '../../utils/mensajes.js';

import Typography from '@mui/material/Typography';
import { Input } from '@mui/material';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DownOutlined } from '@ant-design/icons';
import Grid from '@mui/material/Grid';

//Componentes
import FirstComponent from '../componentesBase/FirstComponent';
// import ComponenteLista from '../componentesBase/ComponenteLista';
// import RowRadioButtonsGroup from '../componentesBase/RowRadioButon';
import RowRadioButtonsGroup from '../componentesBase/RowRadioButton.jsx';
import DataTable from '../componentesBase/DataTable.jsx';
import DataTable2 from '../componentesBase/DataTable2.jsx';
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica.jsx';
// import Mensajes from '../componentesBase/Mensajes.jsx';

//Modals
import BusquedaTramitesAduanales from './busqueda-tramites-aduanales.jsx';

//Iconos
import { SearchOutlined } from '@ant-design/icons';
import { DownCircleOutlined } from '@ant-design/icons';
import { bgcolor, fontSize, height, width } from '@mui/system';
import { color } from 'framer-motion';

const EstCambiosTramitesAduanales = () => {
  const { data, setData } = useContext(MyContext);
  const [selectedValue, setSelectedValue] = useState('');

  //Opciones de lista
  const options = [
    { value: 10, label: 'Opcion1' },
    { value: 20, label: 'Opcion2' },
    { value: 30, label: 'Opcion3' }
  ];

  console.log('Debajo debe mostrarse lo que hay en data');
  console.log(data.menu);
  // console.log(JSON.parse(Object.values(JSON.parse(data.resultado).recordsets[1][0])[0]).Menu);

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/consulta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Procedimiento: 'Combo_Tasas_Ivas',
          Parametros: { otros: 0, solo_activas: 0 }
        })
      });
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  return (
    <div>
      <Typography variant="h2">Modificación de Trámites Aduanales</Typography>
      <Divider sx={{ my: 2 }} />

      <Box component="form" className="base" sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          {/* Tramite, Fecha */}
          <Grid size={4}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <TextField id="standard-basic" label="Trámite aduana" variant="standard" fullWidth />
              {/* <Box
                onClick={() => alert('buscar...')}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', height: '100%' }}
              >
                <SearchOutlined style={{ fontSize: '1.5em', color: '#1876d3' }} />
              </Box> */}

              {/* <Button variant="outlined" sx={{ height: '100%' }}>
                <SearchOutlined style={{ fontSize: '1.5em', color: '#1876d3' }} />
              </Button> */}

              {/* Boton de modal de pruebas */}
              <BusquedaTramitesAduanales />
            </Box>
          </Grid>
          <Grid size={4}>
            <FirstComponent />
          </Grid>
        </Grid>

        <br />

        {/* Ivas, Precintos,$ */}
        <Grid container spacing={1}>
          <Grid size={4}>
            {/* <ComponenteLista titulo="Sucursal" /> */}
            <ComponenteListaDinamica
              label="Ivas"
              instruccionSQL="combo_tasas_ivas"
              parametros={{
                '@lOtros': 0,
                '@lSolo_Activas': 0
              }}
              valueKey="folio"
              labelKey="tasa_iva"
            />
          </Grid>
          <Grid size={4}>
            <TextField fullWidth id="outlined-number" label="Precintos" type="number" />
          </Grid>
          <Grid size={4}>
            <TextField fullWidth placeholder="0.00" id="outlined-start-adornment" slotProps={{ input: { startAdornment: '$' } }} />
          </Grid>
        </Grid>

        <br />

        {/* Acordion Pedimento/Cliente */}
        <Accordion
          sx={{
            borderRadius: '4px',
            '&:last-of-type': {
              borderRadius: '4px' // Ensure last accordion maintains radius
            }
          }}
        >
          <AccordionSummary expandIcon={<DownOutlined />} aria-controls="panel1-content" id="panel1-header">
            <Typography variant="h5">Pedimento/Cliente</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4}>
              {/* Pedimento */}
              <Grid size={6}>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Titulo aqui */}
                    <Typography variant="h4">Pedimento</Typography>
                  </Grid>
                  <Grid size={12}>
                    {/* Radio group aqui */}
                    <Grid container spacing={1}>
                      <Grid size={6}>
                        <RowRadioButtonsGroup titulo="Tipo" valor1="Importación" valor2="Exportación" />
                      </Grid>
                      <Grid size={6}>{/* <ComponenteLista titulo="Clave" /> */}</Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Grid container spacing={3}>
                      <Grid size={6}>
                        <TextField fullWidth id="standard-basic" label="Número de pedimento" variant="standard" />
                      </Grid>
                      <Grid size={6}>
                        <RowRadioButtonsGroup titulo="" valor1="Con Cargo" valor2="Sin Cargo" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={6}>
                {/* Cliente */}
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Titulo aqui */}
                    <Typography variant="h4">Cliente</Typography>
                  </Grid>
                  <Grid size={12}>
                    {/* Radio group aqui */}
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                          <TextField id="standard-basic" label="Pedimento" variant="standard" fullWidth />
                          {/* <Box
                            onClick={() => alert('buscar...')}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', height: '100%' }}
                          >
                            <SearchOutlined style={{ fontSize: '1.5em', color: '#1876d3' }} />
                          </Box> */}

                          <Button variant="outlined" sx={{ height: '100%' }}>
                            <SearchOutlined style={{ fontSize: '1.5em', color: '#1876d3' }} />
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    {/* Pedimento y cargo aqui */}
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                          <TextField
                            id="standard-multiline-flexible"
                            label="Facturación"
                            multiline
                            maxRows={2}
                            variant="standard"
                            fullWidth
                          />
                          {/* <Box
                            onClick={() => alert('buscar...')}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', height: '100%' }}
                          >
                            <SearchOutlined style={{ fontSize: '1.5em', color: '#1876d3' }} />
                          </Box> */}

                          <Button variant="outlined" sx={{ height: '100%' }}>
                            <SearchOutlined style={{ fontSize: '1.5em', color: '#1876d3' }} />
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <br />

        {/* Acordion Tipo de pago/Forma de pago Termina */}
        <Accordion
          sx={{
            borderRadius: '4px',
            '&:last-of-type': {
              borderRadius: '4px' // Ensure last accordion maintains radius
            }
          }}
        >
          <AccordionSummary expandIcon={<DownOutlined />} aria-controls="panel2-content" id="panel2-header">
            <Typography variant="h5">Tipo de Pago/Forma Pago</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4}>
              {/* Tipo de pago/forma de pago */}
              <Grid size={6}>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Tipo de pago */}
                    <Grid container spacing={1}>
                      <Grid size={12}>
                        <RowRadioButtonsGroup
                          titulo="Tipo de Pago"
                          valor1="Financiado"
                          valor2="Anticipo"
                          valor3="Trasferencia de Cliente"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Grid container spacing={3}>
                      <Grid size={12}>
                        <RowRadioButtonsGroup titulo="Forma de Pago" valor1="Transferencia de Cuenta" valor2="Cheque" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={6}>
                {/* Cliente */}
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Radio group aqui */}
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', width: '100%' }}>
                          <TextField id="standard-multiline-flexible" label="Impuesto" variant="standard" fullWidth />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    {/* Chequera*/}
                    <Grid container spacing={2}>
                      <Grid size={12}>{/* <ComponenteLista titulo="Chequera" /> */}</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <br />
      </Box>

      <br />

      {/* Tabla Ingreso Aduanal */}
      <Box>
        <Typography variant="h4">Ingresos Agencia Aduanal</Typography>
        <br />
        <DataTable></DataTable>
      </Box>

      <br />
      {/* Tabla gastos por Cuenta del Cliente */}
      <Box>
        <Typography variant="h4">Gastos por Cuenta del Cliente</Typography>
        <br />
        <DataTable></DataTable>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Botones */}
      <Stack direction="row">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button variant="contained">Iniciar</Button>
            <Button variant="contained" disabled>
              Guardar
            </Button>
            <Button variant="contained" color="secondary">
              Cancelar
            </Button>
          </Box>
          <Box>
            {/* <Button onClick={handleClick} variant="contained"> */}
            <Button onClick={handleClick} variant="contained">
              Imprimir
            </Button>
          </Box>
        </Box>
      </Stack>

      {/* Componente lista de prueba */}

      {/* <ComponenteListaDinamica
        label="Ivas"
        instruccionSQL="combo_tasas_ivas"
        parametros={{
          '@lOtros': 0,
          '@lSolo_Activas': 0
        }}
        valueKey="folio"
        labelKey="tasa_iva"
      />  */}
      {/* <ComponenteListaDinamica
        label="Forma pago"
        instruccionSQL="combo_formas_pago"
        valueKey="forma_pago"
        labelKey="forma_pago"
      /> */}

      {/* Sweet Alerts de pruebas */}
      {/* {mensajes('error' ,'Lorem Ipsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do' )} */}

      {/* {mensajes('pregunta' ,'Lorem Ipsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do' )} */}

      {/* {mensajes('aviso' ,'Lorem Ipsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do' )} */}
    </div>
  );
};

export default EstCambiosTramitesAduanales;
