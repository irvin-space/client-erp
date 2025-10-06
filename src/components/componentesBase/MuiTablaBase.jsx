import * as React from 'react';
import {
  DataGrid
  // We avoid GridToolbar and all deprecated toolbar helpers
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { esES } from '@mui/x-data-grid/locales';

/**
 * Reusable DataTable without any deprecated MUI X components.
 *
 * @param {{ rows: object[], columns: object[], onSelectRow?: Function, enableFiltering?: boolean, pageSize?: number, pageSizeOptions?: number[] }} props
 */
export default function MuiTablaBase({
  rows = [],
  columns,
  onSelectRow = null,
  enableFiltering = true,
  pageSize = 50,
  pageSizeOptions = [50, 100]
}) {
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [quickFilterValue, setQuickFilterValue] = React.useState('');
  const [filterButtonEl, setFilterButtonEl] = React.useState(null);

  // Reset selection when data changes
  React.useEffect(() => {
    setSelectedRowId(null);
  }, [rows]);

  // Add selection column if needed
  const finalColumns = React.useMemo(() => {
    if (!onSelectRow) return columns;

    return [
      ...columns,
      {
        field: 'selection',
        headerName: 'Select',
        width: 100,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderHeader: () => <strong>Select</strong>,
        renderCell: (params) => {
          const isSelected = selectedRowId === params.row.id;

          const handleSelect = () => {
            setSelectedRowId(params.row.id);
            onSelectRow?.(params.row);
          };

          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <IconButton onClick={handleSelect} aria-label={isSelected ? 'Deselect row' : 'Select row'} color="success" size="small">
                {isSelected ? (
                  <img src="/icons/check-circle-filled.svg" alt="" style={{ fontSize: '20px' }} />
                ) : (
                  <img src="/icons/check-circle-outlined.svg" alt="" style={{ fontSize: '20px' }} />
                )}
                {/* Or use AntDesign icons if still loaded */}
              </IconButton>
            </Box>
          );
        }
      }
    ];
  }, [columns, onSelectRow, selectedRowId]);

  if (!rows.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={finalColumns}
        // ✅ Correct way to set initial pagination in v7+
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize }
          }
        }}
        pageSizeOptions={pageSizeOptions}
        onRowSelectionModelChange={(newSelection) => {
          if (newSelection.length > 0 && onSelectRow) {
            const selectedId = newSelection[0];
            const selectedRow = rows.find((row) => row.id === selectedId);
            if (selectedRow) {
              setSelectedRowId(selectedId);
              onSelectRow(selectedRow);
            }
          }
        }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.dark',
            color: 'primary.contrastText',
            py: 0.5,
            px: 1
          }
        }}
        // 🔍 Manual Toolbar (no GridToolbar used)
        slots={{
          toolbar: enableFiltering
            ? () => (
                <div style={{ padding: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Custom Filter Button */}
                  <Button
                    ref={setFilterButtonEl}
                    startIcon={<FilterListIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => setFilterButtonEl((prev) => prev || document.activeElement)}
                  >
                    Filters
                  </Button>

                  {/* Quick Search Input */}
                  <TextField
                    value={quickFilterValue}
                    onChange={(e) => setQuickFilterValue(e.target.value)}
                    placeholder="Search all fields..."
                    variant="outlined"
                    size="small"
                    InputProps={{ style: { minWidth: 200 } }}
                    sx={{ flexGrow: 1, maxWidth: 300 }}
                  />

                  {/* Clear button */}
                  {quickFilterValue && (
                    <IconButton size="small" onClick={() => setQuickFilterValue('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </div>
              )
            : null
        }}
        slotProps={{
          panel: {
            // For filter panel anchor
            anchorEl: filterButtonEl,
            placement: 'bottom-start',
            onExited: () => setFilterButtonEl(null)
          },
          baseButton: {
            size: 'small',
            variant: 'outlined'
          },
          // Apply quick filter logic manually
          toolbar: {}
        }}
        // Pass external filter value
        filterModel={{
          items: [],
          quickFilterValues: quickFilterValue ? [quickFilterValue] : []
        }}
        onFilterModelChange={(model) => {
          // Optional: sync with state or URL
        }}
        checkboxSelection={false}
        disableRowSelectionOnClick
        // Disable unnecessary UI if filtering is off
        {...(!enableFiltering && {
          disableColumnFilter: true,
          disableColumnSelector: true,
          disableDensitySelector: true
        })}
      />
    </Paper>
  );
}
