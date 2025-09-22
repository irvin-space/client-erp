import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid, Toolbar, ToolbarButton, FilterPanelTrigger } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { FilterOutlined } from '@ant-design/icons';
import { esES } from '@mui/x-data-grid/locales';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { CheckCircleOutlined } from '@ant-design/icons';
import { CheckCircleTwoTone } from '@ant-design/icons';

const paginationModel = { page: 0, pageSize: 50 };

function CustomToolbar({ setFilterButtonEl }) {
  return (
    <Toolbar sx={{ height: '80px', display: 'flex', justifyContent: 'left' }}>
      <Tooltip title="Filtros">
        <FilterPanelTrigger render={<ToolbarButton />} ref={setFilterButtonEl}>
          <FilterOutlined fontSize="40px" />
        </FilterPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function DataTable({ datos, onSelectRow }) {
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [arregloDeClientes, setArregloDeClientes] = useState([]);

  const [selectedRowId, setSelectedRowId] = useState(null);

  const columns = [
    { field: 'nombre_cliente', headerName: 'Nombre', flex: 1.5, filterable: true, type: 'string' },
    { field: 'nombre_comercial', headerName: 'Nombre Comercial', flex: 1.5, filterable: true, type: 'string' },
    { field: 'cliente', headerName: 'Clave', headerAlign: 'right', align: 'right', flex: 0.4, filterable: true, type: 'string' },
    {
      field: 'clave_anterior',
      headerName: 'Clave anterior',
      headerAlign: 'right',
      align: 'right',
      flex: 0.6,
      filterable: true,
      type: 'string'
    },
    {
      field: 'rfc',
      headerName: 'RFC',
      headerAlign: 'left',
      type: 'string',
      flex: 0.8,
      filterable: true
    },
    {
      field: 'agente',
      headerName: 'Agente',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 0.5,
      filterable: true,
      type: 'string'
      // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
    },
    {
      field: 'seleccion',
      headerName: 'Selección',
      headerAlign: 'center',
      filterable: false, // usually you don't filter this column
      sortable: false,
      cellClassName: 'no-padding-cell',
      align: 'center',
      renderCell: (params) => {
        const isSelected = selectedRowId === params.row.id;

        const handleSelect = () => {
          setSelectedRowId(params.row.id); // Update local state for visual feedback
          if (onSelectRow) {
            onSelectRow(params.row); // Notify parent
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

  useEffect(() => {
    setSelectedRowId(null);
  }, [datos]);

  useEffect(() => {
    console.log('me he montado o actualizado');
    console.log(datos.length);
    if (datos.length > 0) {
      console.log('datos de cliente arreglo', datos);
      const arregloDeClientesConID = datos[0].map((item) => {
        // console.log("item",item)
        return {
          ...item,
          id: item.cliente
        };
      });
      console.log('arregloDeclientesConID debajo');
      console.log(arregloDeClientes['0']);
      console.log(arregloDeClientesConID);
      setArregloDeClientes(arregloDeClientesConID);
    }
  }, [datos]);

  return (
    //Altura de paper anterior 400
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={arregloDeClientes}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[50, 100]}
        // checkboxSelection
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeader': {
            py: 0.5,
            px: 1,
            backgroundColor: 'primary.dark',
            color: 'primary.lighter'
          },
          '& .MuiDataGrid-menuIconButton': {
            color: 'primary.light',
            opacity: 1
          },
          '&.MuiDataGrid-root .MuiDataGrid-sortIcon': {
            color: 'primary.light',
            opacity: 1
          },
          '& .no-padding-cell': {
            padding: '0 !important'
          }
        }}
        showToolbar
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          panel: {
            target: filterButtonEl
          },
          toolbar: { setFilterButtonEl }
        }}
      />
    </Paper>
  );
}
