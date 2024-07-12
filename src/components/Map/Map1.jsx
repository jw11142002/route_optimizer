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
  import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useRef, useState } from 'react'
  
  // Default center coordinates for the map
  const center = { lat: 32.7157, lng: -117.1611 }
  const gMapsKey = process.env.REACT_APP_API_KEY
  
  /**
   * Map1 Component
   * 
   * This component renders a Google Map with route planning functionality.
   * It includes a collapsible sidebar for inputting origin and destination,
   * and displays the calculated route on the map.
   */
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
  
    const originRef = useRef()
    const destinationRef = useRef()
  
    if (!isLoaded) {
      return <SkeletonText />
    }
  
    /**
     * Calculates the route between origin and destination
     */
    async function calculateRoute() {
      if (originRef.current.value === '' || destinationRef.current.value === '') {
        return
      }
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      })
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
    }
  
    /**
     * Clears the calculated route and input fields
     */
    function clearRoute() {
      setDirectionsResponse(null)
      setDistance('')
      setDuration('')
      originRef.current.value = ''
      destinationRef.current.value = ''
    }
  
    /**
     * Toggles the sidebar open/closed state
     */
    const toggleSidebar = () => setIsOpen(!isOpen)
  
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
          <VStack spacing={4} align="stretch" p={4}>
            <Heading size="lg">Route Optimizer</Heading>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
            <Autocomplete>
              <Input type='text' placeholder='Destination' ref={destinationRef} />
            </Autocomplete>
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
                <Text fontWeight="bold">Distance: {distance}</Text>
                <Text fontWeight="bold">Duration: {duration}</Text>
                <IconButton
                  aria-label='clear route'
                  icon={<FaTimes />}
                  onClick={clearRoute}
                />
              </VStack>
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
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
      </Flex>
    )
  }
  
  export default Map1