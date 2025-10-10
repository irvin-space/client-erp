import React, { useRef, useState, useEffect, useCallback  } from 'react';

//React Router
import { useNavigate } from 'react-router';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { BellFilled, EditOutlined,FileDoneOutlined, DeliveredProcedureOutlined, ExportOutlined } from '@ant-design/icons';

import useSQL from 'hooks/useSQL2.js'; //Empleamos useSQL2 para no mostrar mensajes
import useAuth from 'hooks/useAuth.js';

import Snackbar from '@mui/material/Snackbar'; // 👈 Importa Snackbar
import MuiAlert from '@mui/material/Alert'; // 👈 Opcional: Para darle estilo de alerta


// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [read, setRead] = useState(4);
  const [open, setOpen] = useState(false);
  const { executeFetch } = useSQL();
  const [usuario, setUsuario] = useState(useAuth().user.id_persona);
  const [misAlertas, setMisAlertas] = useState([]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const navigate = useNavigate()

  const clickAlerta = () => {
    setRead(read - 1); 
    alert('Desplegar aqui modal de la alerta'); 
  }

  const clickAlertaDashboard = () => {
    setRead(read - 1); 
    
    const rowInfo =  {
      "nombre_tipo": "Ancipo de Cliente",
      "sucursal": "Chihuahua",
      "cliente_documento": "INNOVATIVE RECYCLING SOLUTIONS                                                  ",
      "anticipo": 73301,
      "ficha_deposito": 167131,
      "fecha_confirmacion": "2025-07-10T10:17:57.000Z",
      "importe_ficha_deposito": 35218,
      "saldo_actual_ficha": 18387,
      "poliza_ficha": 2133874,
      "numero_exportado_poliza_ficha": 566554,
      "fecha_exportada_poliza_ficha": "2025-07-18T08:56:04.490Z",
      "folio_CONTPAQ": 0,
      "fecha_CONTPAQ": "",
      "valor": 169173,
      "fecha_valor": "2025-07-10T10:17:57.000Z",
      "importe_valor": 35218,
      "documento": 278478,
      "fecha_deposito_documento": "2025-07-10T10:17:57.000Z"
  }
    navigate("/dashboard-trazabilidad-pagos",{state:{rowInfo}})
  }

   

  const handleFetch = useCallback(async (parametros) => {
    
    const result = await executeFetch('[Trae_Alarmas]', parametros);
      
    if (result.success && result.data && result.data[0] && result.data[0].length > 0) {
        const alertas = result.data[0]; 
        setMisAlertas(alertas); // Dependencia: setMisDatos
        setRead(alertas.length); // Dependencia: setRead
    } else {
        setMisAlertas([]);
        setRead(0);
    }
  }, [executeFetch]); // Las dependencias de useCallback
  
  const getIcon = (tipo) => {
      switch (tipo) {
          case 'Cumpleaños de Contactos': return <GiftOutlined />;
          case 'Cancelación de Factura': return <FileDoneOutlined />;
          case 'Cancelación de Cheque': return <EditOutlined />;
          case 'Eliminación de Trámite': return <DeliveredProcedureOutlined />;
          case 'Queja': return <MessageOutlined />;
          case 'Aviso': return <SettingOutlined />;
          case 'Anticipo': return <CheckCircleOutlined />;
          // Agrega más casos según los tipos de alerta que maneje tu SP
          default: return <BellOutlined />;
      }
  };

  const getColor = (prioridad) => {
      // switch (tipo) {
      //     case 'Cumpleaños de Contactos': return { color: 'success.main', bgcolor: 'success.lighter' };
      //     case 'Cancelación de Factura': return { color: 'error.main', bgcolor: 'error.lighter' };
      //     case 'Cancelación de Cheque': return { color: 'warning.main', bgcolor: 'warning.lighter' };
      //     case 'Queja': return { color: 'primary.main', bgcolor: 'primary.lighter' };
      //     case 'Aviso': return { color: 'error.main', bgcolor: 'error.lighter' };
      //     case 'Anticipo': return { color: 'warning.main', bgcolor: 'warning.lighter' };
      //     default: return { color: 'secondary.main', bgcolor: 'secondary.lighter' };
      // }
      switch (prioridad) {
          case 'Baja': return { color: 'success.main', bgcolor: 'success.lighter' };
          case 'Media': return { color: 'warning.main', bgcolor: 'warning.lighter' };
          case 'Alta': return { color: 'error.main', bgcolor: 'error.lighter' };
          default: return { color: 'secondary.main', bgcolor: 'secondary.lighter' };
      }
  };
  
  const handleAlertClick = (alerta) => {
      const idAlerta = alerta.alerta; 
      
      if (idAlerta > 0){
        LeeAlerta(alerta); // Marca la alerta como leída en la base de datos
        
        setOpen(false);

        if (alerta.tipo_alerta && alerta.tipo_alerta.trim() === 'Anticipo') {
            clickAlertaDashboard();
        }
      }
  };

  const LeeAlerta = async (alerta) => {
    const titulo = alerta.titulo || 'Sin título';
    const idAlerta = alerta.alerta;

    const Params = {
        alerta: idAlerta
    };    
    const result = await executeFetch('Marca_Alerta_Leida', Params, true);
    if (result.success) {
        showQuickAlert(`La alerta  ${titulo}. Marcada como leída`); 

        setRead(prev => prev > 0 ? prev - 1 : 0);

        setMisAlertas(prevAlertas => prevAlertas.filter(a => {
            return a.alerta !== idAlerta; 
        }));

    } else {
        showQuickAlert(`Error al marcar la alerta  ${titulo} como leída`); 
    } 
  }

  useEffect(() => {
    const Params = {
        nPersona: `'${usuario}'`
    }

    // Llama al inicio y luego cada minuto (60000ms)
    handleFetch(Params);
    const intervalId = setInterval(() => handleFetch(Params), 60000); 

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, [handleFetch, usuario]); // Incluimos usuario en caso de que cambie

  // Función que reemplaza al alert() nativo
  const showQuickAlert = (message) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setSnackbarOpen(false);
  };

  // ==============================|| RENDERIZADO DEL COMPONENTE ||============================== //
    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                color="secondary"
                variant="light"
                sx={(theme) => ({
                    color: 'text.primary',
                    bgcolor: open ? 'grey.100' : 'transparent',
                    ...theme.applyStyles('dark', { bgcolor: open ? 'background.default' : 'transparent' })
                })}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Badge badgeContent={read} color="warning">
                    <BellOutlined /> 
                </Badge>
            </IconButton>
            <Popper
                placement={downMD ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } })}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    title="Alertas"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    // secondary={  ESTE ES EL BOTON PARA MARCAR TODAS COMO LEIDAS
                                    //     <>
                                    //         {read > 0 && (
                                    //             <Tooltip title="Marcar todo como Leído">
                                    //                 <IconButton color="success" size="small" onClick={() => setRead(0)}>
                                    //                     <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                                    //                 </IconButton>
                                    //             </Tooltip>
                                    //         )}
                                    //     </>
                                    // }
                                >
                                    <List
                                        component="nav"
                                        sx={{
                                            p: 0,
                                            '& .MuiListItemButton-root': {
                                                py: 0.5,
                                                px: 2,
                                                '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                                                '& .MuiAvatar-root': avatarSX,
                                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                            }
                                        }}
                                    >
                                        
                                        {/* ----------------------------------------------------- */}
                                        {/* ⚠️ LISTADO DINÁMICO DE ALERTAS A PARTIR DE SQL ⚠️ */}
                                        {/* ----------------------------------------------------- */}
                                        {misAlertas.map((alerta, index) => {
                                            
                                            // Asumiendo campos del SP
                                            const { titulo, mensaje_principal, subtitulo, fecha, tipo_alerta, is_leida, prioridad } = alerta;
                                            // Si tu SP no devuelve 'is_leida', asume true o false según tu lógica
                                            const isSelected = !is_leida; 

                                            return (
                                                <ListItem
                                                    key={index} 
                                                    component={ListItemButton}
                                                    divider
                                                    selected={isSelected}
                                                    secondaryAction={
                                                        <Typography variant="caption" noWrap sx={{ fontSize: '0.65rem' }}>
                                                          {fecha}
                                                        </Typography>
                                                    }
                                                    // Le pasamos toda la alerta a la función de clic
                                                    onClick={() => handleAlertClick(alerta)} 
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar sx={getColor(prioridad.trim())}>
                                                            {getIcon(tipo_alerta.trim())}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="h6">
                                                                <Typography component="span" variant="subtitle1">
                                                                    {titulo || 'Evento'}
                                                                </Typography>
                                                                {'  :  '} {mensaje_principal || 'Sin mensaje'}
                                                            </Typography>
                                                        }
                                                        secondary={subtitulo || 'Detalles no disponibles'}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                        
                                        {/* Mensaje si no hay alertas */}
                                        {misAlertas.length === 0 && (
                                            <ListItem>
                                                <ListItemText primary={<Typography>No tienes nuevas alertas.</Typography>} />
                                            </ListItem>
                                        )}
                                        
                                        {/* Botón de 'View All' */}
                                        <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" color="primary">
                                                        View All
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </List>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
            <Snackbar 
              open={snackbarOpen} 
              autoHideDuration={2000} // Duración en ms 1000 = 1 segundo
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top' , horizontal: 'center' }} // Posición en la pantalla
          >
              {/* Usamos MuiAlert para un look más formal (opcional) */}
              <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                  {snackbarMessage}
              </Alert>
              {/* Si no usas MuiAlert, simplemente sería: <span>{snackbarMessage}</span> */}
          </Snackbar>
        </Box>
    );


}
