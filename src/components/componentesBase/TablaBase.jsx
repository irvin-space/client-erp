import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { toLower } from 'lodash-es';

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
              <TableCell key={index} align="center" sx={{ color: 'white', borderBottom: '1px solid ${colorAzulMarino}', textTransform: 'none' }}>
                <Typography variant="subtitle1" >
                  {col.headerName}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columnsConfig.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {row[col.field] ?? 'N/A'} {/* Accede al valor por el nombre del campo */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaBase;