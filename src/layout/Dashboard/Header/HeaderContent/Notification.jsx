import { useRef, useState } from 'react';

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

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [read, setRead] = useState(4);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

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
                  secondary={
                    <>
                      {read > 0 && (
                        <Tooltip title="Marcar todas como Leído">
                          <IconButton color="success" size="small" onClick={() => setRead(0)}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
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
                    <ListItem
                      component={ListItemButton}
                      divider
                      selected={read > 0}
                      secondaryAction={
                        <Typography variant="caption" noWrap>
                          5:00 AM
                        </Typography>
                      }
                      onClick={clickAlerta}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                          <GiftOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            
                            <Typography component="span" variant="subtitle1">
                              Camilo Canasto
                            </Typography>{' '}
                            cumpleaños Hoy.
                          </Typography>
                        }
                        secondary="43 años"
                      />
                    </ListItem>
                    <ListItem
                      component={ListItemButton}
                      divider
                      secondaryAction={
                        <Typography variant="caption" noWrap>
                          10:05 AM
                        </Typography>
                      }
                      onClick={clickAlerta}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                          <MessageOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            <Typography component="span" variant="subtitle1">
                              Juan Camaney
                            </Typography>{' '}
                            Escribió una queja.
                          </Typography>
                        }
                        secondary="Buzón de quejas y sugerencias"
                      />
                    </ListItem>
                    <ListItem
                      component={ListItemButton}
                      divider
                      selected={read > 0}
                      secondaryAction={
                        <Typography variant="caption" noWrap>
                          2:45 PM
                        </Typography>
                      }
                      onClick={clickAlerta}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                          <SettingOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            Aviso &nbsp;
                            <Typography component="span" variant="subtitle1">
                              Lentitud HSBC
                            </Typography>{' '}
                          </Typography>
                        }
                        secondary="Reporte de lentitud en la plataforma HSBC"
                      />
                    </ListItem>
                    <ListItem
                      component={ListItemButton}
                      divider
                      secondaryAction={
                        <Typography variant="caption" noWrap>
                          4:13 PM
                        </Typography>
                      }
                      onClick={clickAlertaDashboard}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>C</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            <Typography component="span" variant="subtitle1">
                              Ficha de Depóstito
                            </Typography>{' '}
                            Confirmada {' '}
                            <Typography component="span" variant="subtitle1">
                              Folio 167131
                            </Typography>
                          </Typography>
                        }
                        secondary="Click para ver el Dashboard"
                      />
                    </ListItem>
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
    </Box>
  );
}
