import React from 'react';
import { useState } from 'react';

//React Router
import { useNavigate } from 'react-router';

//MUI
//Componentes para tabla MUI
import { DataGrid, Toolbar, ToolbarButton, FilterPanelTrigger } from '@mui/x-data-grid';
//Componentes generales MUI
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ComponenteListaDinamica from './ComponenteLIstaDinamica';
import { Typography } from '@mui/material';

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

//Componente MuiTablaBase
//Ejemplo de como utilizar:
{
  /* <MuiTablaBase
          seleccionable={true} //Valor puede ser true o false
          encabezadoSeleccionable="Acciones"
          idPropiedad={'ID_DEBE_SER_UNICO_PARA_QUE_LA_TABLA_LO_PUEDA_IDENTIFICAR'}
          datos={arreglo} 
          filtro={true} //Valor puede ser true o false
          estructuraEncabezados={[
            { propiedad: 'test1', encabezadoTitulo: 'prueba1abcdefghijklmnopqrstuvwxyz' },
            { propiedad: 'test2', encabezadoTitulo: 'prueba2' },
            { propiedad: 'test3', encabezadoTitulo: 'prueba3' },
            { propiedad: 'test4', encabezadoTitulo: 'prueba4' },
            { propiedad: 'test5', encabezadoTitulo: 'prueba5' },
            { propiedad: 'test6', encabezadoTitulo: 'prueba6', formato: 'moneda' }, //Esta columna podria tener numeros que deseo aplicarles un formato, por ejemplo 14698.36797721 --> 14,698.36
            { propiedad: 'test7', encabezadoTitulo: 'prueba7' },
            { propiedad: 'test8', encabezadoTitulo: 'prueba8' }, 
            { propiedad: 'test9', encabezadoTitulo: 'prueba9' }, 
            { propiedad: 'test10', encabezadoTitulo: 'prueba10', editable:true} // Editable true indica que la celda podra editarse al
          ]}
        /> */
}

//Filtro que se muestra por encima de la tabla
function CustomToolbar({ setFilterButton }) {
  return (
    <Toolbar sx={{ height: '80px', display: 'flex', justifyContent: 'left' }}>
      <Tooltip title="Filtros">
        <FilterPanelTrigger render={<ToolbarButton />} ref={setFilterButton}>
          <FilterOutlined fontSize="40px" />
        </FilterPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

const MuiTablaBase = ({
  estructuraEncabezados,
  datos,
  onSelectRow,
  encabezadoSeleccionable = 'Selección',
  seleccionable = false,
  idPropiedad = 'id',
  filtro = false,
  viewPdfFunction,
  viewXmlFunction
}) => {
  const [selectedRowId, setSelectedRowId] = useState(null);

  const navigate = useNavigate();

  if(!estructuraEncabezados){
    estructuraEncabezados=[]
    // return <Typography variant={'h6'} >Propiedad faltante</Typography>
  }
  
  const encabezados = estructuraEncabezados.map((item) => {
    const calculatedFlex = item.encabezadoTitulo.length > 15 ? 2 : 1;

    //Columna base
    let columnaBase = {
      field: item.propiedad,
      headerName: item.encabezadoTitulo,
      flex: calculatedFlex,
      editable: item.editable,
      align: item.alineamiento ? item.alineamiento : '',
      headerAlign: item.alineamientoEncabezado ? item.alineamientoEncabezado : ''
    };
    
    if(item.renderizarBoton){
      columnaBase = {
        ...columnaBase,
        renderCell: (params) => (
          <ComponenteListaDinamica label={params.value}/>
        )}
    }

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
          console.log(newSelectedId);
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
            <Tooltip title="Pdf">
              <IconButton
                onClick={()=>viewPdfFunction(params)}
                aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.pdf}`}
                color="error"
                size="large"
                disabled={!params.row.pdf}
                sx={{ width: '25%', height: '100%' }}
              >
                {isSelected ? <FilePdfOutlined fontSize="large" /> : <FilePdfOutlined fontSize="large" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="XML">
              <IconButton
                onClick={()=>viewXmlFunction(params)}
                aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.poliza}`}
                color="success"
                size="large"
                disabled={!params.row.xml}
                sx={{ width: '25%', height: '100%' }}
              >
                {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <CodeOutlined fontSize="large" />}
              </IconButton>
            </Tooltip>
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
  } else if(seleccionable) {
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
          console.log('Selected row factura:', params.row);
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

  const validRows = Array.isArray(datos) ? datos.filter((row) => row[idPropiedad] !== undefined && row[idPropiedad] !== null) : [];

  return (
    //Altura default altura 400 -->   <Paper sx={{ height: 400, width: '100%' }}>
    <Paper sx={{ height: '100%', width: '100%' }}>
      {filtro ? (
        <DataGrid
          sx={{
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'primary.dark',
              color: 'primary.contrastText'
            }
          }}
          showToolbar
          slots={{ toolbar: CustomToolbar }}
          localeText={{
            ...esES.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: 'No hay datos disponibles para mostrar.'
          }}
          columns={encabezados}
          rows={validRows}
          getRowId={(row) => row[idPropiedad]}
          id={'ad'}
        />
      ) : (
        <DataGrid
          sx={{
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'primary.dark',
              color: 'primary.contrastText'
            }
          }}
          localeText={{
            ...esES.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: 'No hay datos disponibles para mostrar.'
          }}
          columns={encabezados}
          rows={validRows}
          getRowId={(row) => row[idPropiedad]}
        />
      )}
    </Paper>
  );
};

//Exportar componente
export default MuiTablaBase;
