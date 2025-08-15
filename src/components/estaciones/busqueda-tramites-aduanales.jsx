import React, { useState } from 'react';

//MUI
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import FormControl from '@mui/material/FormControl';

//Ant Design icons
import { SearchOutlined } from '@ant-design/icons';

//Componentes.
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';
import FirstComponent from '../componentesBase/FirstComponent';
// import RowRadioButtonsGroup from '../componentesBase/RowRadioButon';
import RowRadioButtonsGroup from '../componentesBase/RowRadioButton.jsx';
import TablaColapsable from '../componentesBase/TablaColapsable';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { borderRadius, maxHeight } from '@mui/system';
// import ComponenteLista from '../componentesBase/ComponenteLista';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  maxHeight: '80vh',
  //   height: '70vh',
  //   bgcolor: 'background.paper',
  bgcolor: 'white',
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden'
};

const BusquedaTramitesAduanales = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [sucursal, setSucursal] = useState('b');
  const [desdeFecha, setDesdeFecha] = useState(null);
  const [hastaFecha, setHastaFecha] = useState(null);
  const [tipo, setTipo] = useState(null);

  const [arreglo,setArreglo] = useState([])

  const handleFetch = async (parametros) => {
    try {
      const response = await fetch('http://localhost:3001/dinamico/lista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccionSQL: 'Ser_Tramites_Aduanales',
          parametros: parametros
        })
      });

      const data = await response.json()
      console.log(data)
      setArreglo(data[0])
    } catch (error) {
      console.log(error);
    }
  };

  const handleConsultar = () => {
    console.log({
      sucursal,
      tipo: tipo === "Todos" ? "%" : tipo,
      desdeFecha: desdeFecha?.format('YYYY-MM-DD') || null,
      hastaFecha: hastaFecha?.format('YYYY-MM-DD') || null,
    });

    const objetoDeBusqueda = {
      sucursal: `'${sucursal}'`,
      tipo: tipo === "Todos" ? "'%'" : tipo,
      desdeFecha: `'${desdeFecha?.format('YYYY-MM-DD')}'` || null,
      hastaFecha: `'${hastaFecha?.format('YYYY-MM-DD')}'` || null,
      pedimento: null
    };

    handleFetch(objetoDeBusqueda);
  };
  // comentario prueba jgm
  //Estado de TablaColapsable
  //const [selectedRow, setSelectedRow] = React.useState(null);

  //Data de fila seleccionada
  //   const handleConsultar => {
  //     console.log('Selected Row Data', selectedRow)
  //   }

  return (
    <div style={{ height: '100%' }}>
      {/* <Button onClick={handleOpen}>Abrir modal</Button> */}
      <Button onClick={handleOpen} variant="outlined" sx={{ height: '100%', backgroundColor:"white" }}>
        <SearchOutlined style={{ fontSize: '1.5em', color: '#00345D' }} />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Container maxWidth="xl" sx={{ height: '100%' }}>
            {/* Encabezado */}
            <Typography variant="h4">Búsqueda de Trámites Aduanales</Typography>
            <br />
            {/* Formulario */}
            <FormControl fullWidth>
              <Grid container spacing={2}>
                {/* Sucursal */}
                <Grid item size={3} sx={{ backgroundColor: 'white' }}>
                  <Typography variant="subtitle2">Sucursal</Typography>
                  {/* <ComponenteListaDinamica
                    label="Sucursal"
                    instruccionSQL="combo_sucursales"
                    valueKey="sucursal"
                    labelKey="nombre_sucursal"
                    parametros={{
                      '@cCentro': '\"      1"\ '
                    }}
                  /> */}

                  <ComponenteListaDinamica
                    label="Sucursal"
                    onChange={setSucursal}
                    instruccionSQL="combo_sucursales"
                    value={sucursal}
                    valueKey="sucursal"
                    labelKey="nombre_sucursal"
                    parametros={{
                      '@cCentro': "'      1'"
                    }}
                  />

                  {/* <ComponenteLista titulo="Sucursal" value={sucursal} onChange={setSucursal}/> */}
                </Grid>
                {/* Desde fecha */}
                <Grid item size={2} sx={{ backgroundColor: 'white' }}>
                  <Typography variant="subtitle2">Desde</Typography>
                  <FirstComponent value={desdeFecha} onChange={setDesdeFecha} />
                </Grid>
                {/* Hasta fecha */}
                <Grid item size={2} sx={{ backgroundColor: 'white' }}>
                  <Typography variant="subtitle2">Hasta</Typography>
                  <FirstComponent value={hastaFecha} onChange={setHastaFecha} />
                </Grid>
                {/* Tipo */}
                <Grid item size={4} sx={{ backgroundColor: 'white' }}>
                  <RowRadioButtonsGroup
                    titulo="Tipo"
                    valor1="Todos"
                    valor2="Importación"
                    valor3="Exportación"
                    value={tipo}
                    onChange={setTipo}
                  />
                </Grid>
              </Grid>
            </FormControl>

            <br />
            <br />
            <Divider />
            <br />

            {/* Componente tabla colapsable */}
            <Box
              sx={{
                flexGrow: 1,
                maxHeight: '40vh', // Limits the table area to 40vh of the viewport height
                overflowY: 'auto', // Enables vertical scrolling only here
                '& .MuiTableContainer-root': {
                  maxHeight: 'none' // Ensure no inner limit conflicts
                }
              }}
            >
              <TablaColapsable datos={arreglo} />
              {/* <TablaColapsable  selectedRow={selectedRow} onSelectRow={setSelectedRow}/> */}
            </Box>

            <br />

            <Button onClick={handleConsultar} variant="contained">
              Consultar
            </Button>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

export default BusquedaTramitesAduanales;
