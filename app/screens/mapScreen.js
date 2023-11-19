import React, { useState, useEffect, useRef, } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, StatusBar, SafeAreaView, Alert, Image, Dimensions, Pressable } from 'react-native';
import MapCard from '../components/MapCards';
import SearchBar from '../components/SearchBar';
import Carousel from 'react-native-snap-carousel';
import events from '../shared/allevents.json';
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
    const [location, setLocation] = useState(null);
    const [polylineCoords, setpolylineCoords] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [filteredEvents, setFilteredEvents] = useState([]);
    const radius = 0.1;
    // const [listEventId, setlistEventId] = useState(route?.params?.eventId || null)

    useEffect(() => {
        (async () => {
            // Ask for location permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'We need location permissions to get your location.');
                return;
            }

            // Get current location
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
            fitToFrame(currentLocation.coords);
            createPolyline(selectedIndex, currentLocation.coords);
            filterEventsWithinRadius(currentLocation.coords);
        })();

    }, []);

    const filterEventsWithinRadius = (userLocation) => {
        const filtered = events.filter((event) => {
            const distance = getDistance(userLocation, event.coordinate);
            return distance <= radius;
        });
        setFilteredEvents(filtered);
    };

    const getDistance = (coord1, coord2) => {
        // Calculate distance between two coordinates (Haversine formula)
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(coord2.latitude - coord1.latitude);
        const dLon = deg2rad(coord2.longitude - coord1.longitude);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        const distanceInMiles = distance * 0.621371; // Convert distance to miles
        return distanceInMiles;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };


    useFocusEffect(
        React.useCallback(() => {
            // This will run every time the screen is focused or re-focused
            console.log('Screen A is focused', route?.params?.eventId);
            if (route?.params?.eventId) {
                const ind = events.findIndex((item) => item.id == route?.params?.eventId)
                onSnapFunc(ind)
            }

            // Add your logic here
            return () => {
                // This will be called when the component is unmounted or when the effect is cleaned up
                navigation.setParams({
                    eventId: null,
                });
            };
        }, [route?.params?.eventId])
    );

    const fitToFrame = (userLocation) => {
        let eventLocs = events.map(({ coordinate }) => {
            return coordinate
        })
        if (mapRef) {
            // mapRef?.current?.animateToRegion(tempRegion, 100);
            mapRef?.current?.fitToCoordinates([...eventLocs, {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude
            }], { edgePadding: { top: 20, right: 20, bottom: 20, left: 20 }, animated: true })
        }
    }

    const createPolyline = (eventIndex, userLocation) => {
        const destination = events[eventIndex].coordinate.latitude + ',' + events[eventIndex].coordinate.longitude
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude + ',' + userLocation.longitude}&destination=${destination}&key=${MAP_API_KEY}`;
        console.log('agya', apiUrl)

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const points = data.routes[0].overview_polyline.points;
                const res = decodePolyline(points)
                setpolylineCoords(res)

                if (mapRef) {
                    mapRef?.current?.fitToCoordinates([events[eventIndex].coordinate, {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    }], { edgePadding: { top: 20, right: 20, bottom: 80, left: 20 }, animated: true })
                }
            })
            .catch(error => console.error(error));
    }

    const _renderItem = ({ item, index }) => {
        return (<MapCard item={item} navigation={navigation} isSelected={selectedIndex === index} />)
    }

    const onSnapFunc = (ind) => {
        setSelectedIndex(ind)
        createPolyline(ind, location)
        // if (mapRef) {
        //     mapRef?.current?.fitToCoordinates([events[ind].coordinate, {
        //         latitude: location.latitude,
        //         longitude: location.longitude
        //     }], { edgePadding: { top: 20, right: 20, bottom: 80, left: 20 }, animated: true })
        // }
    }

    const getMarkerRotation = () => {
        return 180;
    };

    const onEventMarkerPress = (index) => {
        // Handle the press event for the event marker here
        // You can set the selected index and update the polyline accordingly
        setSelectedIndex(index);
        createPolyline(index, location);

        if (carouselRef.current) {
            carouselRef.current.snapToItem(index);
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <StatusBar backgroundColor='transparent' translucent />
            <View style={{ flex: 1, width: '100%', position: 'relative', }}>
                <MapView
                    ref={mapRef}
                    style={{ width: '100%', flex: 1, }}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: location ? location.latitude : 37.78825,
                        longitude: location ? location.longitude : -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {location && (
                        <Marker
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            pinColor="blue"
                            rotation={getMarkerRotation()}
                        />
                    )}
                    {events.map((item, index) => (
                        <Marker
                            key={index}
                            coordinate={item.coordinate}
                            onPress={() => onEventMarkerPress(index)}
                        >
                            <Image
                                source={require('../assets/eventMarker.png')}
                                style={{ width: selectedIndex == index ? 40 : 25, height: selectedIndex == index ? 40 : 25 }}
                                resizeMode="contain"
                            />
                        </Marker>
                    ))}
                    {location && polylineCoords &&
                        <Polyline
                            coordinates={[
                                { latitude: location.latitude, longitude: location.longitude },
                                ...polylineCoords,
                            ]}
                            strokeColor='#000'
                            strokeWidth={2.5}
                        />
                    }
                    {location && (
                        <Circle
                            center={{ latitude: location.latitude, longitude: location.longitude }}
                            radius={1609.34 * radius} // Convert miles to meters (1 mile = 1609.34 meters)
                            strokeWidth={1}
                            strokeColor="blue"
                            fillColor="rgba(0, 128, 255, 0.2)"
                        />
                    )}
                </MapView>
                <View style={{ position: 'absolute', top: 0, width: '100%', zIndex: 1 }}>
                    {!route?.params?.eventId ?
                        <SearchBar onPressIcon={() => navigation.navigate('Events')} isList={false} />
                        :
                        <Pressable style={{ width: 50, height: 50, backgroundColor: '#fff', borderRadius: 50, marginVertical: 20, left: 25, shadowOpacity: 0.25, shadowRadius: 3.2, shadowOffset: { width: 2, height: 2 }, elevation: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Events')}>
                            <MaterialCommunityIcons name="arrow-left" size={29} />
                        </Pressable>

                    }
                    {location &&
                        <TransportMode userLocation={location} destination={events[selectedIndex].coordinate} />
                    }
                </View>
                {location && !route?.params?.eventId &&
                    <View style={{ position: 'absolute', bottom: 0, }}>
                        <Carousel
                            // ref={(c) => { this._carousel = c; }}
                            // layoutCardOffset={9}
                            ref={carouselRef}
                            data={events}
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
            </View>

        </SafeAreaView>
    );
}

export default MapScreen;

