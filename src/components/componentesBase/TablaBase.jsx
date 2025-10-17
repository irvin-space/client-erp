import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { toLower } from 'lodash-es';

import MonedaFormatoMiles from './MonedaFormatoMiles';

// Definición del tipo de las props para mayor claridad
// En TypeScript podrías usar una interfaz, pero para JS es un buen comentario.
/**
 * @typedef {Object} ColumnConfig
 * @property {string} field - El nombre del campo en el objeto de datos (e.g., 'tramite').
 * @property {string} headerName - El nombre de la columna que se mostrará en la tabla (e.g., 'Folio Trámite').
 */

/**
 * @typedef {Object} CustomTableProps
 * @property {Array<Object>} data - Un arreglo de objetos que contiene los datos a mostrar.
 * @property {Array<ColumnConfig>} columnsConfig - Un arreglo que define las columnas de la tabla.
 */

/**
 * Componente de tabla reutilizable para mostrar datos dinámicamente.
 * @param {CustomTableProps} props
 */
const TablaBase = ({ data, columnsConfig }) => {
  // Manejo de casos si no hay datos o la configuración de columnas

  if (!data || data.length === 0 || !columnsConfig || columnsConfig.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ my: 4 }}>
        No hay datos para mostrar.
      </Typography>
    );
  }

  const colorAzulMarino = '#00345D';

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="custom table">
        <TableHead sx={{ backgroundColor: colorAzulMarino }}>
          <TableRow>
            {columnsConfig.map((col, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{ color: 'white', borderBottom: '1px solid ${colorAzulMarino}', textTransform: 'none' }}
              >
                <Typography variant="subtitle1">{col.headerName}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columnsConfig.map((col, colIndex) => {
                
                // 💡 PASO 1: VERIFICAR SI HAY UN RENDERER PERSONALIZADO
                if (col.cellRenderer) {
                  
                  // Si existe un renderer, lo ejecutamos y renderizamos su resultado.
                  // Le pasamos la fila completa (row) para que pueda acceder a 'documento.factura'
                  const CellContent = col.cellRenderer(row); 
                  
                  return (
                    <TableCell key={colIndex} align="center"> {/* Alineamos al centro para los iconos */}
                      {CellContent}
                    </TableCell>
                  );
                } 
                
                // 💡 PASO 2: LÓGICA RÍGIDA PARA CASOS DE MONEDA
                // Usamos el 'else if' para mantener tu lógica existente de formato
                else if (col.field === 'total_movimiento' || col.field === 'total_factura' || col.field === 'saldo_actual_factura') {
                  return (
                    <TableCell key={colIndex} align="center">
                      {<MonedaFormatoMiles cantidad={row[col.field]} etiquetaHTML={'p'} /> ?? 'N/A'}
                    </TableCell>
                  );
                }
                
                // 💡 PASO 3: RENDERIZADO POR DEFECTO (muestra el valor del campo)
                else {
                  return (
                    <TableCell key={colIndex} align="center">
                      {row[col.field] ?? 'N/A'}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaBase;
