import { Box } from '@mui/material';
import { UploadTripsFeature } from '@/modules/trip-session';
import { DriversListFeature } from '@/modules/drivers-list';
import { MapViewer, useSetOpen } from '@/modules/map';
import { ReportFeature } from '@/modules/report';

export default function HomePage() {
  const setOpenMap = useSetOpen();

  return (
    <Box sx={{
      position: 'relative', 
      display: 'flex',
      mx: 'auto',
      my: 0,
      maxWidth: 1600,  
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      {/* Загрузка файла */}
      <Box sx={{ display: 'flex', p: 2 }}>
        <UploadTripsFeature />
        <ReportFeature />
      </Box>

      {/* Таблица + список водителей */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          paddingBottom: '320px', // чтобы таблицу не перекрывала карта
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <DriversListFeature onClick={() => setOpenMap(true)} />
          </Box>
        </Box>
      </Box>

      {/* Фиксированная карта */}
      {/* <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 2,
          right: 2,
          height: 300,
          borderTop: '1px solid #ccc',
          backgroundColor: '#fff',
          zIndex: 100,
        }}
      >
        <MapViewer />
      </Box> */}
      <MapViewer />
    </Box>
  );
}

