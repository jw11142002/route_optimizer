import React, { useRef, useState, useCallback } from 'react'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  SkeletonText,
  Text,
  VStack,
  Heading,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes, FaPlus } from 'react-icons/fa'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'

const center = { lat: 32.7157, lng: -117.1611 }
const gMapsKey = process.env.REACT_APP_API_KEY

function Map1() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: gMapsKey,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [stops, setStops] = useState([
    { id: 1, address: '' },
    { id: 2, address: '' }
  ])
  const [optimizedOrder, setOptimizedOrder] = useState([])
  const [markers, setMarkers] = useState([])

  const autocompleteRefs = useRef([])

  const updateStop = useCallback((id, address) => {
    setStops(stops => stops.map(stop => stop.id === id ? { ...stop, address } : stop))
  }, [])

  const handlePlaceSelect = useCallback((id, index) => {
    const place = autocompleteRefs.current[index].getPlace()
    if (place && place.formatted_address) {
      updateStop(id, place.formatted_address)
    }
  }, [updateStop])

  const addStop = useCallback(() => {
    if (stops.length < 25) {
      setStops(prevStops => [...prevStops, { id: Date.now(), address: '' }])
    }
  }, [stops.length])

  const removeStop = useCallback((id) => {
    if (stops.length > 2) {
      setStops(prevStops => prevStops.filter(stop => stop.id !== id))
    }
  }, [stops.length])

  const calculateRoute = useCallback(async () => {
    if (stops.some(stop => stop.address === '')) {
      alert('Please enter all stop addresses')
      return
    }
    setMarkers([]);
    
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    
    const origin = stops[0].address
    const destination = stops[stops.length - 1].address
    const waypoints = stops.slice(1, -1).map(stop => ({
      location: stop.address,
      stopover: true
    }))

    try {
      const results = await directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      })
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000)
      setDuration(results.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0) / 60)
      
      // Store the optimized order
      const waypointOrder = results.routes[0].waypoint_order;
      const optimizedOrder = [
        0, 
        ...waypointOrder.map(index => index + 1), 
        stops.length - 1
      ];
      setOptimizedOrder(optimizedOrder);

      // Add markers for each stop
      optimizedOrder.forEach((index, i) => {
        geocoder.geocode({ address: stops[index].address }, (results, status) => {
          if (status === 'google.maps.GeocoderStatus.OK') {
            setMarkers(prev => [...prev, {
              position: results[0].geometry.location,
              label: `${i + 1}`
            }]);
          }
        });
      });
    } catch (error) {
      alert('Could not calculate route: ' + error.message)
    }
  }, [stops])

  const clearRoute = useCallback(() => {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setStops([{ id: 1, address: '' }, { id: 2, address: '' }])
    setOptimizedOrder([])
    setMarkers([]) // Clear all markers
  }, [])

  const toggleSidebar = useCallback(() => setIsOpen(prev => !prev), [])

  const generateGoogleMapsUrl = useCallback((optimizedOrder, stops) => {
    if (optimizedOrder.length === 0 || stops.length === 0) return '';

    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const origin = encodeURIComponent(stops[optimizedOrder[0]].address);
    const destination = encodeURIComponent(stops[optimizedOrder[optimizedOrder.length - 1]].address);
    
    let waypoints = optimizedOrder.slice(1, -1).map(index => 
      encodeURIComponent(stops[index].address)
    ).join('|');

    return `${baseUrl}&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  }, []);

  const OptimizedOrderSummary = ({ optimizedOrder, stops, generateGoogleMapsUrl }) => {
    const mapsUrl = generateGoogleMapsUrl(optimizedOrder, stops);

    return (
      <Box mt={4}>
        <Text fontWeight="bold">Optimized Route Order:</Text>
        <VStack align="stretch" mt={2}>
          {optimizedOrder.map((index, i) => (
            <Text key={i}>
              {i + 1}. {stops[index].address}
            </Text>
          ))}
        </VStack>
        {mapsUrl && (
          <Button 
            mt={4} 
            colorScheme="blue" 
            onClick={() => window.open(mapsUrl, '_blank')}
          >
            Open in Google Maps
          </Button>
        )}
      </Box>
    )
  }

  if (!isLoaded) {
    return <SkeletonText />
  }

  return (
    <Flex position="relative" h="100vh" w="100vw">
      {/* Sidebar */}
      <Box
        position="absolute"
        left={0}
        top={0}
        h="100%"
        w={isOpen ? "400px" : "0"}
        bg="white"
        boxShadow="2xl"
        transition="width 0.3s ease"
        zIndex={2}
        overflow="hidden"
      >
        <VStack 
          spacing={4} 
          align="stretch" 
          p={4} 
          h="100%"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray',
              borderRadius: '24px',
            },
          }}
        >
          <Heading size="lg">Route Planner</Heading>
          {stops.map((stop, index) => (
            <Box key={stop.id} position="relative" role="group">
              <Autocomplete
                onLoad={autocomplete => {
                  autocompleteRefs.current[index] = autocomplete
                }}
                onPlaceChanged={() => handlePlaceSelect(stop.id, index)}
              >
                <Input
                  w='300px'
                  value={stop.address}
                  onChange={(e) => updateStop(stop.id, e.target.value)}
                  placeholder={index === 0 ? 'Start' : index === stops.length - 1 ? 'Destination' : `Stop ${index}`}
                />
              </Autocomplete>
              {stops.length > 2 && (
                <IconButton
                  aria-label="Remove stop"
                  icon={<FaTimes />}
                  position="absolute"
                  right="10px"
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={() => removeStop(stop.id)}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                />
              )}
            </Box>
          ))}
          {stops.length < 25 && (
            <Button leftIcon={<FaPlus />} onClick={addStop} colorScheme="green">
              Add another stop
            </Button>
          )}
          <Button colorScheme='blue' onClick={calculateRoute}>
            Calculate Route
          </Button>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
          {distance && duration && (
            <VStack>
              <Text fontWeight="bold">Distance: {distance.toFixed(2)} km</Text>
              <Text fontWeight="bold">Duration: {Math.round(duration)} minutes</Text>
              <IconButton
                aria-label='clear route'
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </VStack>
          )}
          {optimizedOrder.length > 0 && (
            <OptimizedOrderSummary 
              optimizedOrder={optimizedOrder} 
              stops={stops} 
              generateGoogleMapsUrl={generateGoogleMapsUrl}
            />
          )}
        </VStack>
      </Box>

      {/* Toggle button for sidebar */}
      <IconButton
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        icon={isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        onClick={toggleSidebar}
        position="absolute"
        left={isOpen ? "400px" : "0"}
        top="50%"
        transform="translateY(-50%)"
        zIndex={3}
        transition="left 0.3s ease"
      />

      {/* Google Map */}
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              label={marker.label}
            />
          ))}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
    </Flex>
  )
}

export default Map1