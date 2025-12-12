import React, { useState, useEffect } from 'react';

//Dependencias
import dayjs from 'dayjs';
import useAuth from '@/hooks/useAuth';

//MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

//AntDesign Iconos
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import MuiTablaBase from './MuiTablaBase';

//Components del proyecto
import useSQL from '@/hooks/useSQL';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '8px solid #00345D',
  borderRadius: '16px',
  boxShadow: 24,
  p: 2
};

const BusquedaDeCuentasContablesPorSucursal = ({handleSelectedSucursal}) => {
  const [sucursal, setSucursal] = useState(useAuth().user?.sucursal || '');
  const [fecha, setFecha] = useState(dayjs().$y);
  const [open, setOpen] = React.useState(false);
  const [cuentas,setCuentas] = useState([])


  const { data, loading, error, executeFetch } = useSQL();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFecha = (e)=>{
    setFecha(e.target.value)
  }


  const handleSucursalSelected = (value, objeto) => {
    console.log('Sucursal seleccionada:', value);
    setSucursal(value);
  };

  const handleCargarCuentas = async (e) => {
    console.log(e);
    console.log(sucursal);
    console.log(fecha);

    try {
      const response = await executeFetch('Carga_Cuentas_Sucursal', { '@cSucursal': sucursal, '@cEjercicio': fecha });
      
      if(response.success){
        // console.log(response.data)
        setCuentas(response.data[0])
      }else{
        console.log("hubo un error")
      }
    } catch (e) {
      console.log({ message: e });
    }

    return;
  };

  const handleRowSelect = (rowInfo) => {
    //console.log(rowInfo)
    handleSelectedSucursal(rowInfo)
    handleClose()

  };

  return (
    <div>
      <Button startIcon={<PlusOutlined />} sx={{ marginBottom: '4px' }} variant="outlined" onClick={handleOpen}>
        Agregar
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Busqueda de Cuentas Contables por Sucursal
          </Typography>
          <Container >
            {/* Parametros de busqueda */}
            <Box sx={{display:'flex', justifyContent:'center', paddingTop:2}} >
              <Box sx={{ width: '20%' }}>
                <ComponenteListaDinamica
                  label={'Sucursal'}
                  instruccionSQL={'combo_sucursales'}
                  onChange={handleSucursalSelected}
                  value={sucursal}
                  valueKey="sucursal"
                  labelKey="nombre_sucursal"
                  retornaObjeto={false}
                  parametros={{
                    '@cCentro': "'      1'"
                  }}
                />
              </Box>
              <TextField label="Ejercicio" variant="outlined" defaultValue={'2025'} sx={{ width: '25%' }} value={fecha} onChange={handleFecha} />
              <Button onClick={handleCargarCuentas} sx={{ display: 'block', width: '20%' }} variant="contained">
                Cargar Cuentas
              </Button>
            </Box>
            {/* Subtitulo2 */}
            <Box>
              <Typography>Clave y Nombre</Typography>
            </Box>
            {/* Tabla */}
            <Box sx={{height:'400px'}}>
              <MuiTablaBase
                estructuraEncabezados={[
                  { propiedad: 'cuenta', encabezadoTitulo: 'Cuenta' },
                  { propiedad: 'nombre_cuenta', encabezadoTitulo: 'Descripción' }
                ]}
                datos={cuentas}
                idPropiedad={'cuenta'}
                filtro={true}
                seleccionable={true}
                onSelectRow={handleRowSelect}
              />
            </Box>
          </Container>
        </Box>
      </Modal>
    </div>
  );
};

export default BusquedaDeCuentasContablesPorSucursal;
