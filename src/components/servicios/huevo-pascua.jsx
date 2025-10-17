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

//Componentes.
import useAuth from 'hooks/useAuth.js';
import DataTable from '../componentesBase/DataTable2';
import TablaBase from '../componentesBase/TablaBase.jsx';
import useSQL from 'hooks/useSQL.js';
import { GiEasterEgg } from 'react-icons/gi';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  maxHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  bgcolor: 'light blue',
  border: '8px solid #55c0f1ff',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px',
  overflow: 'hidden'
};

const HuevosPascua = ({ open, onClose, onOpen, gastosRow, idTramite }) => {
 
    
  const { loading, error, executeFetch } = useSQL();
 
  useEffect(() => {
    
  }, []);



  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
            <Typography variant="h3" align="center">
                Felicidades !! Has encontrado un Huevo de Pascua 🥚🎉<GiEasterEgg style={{ fontSize: '30px', color: 'purple' }}/>
            </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            {/* Fila 1: Trámite (2 columnas) */}
            <Grid container spacing={2} sx={{ mb: 1 }} >
                <Typography variant="Text" >
                ¿Cuantas sorpresas podrás encontrar?<br></br>
                <GiEasterEgg style={{ fontSize: '30px', color: 'purple' }}/>
                <GiEasterEgg style={{ fontSize: '15px', color: 'blue' }}/>
                <GiEasterEgg style={{ fontSize: '30px', color: 'pink' }}/>
                <GiEasterEgg style={{ fontSize: '15px', color: 'green' }}/>
                <GiEasterEgg style={{ fontSize: '30px', color: 'yellow' }}/>
                </Typography>
            </Grid>     
          </FormControl>
          
          <Divider sx={{ my: 2 }} />

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Continuar
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HuevosPascua;