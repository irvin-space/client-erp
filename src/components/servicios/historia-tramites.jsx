import React, { useState, useEffect } from 'react';
//import Modal from '@mui/material/Modal';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
  FormControl,
  CircularProgress
} from '@mui/material';

// Mensajes
import { mensajes } from '../../utils/mensajes.js';

//Ant Design icons
import { SearchOutlined } from '@ant-design/icons';

//Componentes.
import useAuth from 'hooks/useAuth.js';
import DataTable from '../componentesBase/DataTable2';
import TablaBase from '../componentesBase/TablaBase.jsx';
import useSQL from 'hooks/useSQL.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  bgcolor: 'white',
  border: '8px solid #00345D',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden'
};

const HistoriaTramites = ({ open, onClose, onOpen, gastosRow, idTramite }) => {
 
	const [misDatos, setMisDatos] = useState([]); // Tus datos del resultSet
	const [tramite, setTramite] = useState(''); // Trámite
	const [concepto, setConcepto] = useState(''); // Concepto
	const [descripcion, setDescripcion] = useState(''); // Descripción
	const [moneda, setMoneda] = useState(''); // Moneda
	const [cantidad, setCantidad] = useState(''); // Cantidad
	const [importeMN, setImporteMN] = useState(''); // Importe MN
	const [importeME, setImporteME] = useState(''); // Importe ME

  const { loading, error, executeFetch } = useSQL();

  // Cerrar modal y enviar data hacia arriba
  const handleRowSelect = (row) => {
    console.log('row seleccionado estamos en historia de tramites', row);
    
  };

    	
  // Define la configuración de las columnas que quieres mostrar
  // const misDatosColumns = [
  // 	{ field: 'id_gasto', headerName: 'ID de Gasto' },
  // 	{ field: 'concepto_gasto', headerName: 'Concepto' },
  // 	{ field: 'importe', headerName: 'Importe ($)' }
  // ];
  const misDatosColumns = [
    { field: 'movimiento', headerName: 'Movimiento' }
  ];

  useEffect(() => {
    //if (open) {
      if(gastosRow){
        
        setTramite(idTramite);
        setConcepto(gastosRow.concepto);
        setDescripcion(gastosRow.descripcion);
        setMoneda(gastosRow.moneda);
        setCantidad(gastosRow.cantidad);
        setImporteMN(gastosRow.importe);
        setImporteME(gastosRow.importe_me);
        
        const numeroLinea = gastosRow.numero;
        
        const Params = {
          tramite: `'${idTramite}'`,
          numeroLinea: `'${numeroLinea}'`
        }

        handleFetch(Params);
      }
      else{
        setTramite('');
        setConcepto('');
        setDescripcion('');
        setMoneda('');
        setCantidad('');
        setImporteMN('');
        setImporteME('');
        setMisDatos([]);
      };
    
    //}
  }, [gastosRow]);

  const handleFetch = async (parametros) => {
    // Usa executeFetch para la llamada inicial
    const result = await executeFetch('[Trae_Historia_Gasto_Cuenta_Cliente]', parametros);
      
      if (result.success && result.data && result.data[0] && result.data[0].length > 0) {
        // const fetchedData = [
        //   result.data[0]
        // ];
      setMisDatos(result.data[0]);
      } else {
        setMisDatos([]);
      }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Historia de Gasto por Cuenta al Cliente</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            {/* Fila 1: Trámite (2 columnas) */}
            <Grid container spacing={2} sx={{ mb: 1 }} >
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  id="tramite"
                  label="Trámite"
                  type="number"
									value={tramite}
                   //value="99999"
                  // onChange={handleTramiteChange}
                />
              </Grid>
            </Grid>

            {/* Fila 2: Concepto (2 columnas) y Descripción (3 columnas) */}
            <Grid container spacing={2} sx={{ mb: 1 }} md={{ mb: 2 }} >
              <Grid item  sx={{	p: 1,                         // padding = 1
																m: '0px 0px -0px -10px',        // top right bottom left
																width: '30%'
															}}>
                <TextField
                  //fullWidth
                  id="concepto"
                  label="Concepto"
                  type="number"
									width="50px"
                  value={concepto}
									//value={concepto}
                  // onChange={handleConceptoChange}
                />
              </Grid>
              <Grid item  sx={{	p: 1,                         // padding = 1
																m: '0px 0px -0px -95px',        // top right bottom left
																width: '65%'
															}}>
                <TextField
                  fullWidth
                  id="descripcion"
                  label="Descripción"
                  type="text"
									value={descripcion}
                  // value={descripcion}
                  // onChange={handleDescripcionChange}
                />
              </Grid>
            </Grid>

            {/* Fila 3: Moneda (2 columnas) y Cantidad (2 columnas) */}
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  id="moneda"
                  label="Moneda"
                  type="text"
									value={moneda}
                  // value={moneda}
                  // onChange={handleMonedaChange}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  id="cantidad"
                  label="Cantidad"
                  type="text"
                  value={cantidad}
                  // onChange={handleCantidadChange}
                />
              </Grid>
							<Grid item xs={2}>
                <TextField
                  fullWidth
                  id="importeMN"
                  label="Importe MN"
                  type="money"
                  value={importeMN}
                  // onChange={handleMonedaChange}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  id="importeME"
                  label="Importe ME"
                  type="money"
                  value={importeME}
                  // onChange={handleCantidadChange}
                />
              </Grid>
            </Grid>

						
          </FormControl>
          
          <Divider sx={{ my: 2 }} />

          <TablaBase data={misDatos} columnsConfig={misDatosColumns} />

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text">
            Continuar
          </Button>
          {/* <Button
            onClick={llenarDatos}
            variant="contained"
            // disabled={isLoading}
            // startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            Consultar
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HistoriaTramites;