import React from 'react';
import { useState, useEffect } from 'react';
//MUI
import { DataGrid, Toolbar, ToolbarButton, FilterPanelTrigger } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

//Idioma
import { esES } from '@mui/x-data-grid/locales';

//Ant Design
import { FilterOutlined, CheckCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';

const paginationModel = { page: 0, pageSize: 100 };

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

export default function DataTable({ rowsArray, onSelectRow, sucursalColumna }) {
  const [filterButton, setFilterButton] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Funcion auxiliar
  const generateRowId = (row) => {
    return row.documento != null ? row.documento : `fallback-${row.ficha_deposito}-${row.nombre_tipo}-fecha`;
  };

  const columns = [
    // ...(sucursalColumna ? [sucursalColumna] : []),
    { field: 'sucursal', headerName: 'Sucursal', flex: 2, minWidth: 150, height: 500 },
    { field: 'nombre_tipo', headerName: 'Tipo', flex: 2, minWidth: 150, height: 500, valueFormatter:(value)=> { 
      if(value.includes('Ancipo')){
        return 'Anticipo de Cliente'
      }
    } },
    { field: 'cliente_documento', headerName: 'Cliente', flex: 2, minWidth: 250, height: 500 },
    { field: 'anticipo', headerName: 'Anticipo', flex: 1, minWidth: 100, height: 500 },
    { field: 'ficha_deposito', headerName: 'Ficha Depósito', flex: 1.2, minWidth: 100, align: 'right', headerAlign: 'right' },
    { field: 'fecha_deposito_documento', headerName: 'Fecha', flex: 1, minWidth: 180 },
    {
      field: 'importe_ficha_deposito',
      headerName: 'Importe',
      type: 'number',
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => {
        if (value === undefined || value === null || value === '') {
          return '';
        }

        const num = Number(value);

        if (isNaN(num)) {
          return '—';
        }

        return new Intl.NumberFormat('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(num);
      }
    },
    {
      field: 'saldo_actual_ficha',
      headerName: 'Saldo Actual',
      type: 'number',
      sortable: false,
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => {
        if (value === undefined || value === null || value === '') {
          return '';
        }

        const num = Number(value);

        if (isNaN(num)) {
          return '—';
        }

        return new Intl.NumberFormat('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(num);
      }
    },
    {
      field: 'poliza_ficha',
      headerName: 'Póliza',
      flex: 1,
      minWidth: 100,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'seleccion',
      headerName: 'Selección',
      flex: 1,
      minWidth: 100,
      align: 'center',
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => {
        const generatedId = generateRowId(params.row);
        const isSelected = selectedRowId === generatedId;

        const handleSelect = () => {
          setSelectedRowId(generatedId); // guardar id
          if (onSelectRow) {
            onSelectRow(params.row); // pasar data
          }
        };

        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              px: 0,
              py: 0
            }}
          >
            <IconButton
              onClick={handleSelect}
              aria-label={isSelected ? `Deseleccionar ${params.row.nombre_cliente}` : `Seleccionar ${params.row.nombre_cliente}`}
              color="success"
              size="medium"
              sx={{ width: '100%', height: '100%' }}
            >
              {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <CheckCircleOutlined fontSize="large" />}
            </IconButton>
          </Box>
        );
      }
    }
  ];

  return (
    //Altura default altura 400 -->   <Paper sx={{ height: 400, width: '100%' }}>
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        showToolbar
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          panel: {
            target: filterButton
          },
          toolbar: { setFilterButton }
        }}
        rows={rowsArray}
        getRowId={generateRowId}
        columns={columns}
        rowHeight={52} //valor default 52
        initialState={{ pagination: { paginationModel: paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          minWidth: '650',
          border: 0,
          '& .MuiDataGrid-columnHeader': {
            py: 0.5,
            px: 1,
            backgroundColor: 'primary.dark', // Usa el color primario de tu tema para el fondo
            color: 'primary.contrastText' // Usa el color de texto que contrasta (blanco/negro)
          },
          // ⭐️ Opcional: Asegurar que la barra de herramientas también respete el tema
          '& .MuiDataGrid-toolbarContainer': {
            backgroundColor: 'background.paper', // Usa el color de la superficie del tema
            borderBottom: '1px solid',
            borderColor: 'divider'
          }
        }}
      />
    </Paper>
  );
}
