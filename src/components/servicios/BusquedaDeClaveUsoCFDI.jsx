import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

//MUI
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import MuiTablaBase from '../componentesBase/MuiTablaBase.jsx';

import FormControl from '@mui/material/FormControl';

// Mensajes
import { mensajes } from '../../utils/mensajes.js';

//Ant Design icons
import { SearchOutlined } from '@ant-design/icons';

//Componentes.
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica';
import FirstComponent from '../componentesBase/FirstComponent';
import useAuth from 'hooks/useAuth.js';
// import RowRadioButtonsGroup from '../componentesBase/RowRadioButon';
import RowRadioButtonsGroup from '../componentesBase/RowRadioButton.jsx';
import TablaColapsable from '../componentesBase/TablaColapsable';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { borderRadius, display, justifyContent, maxHeight, maxWidth, minWidth, width } from '@mui/system';
// import ComponenteLista from '../componentesBase/ComponenteLista';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  //   height: '70vh',
  bgcolor: 'background.paper',
  //bgcolor: 'white',
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden'
};

const BusquedaDeClaveUsoCFDI = ({ onSelectRow, onChange, onKeyDown, onClose, onOpen, open, editando, value, valueCFDIDescription }) => {
  // const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Cargando
  const [descripcionConsulta,setDescripcionConsulta] = useState('')
  const [CFDIArreglo,setCFDIArreglo] = useState([])
  // const handleOpen = () => {
  //   setOpen(true);
  //   setSucursal('')
  //   setDesdeFecha(null)
  //   setHastaFecha(null)
  //   setTipo(null)
  // }
  // const handleClose = () => {
  //   setOpen(false);
  //   setArreglo([])
  //   setSegundoArreglo([])
  // }

  const [sucursal, setSucursal] = useState(useAuth().user?.sucursal || '');
  const [desdeFecha, setDesdeFecha] = useState(dayjs().subtract(1, 'month'));
  const [hastaFecha, setHastaFecha] = useState(dayjs());
  const [tipo, setTipo] = useState('Todos'); // 'Todos', 'Importación', 'Exportación');

  const [arreglo, setArreglo] = useState([]);
  const [segundoArreglo, setSegundoArreglo] = useState([]);


  useEffect(()=>{
    console.log("Se actualizo el valor de CFDI...",value)
  },[value])

  // Cerrar modal y enviar data hacia arriba
  const handleRowSelect = (row) => {
    if (onSelectRow) {
      console.log('selected row info:', row);
      console.log('row tramite', row?.tramite);
      console.log('arreglo', arreglo);
      const selectedRowInfo = arreglo.find((item) => {
        return item.tramite_aduana == row.tramite;
      });

      console.log('selectedRowInfo', selectedRowInfo);
      console.log('row', row);
      console.log('combined', { ...selectedRowInfo, history: row.history });
      onSelectRow({ ...selectedRowInfo, history: row.history, ctePedimento: row.ctePedimento, cteFacturacion: row.cteFacturacion }); // Enviar data al padre componente
    }
    if (onClose) {
      onClose(); // Cerrar modal
    }
  };

  const handleSucursalSelected = (event) => {
    let sucursalValue = event;

    if (sucursalValue === '*Todos*' || sucursalValue === 'Todos') {
      sucursalValue = '%';
    }
    setSucursal(sucursalValue);
  };

  const handleFetch = async (parametros) => {
    try {
      setIsLoading(true); // Comenzar a cargar
      const response = await fetch(import.meta.env.VITE_URL_ENVIRONMENT + '/dinamico/lista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccionSQL: 'Claves_Uso_CFDI',
          parametros: parametros
        })
      });

      const data = await response.json();
      console.log('debajo esta el resultado del sp Claves_uso_CFDI');
      console.log(data);
      // --- Lógica agregada para verificar si hay registros ---
      if (data[0] && data[0].length === 0) {
        // Si el primer array está vacío, muestra una alerta.
        {
          mensajes('aviso', 'Consulta Realizada');
        } // este es sweetalert2
      }

      setCFDIArreglo(data[0])
      // setSegundoArreglo(data[1]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); //Terminar de cargar
    }
  };

  const handleConsultar = () => {
    const objetoDeBusqueda = {
      cDescripcion: descripcionConsulta
    };

    handleFetch(objetoDeBusqueda);
  };

  const handleDescripcion = (e)=>{
    console.log(e.target.value)
    console.log(descripcionConsulta)
    setDescripcionConsulta(e.target.value)
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* <-- Asegura que el div principal tome todo el ancho */}
      <Box sx={{backgroundColor:'', display:'flex'}}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', width: '50%', gap: 1 }}>
          <TextField
            id="standard-basic"
            label="Uso de CFDI"
            variant="standard"
            onChange={onChange}
            onKeyDown={onKeyDown}
            fullWidth
            value={value}
            disabled={editando}
            sx={{ flexGrow: 1 }}
          />

          <Button onClick={onOpen} variant="outlined" disabled={editando} sx={{ height: '56px', minWidth: '48px', p: 1.5, flexShink: 0 }}>
            <SearchOutlined style={{ fontSize: '1.5em', color: '#00345D' }} />
          </Button>
        </Box>
        <Box sx={{width:'50%'}}>
          <TextField
            id="standard-basic"
            label="Descripción CFDI"
            variant="standard"
            fullWidth
            value={valueCFDIDescription}
            disabled={editando}
            sx={{ flexGrow: 1 }}
          />
        </Box>
      </Box>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Box sx={{ width: '95%', height: '100%' }}>
            {/* Encabezado */}
            <Typography variant="h4">Uso de CFDI</Typography>
            <br />
            {/* Formulario */}
            <FormControl fullWidth>
              <Grid container spacing={2}>
                {/* Descripcion CFDI */}
                <Grid size={3} /*sx={{ backgroundColor: 'white' }}*/>
                  <TextField id="outlined-basic" label="Buscar" variant="outlined" onChange={(e)=>handleDescripcion(e)} value={descripcionConsulta}/>
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
                maxHeight: '40vh', // Limita la tabla a la altura establecida
                overflowY: 'auto', // Permite el scroll horizontal solo aqui
                '& .MuiTableContainer-root': {
                  maxHeight: 'none' // Asegura que no existan conflictos de limites internos
                }
              }}
            >
              {/* <TablaColapsable datos={arreglo} datos2={segundoArreglo} onSelectRow={handleRowSelect} /> */}
              <MuiTablaBase
                datos={CFDIArreglo}
                idPropiedad='clave'
                estructuraEncabezados={[
                  { propiedad: 'clave', encabezadoTitulo: 'Clave' },
                  { propiedad: 'descripcion', encabezadoTitulo: 'Descripción' }
                ]}
                seleccionable={true}
                encabezadoSeleccionable='Seleccionar'
                onSelectRow={(e)=>onSelectRow(e)}
              />
            </Box>

            <br />

            <Button
              onClick={handleConsultar}
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Consultar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default BusquedaDeClaveUsoCFDI;
