import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import {MailOutlined, FolderOpenOutlined, DashboardOutlined} from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab({ handleLogout }) {

  const seleccionOnClick = () => {
  alert('Página en construcción');
  }

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Editar Perfil" onClick={seleccionOnClick}/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Ver Perfil" onClick={seleccionOnClick}/>
      </ListItemButton>
      <Link underline="none" sx={{ color: 'inherit' }} target="_blank" href="https://tickets.spaceti.cloud/">
        <ListItemButton>
          <ListItemIcon>
            <ProfileOutlined />
          </ListItemIcon>
          <ListItemText primary="Tickets" />
        </ListItemButton>
      </Link>
      <Link underline="none" sx={{ color: 'inherit' }} target="_blank" href="https://iso.spaceti.cloud/Script/principal.htm">
        <ListItemButton>
          <ListItemIcon>
            <FolderOpenOutlined />
          </ListItemIcon>
          <ListItemText primary="Control de documentos" />
        </ListItemButton>
      </Link>
      <Link underline="none" sx={{ color: 'inherit' }} target="_blank" href="https://mws.spaceti.cloud/Login.aspx">
        <ListItemButton>
          <ListItemIcon>
            <DashboardOutlined />
          </ListItemIcon>
          <ListItemText primary="My WorkSpace" />
        </ListItemButton>
      </Link>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Cerrar Sesión" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
