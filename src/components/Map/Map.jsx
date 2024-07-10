import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormGroup,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

const drawerWidth = 340;

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Map = () => {
  const [open, setOpen] = useState(true);
  const [stops, setStops] = useState([
    { label: 'A', address: '' },
    { label: 'B', address: '' }
  ]);
  const [reorderStops, setReorderStops] = useState(true);
  const [roundTrip, setRoundTrip] = useState(false);
  const [optimizeFor, setOptimizeFor] = useState('shortest_time');
  const [directions, setDirections] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const addStop = () => {
    if (stops.length < 26) {
      const newLabel = String.fromCharCode(65 + stops.length);
      setStops([...stops, { label: newLabel, address: '' }]);
    }
  };

  const updateStop = (index, address) => {
    const newStops = [...stops];
    newStops[index].address = address;
    setStops(newStops);
  };

  const calculateRoute = () => {
    // Implement route calculation logic here
    console.log("Calculating route...");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              Route Planner
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Box sx={{ p: 2, overflowY: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              One address per line (26 max)
            </Typography>
            {stops.map((stop, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ mr: 1, fontWeight: 'bold' }}>{stop.label}</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={stop.address}
                  onChange={(e) => updateStop(index, e.target.value)}
                  placeholder={index === 0 ? "Starting point" : `Stop ${index + 1}`}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addStop}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Add another stop
            </Button>
            
            <Typography variant="subtitle1" gutterBottom>
              Stops
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={reorderStops} onChange={(e) => setReorderStops(e.target.checked)} />}
                label="Let us re-order stops"
              />
              <FormControlLabel
                control={<Checkbox checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} />}
                label="Round trip"
              />
            </FormGroup>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Optimize for
            </Typography>
            <RadioGroup
              value={optimizeFor}
              onChange={(e) => setOptimizeFor(e.target.value)}
            >
              <FormControlLabel value="shortest_time" control={<Radio />} label="Shortest time" />
              <FormControlLabel value="shortest_distance" control={<Radio />} label="Shortest distance" />
            </RadioGroup>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={calculateRoute}
              sx={{ mt: 2 }}
            >
              View route directions
            </Button>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: 'relative',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open && {
              width: `calc(100% - ${drawerWidth}px)`,
              marginLeft: `${drawerWidth}px`,
              transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          }}
        >
          {!isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                position: 'absolute',
                left: open ? drawerWidth : 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}
          <LoadScript googleMapsApiKey=".">
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              zoom={13}
              center={{ lat: 32.8328, lng: -117.1712 }} // San Diego coordinates
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Map;