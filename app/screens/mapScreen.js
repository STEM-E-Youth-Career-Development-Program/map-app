import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, Text, StatusBar, SafeAreaView, Alert, Image, Dimensions, Pressable, TouchableWithoutFeedback, Keyboard, Linking } from 'react-native';
import MapCard from '../components/MapCards';
import SearchBar from '../components/SearchBar';
import Carousel from 'react-native-snap-carousel';
import { decodePolyline } from '../utils/helpers';
import TransportMode from '../components/TransportMode';
import { MAP_API_KEY } from '@env'
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Loading from 'react-native-loading-spinner-overlay';
import * as polyline from 'google-polyline';
import simplify from 'simplify-js';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapScreen = () => {
    const mapRef = useRef(null);
    const carouselRef = useRef(null);
    const route = useRoute();
    const navigation = useNavigation()
    const [eventsData, seteventsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState(null);
    const [polylineCoords, setpolylineCoords] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [eventsCoordinates, setEventsCoordinates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleEvents, setVisibleEvents] = useState([]);
    const radius = 2;
    const filterDistanceValue = 50;
    const [fetchError, setFetchError] = useState(null);

    const handleSearch = debounce((text) => {
        setSearchQuery(text);
    }, 300);

    useEffect(() => {
        if (eventsData.length > 0) {
            const filteredEvent = eventsData.filter((event) => {
                const subjectString = Array.isArray(event.subject) ? event.subject.join(', ').toLowerCase() : '';
                return (
                    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    subjectString.includes(searchQuery.toLowerCase())
                );
            });
            setFilteredEvents(filteredEvent);
        }
    }, [searchQuery, eventsData]);


    useEffect(() => {
        console.log('useEffect called');
        const fetchData = async () => {
            console.log('fetchData called');
          setIsLoading(true);
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission denied', 'We need location permissions to get your location.');
            setIsLoading(false);
            return;
          }
          try {
            // const currentLocation = await Location.getCurrentPositionAsync();
            const currentLocation = await Location.getCurrentPositionAsync({ timeout: 10000, enableHighAccuracy: true, });
            // console.log('Got current location:', currentLocation);
            setLocation(currentLocation.coords);
            AsyncStorage.setItem('location', JSON.stringify(currentLocation.coords));
            fitToFrame(currentLocation.coords);
            filterEventsWithinRadius(currentLocation.coords, radius);
      
            fetch('https://mapstem-api.azurewebsites.net/api/Event')
              .then((response) => response.json())
              .then((data) => {
                const onsiteEvents = data.filter((event) => event.eventType === 'Onsite' && event.eventStatus === 'Active');
                seteventsData(onsiteEvents);
                const eventCoordinates = onsiteEvents.map((event) => ({
                  latitude: parseFloat(event.latitude) || 29.759141,
                  longitude: parseFloat(event.longitude) || -95.370310,
                }));
      
                setEventsCoordinates(eventCoordinates);
                setFilteredEvents(onsiteEvents); // Initially show all events
              })
              .catch((error) => {
                console.error('Error fetching data:', error);
                setFetchError(error.message);
              })
              .finally(() => setIsLoading(false));
          } catch (error) {
            console.log('Error getting current location:', error);
            setIsLoading(false);
          }
        };
      
        fetchData();
      }, []);

      
    useEffect(() => {
        if (location && eventsData.length > 0) {
            const sortedEvents = eventsData.sort((a, b) => {
                const distanceA = getDistance(location, { latitude: parseFloat(a.latitude), longitude: parseFloat(a.longitude) });
                const distanceB = getDistance(location, { latitude: parseFloat(b.latitude), longitude: parseFloat(b.longitude) });
                return distanceA - distanceB;
            });

            setFilteredEvents(sortedEvents);
            setVisibleEvents(sortedEvents);
            setEventsCoordinates(sortedEvents.map((event) => ({ latitude: parseFloat(event.latitude), longitude: parseFloat(event.longitude) })));
            fitMarkersOnMap();
        }
    }, [location, eventsData]);


    const filterEventsWithinRadius = (location, radius, query) => {
        const filtered = eventsData.filter((event) => {
            // Check if latitude and longitude are defined
            if (event.latitude && event.longitude) {
                const eventLocation = { latitude: parseFloat(event.latitude), longitude: parseFloat(event.longitude) };
                const distance = getDistance(location, eventLocation);

                const subjectString = Array.isArray(event.subject) ? event.subject.join(', ').toLowerCase() : '';
                const isMatchingSearch = (
                    event.eventName.toLowerCase().includes(query.toLowerCase()) ||
                    subjectString.includes(query.toLowerCase())
                );

                return distance <= (radius * 1609.34) && isMatchingSearch; // Radius converted to meters
            } else {
                // If latitude or longitude is missing, exclude the event
                return false;
            }
        });

        setFilteredEvents(filtered);
        setVisibleEvents(filtered);
        setEventsCoordinates(filtered.map((event) => ({
            latitude: parseFloat(event.latitude),
            longitude: parseFloat(event.longitude)
        })));
    };


    useEffect(() => {
        if (location) {
            filterEventsWithinRadius(location, radius, searchQuery);
        }
    }, [location, searchQuery, eventsData]);



    const getDistance = (coord1, coord2) => {
        const R = 3959; // Radius of the Earth in miles
        const lat1 = deg2rad(coord1.latitude);
        const lon1 = deg2rad(coord1.longitude);
        const lat2 = deg2rad(coord2.latitude);
        const lon2 = deg2rad(coord2.longitude);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    useFocusEffect(
        React.useCallback(() => {
            if (route?.params?.eventId) {
                const ind = filteredEvents.findIndex((item) => item.id == route?.params?.eventId)
                onSnapFunc(ind)
            }
            return () => {
                navigation.setParams({
                    eventId: null,
                });
            };
        }, [route?.params?.eventId])
    );

    const fitToFrame = (userLocation) => {
        let eventLocs = eventsCoordinates.map(({ latitude, longitude }) => ({
            latitude,
            longitude,
        }));
        if (mapRef) {
            mapRef?.current?.fitToCoordinates([...eventLocs, {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude
            }], { edgePadding: { top: 20, right: 20, bottom: 20, left: 20 }, animated: true })
        }
    }
    // const createPolyline = (eventIndex, userLocation) => {
    //     if (eventsCoordinates.length > 0 && eventIndex >= 0 && eventIndex < eventsCoordinates.length) {
    //         const destination = eventsCoordinates[eventIndex];
    //         if (destination && destination.latitude && destination.longitude) {
    //             const coordinates = [
    //                 [userLocation.latitude, userLocation.longitude],
    //                 [destination.latitude, destination.longitude]
    //             ];

    //             const polylineString = polyline.encode(coordinates);
    //             const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${MAP_API_KEY}`;

    //             fetch(apiUrl)
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     const polylinePoints = data.routes[0].overview_polyline.points;
    //                     const polylineCoords = decodePolyline(polylinePoints);
    //                     setpolylineCoords(polylineCoords);

    //                     if (mapRef) {
    //                         mapRef?.current?.fitToCoordinates([
    //                             { latitude: destination.latitude, longitude: destination.longitude },
    //                             { latitude: userLocation.latitude, longitude: userLocation.longitude }
    //                         ], { edgePadding: { top: 80, right: 20, bottom: 80, left: 80 }, animated: true });
    //                     }
    //                 })
    //                 .catch(error => console.error(error));
    //         } else {
    //             console.error('Invalid destination coordinates');
    //         }
    //     } else {
    //         console.error('Invalid eventIndex or eventsCoordinates is empty');
    //     }
    // };

    const createPolyline = (eventIndex, userLocation) => {
        if (eventsCoordinates.length > 0 && eventIndex >= 0 && eventIndex < eventsCoordinates.length) {
            const destination = eventsCoordinates[eventIndex];
            if (destination && destination.latitude && destination.longitude) {
                const coordinates = [
                    { lat: userLocation.latitude, lng: userLocation.longitude },
                    { lat: destination.latitude, lng: destination.longitude }
                ];

                const simplifiedCoords = simplify(coordinates, 0.0001, true); // Adjust tolerance as needed
                const polylineString = polyline.encode(simplifiedCoords.map(coord => [coord.lat, coord.lng]));

                const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${MAP_API_KEY}`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        const polylinePoints = data.routes[0].overview_polyline.points;
                        const polylineCoords = decodePolyline(polylinePoints);
                        setpolylineCoords(polylineCoords);

                        if (mapRef) {
                            mapRef?.current?.fitToCoordinates([
                                { latitude: destination.latitude, longitude: destination.longitude },
                                { latitude: userLocation.latitude, longitude: userLocation.longitude }
                            ], { edgePadding: { top: 80, right: 20, bottom: 80, left: 80 }, animated: true });
                        }
                    })
                    .catch(error => console.error(error));
            } else {
                console.error('Invalid destination coordinates');
            }
        } else {
            console.error('Invalid eventIndex or eventsCoordinates is empty');
        }
    };


    const _renderItem = ({ item, index }) => {
        return (
            <MapCard
                key={index}
                item={item}
                navigation={navigation}
                isSelected={selectedIndex === index}
                distance={getDistance(location, { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) })}
            />
        );
    };

    const onSnapFunc = (ind) => {
        setSelectedIndex(ind);
        createPolyline(ind, location);

        if (carouselRef.current) {
            carouselRef.current.snapToItem(ind);
        }
    };

    const onEventMarkerPress = (index) => {
        setSelectedIndex(index);
        createPolyline(index, location);

        if (carouselRef.current) {
            carouselRef.current.snapToItem(index);
        }
    };

    // Call this function once both location and eventsCoordinates are set
    const fitMarkersOnMap = () => {
        if (!location || !eventsCoordinates || eventsCoordinates.length === 0) {
            return;
        }

        let minLat = location.latitude;
        let maxLat = location.latitude;
        let minLng = location.longitude;
        let maxLng = location.longitude;

        eventsCoordinates.forEach((marker) => {
            if (marker.latitude && marker.longitude) {
                minLat = Math.min(minLat, marker.latitude);
                maxLat = Math.max(maxLat, marker.latitude);
                minLng = Math.min(minLng, marker.longitude);
                maxLng = Math.max(maxLng, marker.longitude);
            }
        });

        const latDelta = (maxLat - minLat) * 12.2; // Add some padding
        const lngDelta = (maxLng - minLng) * 12.2; // Add some padding
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        try {
            mapRef.current.fitToCoordinates(
                [
                    { latitude: minLat, longitude: minLng },
                    { latitude: maxLat, longitude: maxLng },
                ],
                {
                    edgePadding: { top: 150, right: 150, bottom: 150, left: 150 },
                    animated: true,
                }
            );

            mapRef.current.animateToRegion(
                {
                    latitude: centerLat,
                    longitude: centerLng,
                    latitudeDelta: latDelta,
                    longitudeDelta: lngDelta,
                },
                1000 // Animation duration
            );
        } catch (error) {
            console.error('Error fitting to coordinates:', error);
        }
    };

    useEffect(() => {
        if (location && eventsCoordinates.length > 0) {
            fitMarkersOnMap();
        }
    }, [location, eventsCoordinates]);


    const getImageSource = (subject) => {
        if (Array.isArray(subject) && subject.includes('Math') && subject.length === 1) {
            return require('../assets/eventMarkerOrange.png');
        } else if (Array.isArray(subject) && subject.includes('Science') && subject.length === 1) {
            return require('../assets/eventMarkerRed.png');
        } else if (Array.isArray(subject) && subject.includes('Technology') && subject.length === 1) {
            return require('../assets/eventMarkerGreen.png');
        } else if (Array.isArray(subject) && subject.includes('Engineering') && subject.length === 1) {
            return require('../assets/eventMarkerYellow.png');
        } else if (Array.isArray(subject) && subject.includes('Entrepreneurship') && subject.length === 1) {
            return require('../assets/eventMarkerPurple.png');
        } else if (Array.isArray(subject) && subject.length > 1) {
            return require('../assets/eventMarkerWhite.png');
        } else {
            return require('../assets/eventMarkerWhite.png');
        }
    }

    const openGoogleMaps = () => {
        const originAddress = `${location.latitude},${location.longitude}`; // Use the current location's latitude and longitude
        const destinationAddress = filteredEvents[selectedIndex].address; // Get the address from the event data

        const url = `https://google.com/maps?q=${encodeURIComponent(originAddress)}+to+${encodeURIComponent(destinationAddress)}`;
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            {fetchError ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{fetchError}</Text>
                </View>
            ) : (
                <>
                    <StatusBar backgroundColor='transparent' translucent />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1, width: '100%', position: 'relative', }}>
                            <Loading visible={isLoading} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                            {eventsData &&
                                <>
                                    <MapView
                                        ref={mapRef}
                                        style={{ width: '100%', flex: 1, }}
                                        provider={PROVIDER_GOOGLE}

                                    >
                                        {location && (
                                            <Marker
                                                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                                                pinColor="blue"

                                            />
                                        )}

                                        {visibleEvents.map((event, index) => {
                                            if (event.latitude && event.longitude) {
                                                const coordinate = { latitude: event.latitude, longitude: event.longitude };
                                              //  const distance = getDistance(location, coordinate);
                                                const eventSubject = event.subject;

                                                let imageSource = getImageSource(eventSubject);

                                                return (
                                                    <Marker
                                                        key={index}
                                                        coordinate={coordinate}
                                                        onPress={() => onEventMarkerPress(index)}
                                                    >
                                                        <Image
                                                            source={imageSource}
                                                            style={{ width: selectedIndex === index ? 60 : 25, height: selectedIndex === index ? 60 : 25 }}
                                                            resizeMode="contain"
                                                        />
                                                    </Marker>
                                                );
                                            } else {
                                                console.warn(`Event ${event.eventName} is missing latitude or longitude`);
                                                return null;
                                            }
                                        })}


                                        {location && polylineCoords && (
                                            <Polyline
                                                coordinates={[
                                                    { latitude: location.latitude, longitude: location.longitude },
                                                    ...polylineCoords,
                                                ]}
                                                strokeColor={getDistance(location, eventsCoordinates[selectedIndex]) <= filterDistanceValue ? "#000" : "transparent"}
                                                strokeWidth={2.5}
                                            />
                                        )}


                                        {/* Location Radius */}
                                        {location && (
                                            <Circle
                                                center={{ latitude: location.latitude, longitude: location.longitude }}
                                                radius={1609.34 * radius}
                                                strokeWidth={1}
                                                strokeColor="blue"
                                                fillColor="rgba(0, 128, 255, 0.2)"
                                            />
                                        )}
                                    </MapView>
                                    <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 1 }}>
                                        {!route?.params?.eventId ?
                                            <SearchBar
                                                value={searchQuery}
                                                onChangeText={handleSearch}
                                                placeholder="Search for event"
                                                onPressIcon={() => navigation.navigate('Events')}
                                                isList={false} />
                                            :
                                            <Pressable style={{ width: 50, height: 50, backgroundColor: '#fff', borderRadius: 50, marginVertical: 20, left: 25, shadowOpacity: 0.25, shadowRadius: 3.2, shadowOffset: { width: 2, height: 2 }, elevation: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Events')}>
                                                <MaterialCommunityIcons name="arrow-left" size={29} />
                                            </Pressable>

                                        }
                                        {location &&
                                            <Pressable onPress={openGoogleMaps}>
                                                <TransportMode userLocation={location} destination={eventsCoordinates[selectedIndex]} />
                                            </Pressable>
                                        }
                                    </View>

                                    {location && !route?.params?.eventId &&
                                        <View style={{ position: 'absolute', bottom: 0, }}>

                                            {visibleEvents.length > 0 ? (
                                                <Carousel
                                                    ref={carouselRef}
                                                    data={visibleEvents}
                                                    renderItem={_renderItem}
                                                    sliderWidth={Dimensions.get('screen').width}
                                                    itemWidth={Dimensions.get('screen').width / 2.09}
                                                    containerCustomStyle={{ flexGrow: 0, flex: 1, height: Dimensions.get('screen').height / 2.5, width: '100%', }}
                                                    slideStyle={{ flex: 1, justifyContent: 'flex-end', marginHorizontal: 2.5 }}
                                                    contentContainerCustomStyle={{ height: '100%', }}
                                                    inactiveSlideOpacity={1}
                                                    inactiveSlideShift={28}
                                                    inactiveSlideScale={0.9}
                                                    firstItem={selectedIndex}
                                                    onSnapToItem={onSnapFunc}
                                                />
                                            ) : (
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text>No events found within the selected radius</Text>
                                                </View>
                                            )}
                                        </View>
                                    }
                                </>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </>
            )}
        </SafeAreaView>
    );
}

export default MapScreen;