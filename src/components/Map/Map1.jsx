import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
  } from '@chakra-ui/react'
  
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  
import {useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'
  
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

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef()

    if (!isLoaded) {
        return <SkeletonText />
    }

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

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }

    // function dirDrawer() {
    //     const { isOpen, onOpen, onClose } = useDisclosure()
    //     const btnRef = React.useRef()

    //     return (
    //         <>
    //             <Button ref={btnRef} colorScheme='teal' onClock={onOpen}>
    //                 Open
    //             </Button>
    //             <Drawer
    //                 isOpen={isOpen}
    //                 placement='right'
    //                 onClose={onClose}
    //                 finalFocusRef={btnRef}
    //             >
    //                 <DrawerOverlay />
    //                 <DrawerContent>
    //                     <DrawerCloseButton />
    //                     <DrawerHeader>Addresses</DrawerHeader>

    //                     <DrawerBody>
                            
    //                     </DrawerBody>
    //                 </DrawerContent>
    //             </Drawer>
    //         </>
    //     )
    // }

    function DirDrawer() {
        const { isOpen, onOpen, onClose } = useDisclosure()
        return (
          <>
            <Button onClick={onOpen}>Open</Button>
            <Drawer 
                variant="permanent" 
                isOpen={isOpen} 
                onClose={onClose} 
                closeOnOverlayClick={false} 
                placement="left">
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>
      
                <DrawerBody>
                  <form
                    id='my-form'
                    onSubmit={(e) => {
                      e.preventDefault()
                      console.log('submitted')
                    }}
                  >
                    <Input name='nickname' placeholder='Type here...' />
                  </form>
                </DrawerBody>
      
                <DrawerFooter>
                  <Button type='submit' form='my-form'>
                    Save
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        )
      }

    return (
        <Flex
            position='relative'
            flexDirection='column'
            alignItems='center'
            h='100vh'
            w='100vw'
        >
            <Box position='absolute' left={0} top={0} h='100%' w='100%'>
                <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%'}}
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
            <DirDrawer />
                {/* <HStack spacing={2} justifyContent='space-between'>
                    <Box flexGrow={1}>
                        <Autocomplete>
                            <Input type='text' placeholder='Origin' ref={originRef} />
                        </Autocomplete>
                    </Box>
                    <Box flexGrow={1}>
                        <Autocomplete>
                            <Input
                                type='text'
                                placeholder='Destination'
                                ref={destinationRef}
                            />
                        </Autocomplete>
                    </Box>

                </HStack> */}
        </Flex>
    )
}

export default Map1;