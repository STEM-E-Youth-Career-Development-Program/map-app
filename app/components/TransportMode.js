import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { calculateDistanceAndDuration } from '../utils/helpers';


const TransportMode = (props) => {

    const { userLocation, destination } = props
    const [modes, setModes] = useState(null)

    useEffect(() => {
        (async () => {
            await Promise.all([
                await calculateDistanceAndDuration(userLocation, destination, 'walking'),
                await calculateDistanceAndDuration(userLocation, destination, 'driving'),
                await calculateDistanceAndDuration(userLocation, destination, 'transit'),
            ])
                .then(results => {
                    // Handle the results of the API calls
                    // console.log('Result 1:', results[0]);
                    // console.log('Result 2:', results[1]);
                    // console.log('Result 3:', results[2]);
                    const res = {
                        walking: results[0],
                        driving: results[1],
                        transit: results[2]
                    }
                    setModes(res)
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })();
    }, [destination])

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {modes &&
                    <>
                        <View style={styles.capsule}>
                            <FontAwesome5 name='walking' size={17} />
                            <Text style={styles.textStyle}>{modes.walking}</Text>
                        </View>

                        <View style={[styles.capsule, { marginLeft: 10 }]}>
                            <FontAwesome5 name='car-side' size={16} />
                            <Text style={styles.textStyle}>{modes.driving}</Text>
                        </View>

                        <View style={[styles.capsule, { marginLeft: 10 }]}>
                            <MaterialIcons name='train' size={17} />
                            <Text style={styles.textStyle}>{modes.transit}</Text>
                        </View>
                    </>
                }
            </View>
        </View>
    )
}

export default TransportMode

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 2.5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    capsule: {
        backgroundColor: '#fff',
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.4,
        elevation: 5
    },
    textStyle: {
        marginLeft: 5,
        fontSize: 12
    }
})