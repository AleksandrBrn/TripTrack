import { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RouteIcon from '@mui/icons-material/Route';
import { useDrivers } from '@/modules/trip-session';
import { useSetSelectedRoute, useResetSelectedRoute } from '@/modules/map';

export function DriversListFeature({ onClick }) {
  const drivers = useDrivers();
  const setSelectedRoute = useSetSelectedRoute();
  const resetSelectedRoute = useResetSelectedRoute();
  const [selectedDriver, setSelectedDriver] = useState(null);

  if (!drivers) return null;


  const onRouteClickHandler = (geometry) => {
    resetSelectedRoute();
    setSelectedRoute(geometry);
    onClick();
  };

  return (
    <Box sx={{ display: 'flex', mt: 2 }}>
      {/* Список водителей */}
      <Box sx={{ width: 300, borderRight: '1px solid #eee' }}>
        <List>
          {drivers.map((driver, index) => (
            <ListItemButton
              key={index}
              selected={selectedDriver?.driverName === driver.driverName}
              onClick={() => setSelectedDriver(driver)}
            >
              <ListItemText
                primary={driver.driverName}
                secondary={`Общая дистанция: ${driver.totalDistance.toFixed(2)} км`}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Таблица маршрутов */}
      <Box sx={{ flex: 1, p: 2 }}>
        {selectedDriver ? (
          <>
            <Typography variant="h6" gutterBottom>
              ФИО: {selectedDriver.driverName}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Общая дистанция: {selectedDriver.totalDistance.toFixed(2)}
            </Typography>
            <DataGrid
              rows={selectedDriver.routes.map((route) => ({
                id: `${selectedDriver.driverName}|${route.date}`,
                date: route.date,
                distance: route.distance.toFixed(2),
                geoJSON: route.geometry
              }))}
              columns={[
                { field: 'date', headerName: 'Дата', width: 130 },
                { field: 'distance', headerName: 'Дистанция (км)', width: 160 },
                {
                  field: 'action',
                  headerName: '',
                  width: 80,
                  sortable: false,
                  renderCell: (params) => (
                    <IconButton
                      color="primary"
                      onClick={() => {
                        onRouteClickHandler(params.row.geoJSON);
                      }}
                    >
                      <RouteIcon />
                    </IconButton>
                  ),
                },
              ]}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
            />
          </>
        ) : (
          <Typography sx={{ mt: 2 }}>Выберите водителя слева</Typography>
        )}
      </Box>
    </Box>
  );
}

