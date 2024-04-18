import React, { useState, useEffect, useRef, } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, StatusBar, SafeAreaView, Alert, Image, Dimensions, Pressable } from 'react-native';
import MapCard from '../components/MapCards';
import SearchBar from '../components/SearchBar';
import Carousel from 'react-native-snap-carousel';
import { decodePolyline } from '../utils/helpers';
import TransportMode from '../components/TransportMode';
import { MAP_API_KEY } from '@env'
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'


const MapScreen = (props) => {
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
    const radius = 2;
    const filterDistanceValue = 50;

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'We need location permissions to get your location.');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
            fitToFrame(currentLocation.coords);
            createPolyline(selectedIndex, currentLocation.coords);
            filterEventsWithinRadius(currentLocation.coords, radius);

            // Fetch data from the API
            fetch('https://mapstem-api.azurewebsites.net/api/Event')
                .then((response) => response.json())
                .then((data) => {
                    const onsiteEvents = data.filter((event) => event.eventType === 'Onsite' && event.eventStatus === 'Active');
                    seteventsData(onsiteEvents)
                    const eventCoordinates = onsiteEvents.map((event) => ({
                        latitude: parseFloat(event.latitude),
                        longitude: parseFloat(event.longitude),
                    }));
                    setEventsCoordinates(eventCoordinates);
                    const filteredEvent = onsiteEvents.filter((event) => {
                        const subjectString = Array.isArray(event.subject) ? event.subject.join(', ').toLowerCase() : '';
                        return (
                            event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            subjectString.includes(searchQuery.toLowerCase())
                        );
                    });
                    setFilteredEvents(filteredEvent);
                    // Convert subject array to a string and lowercase for comparison

                })
                .catch((error) => console.error('Error fetching data:', error));
        })();
    }, [searchQuery]);


    const filterEventsWithinRadius = (userLocation) => {
        const filtered = eventsCoordinates.filter((event) => {
            const distance = getDistance(userLocation, event);
            console.log(`Distance for event: ${distance} miles`);
            return distance <= radius;
        });
        setFilteredEvents(filtered);
    };


    const getDistance = (coord1, coord2) => {
        const R = 3959;
        const dLat = deg2rad(coord2.latitude - coord1.latitude);
        const dLon = deg2rad(coord2.longitude - coord1.longitude);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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



    const createPolyline = (eventIndex, userLocation) => {
        if (eventsCoordinates.length > 0 && eventIndex >= 0 && eventIndex < eventsCoordinates.length) {
            const destination = eventsCoordinates[eventIndex];
            if (destination && destination.latitude && destination.longitude) {
                const destinationString = `${destination.latitude},${destination.longitude}`;
                const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${destinationString}&key=${MAP_API_KEY}`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        const points = data.routes[0].overview_polyline.points;
                        const res = decodePolyline(points);
                        setpolylineCoords(res);

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
        const distance = getDistance(location, eventsCoordinates[index]);
        if (distance <= filterDistanceValue) {
            return <MapCard item={item} navigation={navigation} isSelected={selectedIndex === index} distance={distance} />;
        } else {
            return null; // Hide the MapCard if distance is greater than 3 miles
        }
    };

    const onSnapFunc = (ind) => {
        if (getDistance(location, eventsCoordinates[ind]) <= filterDistanceValue) {
            setSelectedIndex(ind);
            createPolyline(ind, location);
        } else {
            // Do not snap to the next item if the distance is greater than 3 miles
            return;
        }
    
        if (carouselRef.current) {
            carouselRef.current.snapToItem(ind);
        }
    };



    const visibleEvents = filteredEvents.filter((event) => {
        const distance = getDistance(location, { latitude: parseFloat(event.latitude), longitude: parseFloat(event.longitude) });
        return distance <= filterDistanceValue;
    });

    const getMarkerRotation = () => {
        return 180;
    };

    const onEventMarkerPress = (index) => {
        setSelectedIndex(index);
        createPolyline(index, location);

        if (carouselRef.current) {
            carouselRef.current.snapToItem(index);
        }
    };

    const fitMarkersOnMap = () => {
        let minLat = location.latitude;
        let maxLat = location.latitude;
        let minLng = location.longitude;
        let maxLng = location.longitude;

        // Find min and max coordinates among current location and event markers
        eventsCoordinates.forEach((marker) => {
            minLat = Math.min(minLat, marker.latitude);
            maxLat = Math.max(maxLat, marker.latitude);
            minLng = Math.min(minLng, marker.longitude);
            maxLng = Math.max(maxLng, marker.longitude);
        });

        // Calculate center and delta for the region
        const latDelta = (maxLat - minLat) * 12.2; // Add some padding
        const lngDelta = (maxLng - minLng) * 12.2; // Add some padding
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // Set the region of the map to fit both current location and event markers
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

        // Zoom out the map by adjusting the region
        mapRef.current.animateToRegion(
            {
                latitude: centerLat,
                longitude: centerLng,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta,
            },
            1000 // Animation duration
        );
    };

    // Call this function once both location and eventsCoordinates are set
    useEffect(() => {
        if (location && eventsCoordinates.length > 0) {
            fitMarkersOnMap();
        }
    }, [location, eventsCoordinates]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <StatusBar backgroundColor='transparent' translucent />
            <View style={{ flex: 1, width: '100%', position: 'relative', }}>
                {eventsData &&
                    <>
                        <MapView
                            ref={mapRef}
                            style={{ width: '100%', flex: 1, }}
                            provider={PROVIDER_GOOGLE}
                        // initialRegion={{
                        //     latitude: location ? location.latitude : 37.78825,
                        //     longitude: location ? location.longitude : -122.4324,
                        //     latitudeDelta: 0.2,
                        //     longitudeDelta: 0.2,
                        // }}
                        >
                            {location && (
                                <Marker
                                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                                    pinColor="blue"
                                    rotation={getMarkerRotation()}
                                />
                            )}
                            {filteredEvents.map((coordinate, index) => {
                                const distance = getDistance(location, coordinate);
                                if (distance <= filterDistanceValue) {
                                    return (
                                        <Marker
                                            key={index}
                                            coordinate={coordinate}
                                            onPress={() => onEventMarkerPress(index)}
                                        >
                                            <Image
                                                source={require('../assets/eventMarker.png')}
                                                style={{ width: selectedIndex === index ? 40 : 25, height: selectedIndex === index ? 40 : 25 }}
                                                resizeMode="contain"
                                            />
                                        </Marker>
                                    );
                                } else {
                                    return null; // Hide the marker if distance is greater than 3 miles
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
                                <TransportMode userLocation={location} destination={eventsCoordinates[selectedIndex]} />
                            }
                        </View>
                        {location && !route?.params?.eventId &&
                            <View style={{ position: 'absolute', bottom: 0, }}>
                                <Carousel
                                    // ref={(c) => { this._carousel = c; }}
                                    // layoutCardOffset={9}
                                    ref={carouselRef}
                                    data={visibleEvents}
                                    renderItem={_renderItem}
                                    sliderWidth={Dimensions.get('screen').width}
                                    itemWidth={Dimensions.get('screen').width / 2.09}
                                    containerCustomStyle={{ flexGrow: 0, flex: 1, height: Dimensions.get('screen').height / 2.5, width: '100%', }}
                                    slideStyle={{ flex: 1, justifyContent: 'flex-end', marginHorizontal: 2.5 }}
                                    contentContainerCustomStyle={{ height: '100%', }}
                                    // sliderHeight={300}
                                    // itemHeight={300}
                                    inactiveSlideOpacity={1}
                                    inactiveSlideShift={28}
                                    inactiveSlideScale={0.9}
                                    firstItem={selectedIndex}
                                    onSnapToItem={onSnapFunc}
                                />
                            </View>
                        }
                    </>
                }
            </View>

        </SafeAreaView>
    );
}

export default MapScreen;

