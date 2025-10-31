import React from 'react';
import { useState } from 'react';

//React Router
import { useNavigate } from 'react-router';

//MUI
//Componentes para tabla MUI
import { DataGrid } from '@mui/x-data-grid';
//Componentes generales MUI
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

//Componentes propios del proyecto
import MonedaFormatoMiles from './MonedaFormatoMiles.jsx';

//Idioma para tabla
import { esES } from '@mui/x-data-grid/locales';

//Ant Design
import {
  FilterOutlined,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  EyeOutlined,
  FilePdfOutlined,
  CodeOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import { Typography } from '@mui/material';

//Componente MuiTablaBase
//Ejemplo de como utilizar:
{
  /* <MuiTablaBase
          seleccionable={true} //Valor puede ser true o false
          encabezadoSeleccionable="Acciones"
          idPropiedad={'ID_DEBE_SER_UNICO_PARA_QUE_LA_TABLA_LO_PUEDA_IDENTIFICAR'}
          datos={data[1]}
          estructuraEncabezados={[
            { propiedad: 'test1', encabezadoTitulo: 'prueba1abcdefghijklmnopqrstuvwxyz' },
            { propiedad: 'test2', encabezadoTitulo: 'prueba2' },
            { propiedad: 'test3', encabezadoTitulo: 'prueba3' },
            { propiedad: 'test4', encabezadoTitulo: 'prueba4' },
            { propiedad: 'test5', encabezadoTitulo: 'prueba5' },
            { propiedad: 'test6', encabezadoTitulo: 'prueba6', formato: 'moneda' }, //Esta columna podria tener numeros que deseo aplicarles un formato, por ejemplo 14698.36797721 --> 14,698.36
            { propiedad: 'test7', encabezadoTitulo: 'prueba7' },
            { propiedad: 'test8', encabezadoTitulo: 'prueba8' }, //O quiza esta columna tambien podria requerir aplicar un formato a estos numeros que podrian venir
            { propiedad: 'test9', encabezadoTitulo: 'prueba9' }, //O quiza esta tambien, no se sabe cual de todas
            { propiedad: 'test10', encabezadoTitulo: 'prueba10'}
          ]}
        /> */
}
const MuiTablaBase = ({
  estructuraEncabezados,
  datos,
  onSelectRow,
  encabezadoSeleccionable = 'Selección',
  seleccionable = false,
  idPropiedad = 'id'
}) => {
  const [selectedRowId, setSelectedRowId] = useState(null);

  const navigate = useNavigate();

  const encabezados = estructuraEncabezados.map((item) => {
    const calculatedFlex = item.encabezadoTitulo.length > 15 ? 2 : 1;

    //Columna base
    const columnaBase = {
      field: item.propiedad,
      headerName: item.encabezadoTitulo,
      flex: calculatedFlex
    };

    // Agrega formato si se especifica
    if (item.formato === 'moneda') {
      columnaBase.valueFormatter = (params) => {
        const valor = params;
        if (valor == null || isNaN(valor)) return '';

        // Use your custom formatter component logic or just format here
        return new Intl.NumberFormat('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(parseFloat(valor));
      };

      // Optional: align numbers to the right
      columnaBase.align = 'right';
      columnaBase.headerAlign = 'right';
    }

    return columnaBase;
  });


  if (seleccionable && encabezadoSeleccionable == 'Acciones') {
    const columnaSeleccion = {
      field: 'seleccion',
      headerName: encabezadoSeleccionable,
      flex: encabezadoSeleccionable != 'Selección' ? 2 : 1,
      minWidth: 100,
      align: 'center',
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => {
        // Use the same ID logic as DataGrid
        const rowId = params.row[idPropiedad]; // e.g., factura
        const isSelected = selectedRowId === rowId;

        const handleSelect = () => {
          const newSelectedId = isSelected ? null : rowId;
          setSelectedRowId(newSelectedId);

          // 👉 Log the factura or whatever you want
          console.log('Selected row factura:', params.row.factura);
          console.log(onSelectRow); // this onSelectRow logs as undefined , why?

          // Optional: Call a callback if provided
          if (onSelectRow) {
            onSelectRow(params.row);
          }
          // } else if (onDeselectRow && isSelected) {
          //   onDeselectRow(params.row);
          // }
        };

        const rowInfo = { ficha_deposito: params.row.ficha_deposito };

        const handleVisualizar = () => {
          // console.log('hello World')
          // console.log(params.row)
          navigate('/dashboard-trazabilidad-pagos', { state: { rowInfo } });
        };

        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'space-evenly',
              width: '100%',
              height: '100%',
              px: 0,
              py: 0
            }}
          >
            <IconButton
              onClick={handleSelect}
              aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.poliza}`}
              color="error"
              size="large"
              sx={{ width: '25%', height: '100%' }}
            >
              {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <FilePdfOutlined fontSize="large" />}
            </IconButton>
            <IconButton
              onClick={handleSelect}
              aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.poliza}`}
              color="success"
              size="large"
              sx={{ width: '25%', height: '100%' }}
            >
              {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <CodeOutlined fontSize="large" />}
            </IconButton>
            <IconButton
              onClick={handleSelect}
              aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.poliza}`}
              color="success"
              size="large"
              sx={{ width: '25%', height: '100%' }}
            >
              {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <FolderOpenOutlined fontSize="large" />}
            </IconButton>
            <Tooltip title="Visualizar">
              <IconButton
                onClick={handleVisualizar}
                aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.poliza}`}
                color="info"
                size="large"
                sx={{ width: '25%', height: '100%' }}
              >
                {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <EyeOutlined fontSize="large" />}
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    };
    encabezados.push(columnaSeleccion);
  } else {
    const columnaSeleccion = {
      field: 'seleccion',
      headerName: encabezadoSeleccionable,
      flex: encabezadoSeleccionable != 'Selección' ? 2 : 1,
      minWidth: 100,
      align: 'center',
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => {
        // Use the same ID logic as DataGrid
        const rowId = params.row[idPropiedad]; // e.g., factura
        const isSelected = selectedRowId === rowId;

        const navigate = useNavigate();

        const handleSelect = () => {
          const newSelectedId = isSelected ? null : rowId;
          setSelectedRowId(newSelectedId);

          // 👉 Log the factura or whatever you want
          console.log('Selected row factura:', params.row.factura);
          console.log(onSelectRow); // this onSelectRow logs as undefined , why?

          // Optional: Call a callback if provided
          if (onSelectRow) {
            onSelectRow(params.row);
          }
          // } else if (onDeselectRow && isSelected) {
          //   onDeselectRow(params.row);
          // }
        };

        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'space-evenly',
              width: '100%',
              height: '100%',
              px: 0,
              py: 0
            }}
          >
            <IconButton
              onClick={handleSelect}
              aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.poliza}`}
              color="success"
              size="large"
              sx={{ width: '25%', height: '100%' }}
            >
              {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <CheckCircleOutlined fontSize="large" />}
            </IconButton>
          </Box>
        );
      }
    };
    encabezados.push(columnaSeleccion);
  }
  return (
    //Altura default altura 400 -->   <Paper sx={{ height: 400, width: '100%' }}>
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        sx={{ '& .MuiDataGrid-columnHeader': { backgroundColor: 'primary.dark', color: 'primary.contrastText' } }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        columns={encabezados}
        rows={datos}
        getRowId={(row) => row[idPropiedad]}
      />
    </Paper>
  );
};

//Exportar componente
export default MuiTablaBase;
