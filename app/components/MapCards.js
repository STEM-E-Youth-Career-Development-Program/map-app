import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const MapCard = ({ item, navigation, isSelected, distance }) => {
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInDays = Math.floor((end - start) / (24 * 60 * 60 * 1000));

    return durationInDays === 0 || durationInDays === 1 ? '1 Day' : `${durationInDays} Days`;
  };
  const base64Image = `data:image/jpeg;base64,${item.imageData}`;

  const renderImage = () => {
    if (!item.imageData) {
      return <ImageBackground style={styles.image} source={require('../assets/STEME.png')} />;
    } else if (item.imageData.startsWith('http')) {
      return <ImageBackground style={styles.image} source={{ uri: item.imageData }} />;
    } else {
      return <ImageBackground style={styles.image} source={{ uri: `data:image/jpeg;base64,${item.imageData}` }} />;
    }
  };

  return (
    <TouchableOpacity activeOpacity={.9} onPress={() => navigation.navigate('Event Details', { allDetails: item, distance })} style={styles.cardItems}>
      <View style={styles.circleAvatar}>
      {renderImage() }
        {/* <ImageBackground source={{ uri: base64Image }}
          style={styles.image}
        /> */}
      </View>
      <View style={{ width: '80%' }}>
        <Text numberOfLines={1} style={styles.mainTitle}>
          {item.eventName}
        </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 15, marginTop: 5 }}>
        <Text style={styles.text1}>Cost: <Text style={{ fontSize: height * 0.014, color: 'grey' }}>${item.cost}</Text></Text>
        <Text style={styles.text1}>Distance:  
        {distance && (
        <Text style={{ fontSize: height * 0.014, color: 'grey' }}> {distance.toFixed(2)} mi</Text>
        )}
        </Text>
      </View>
      <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.7, width: '80%', marginVertical: height * 0.018 }} />
      <View style={{ flexDirection: 'row', width: '100%', paddingLeft: 20 }}>
        <View style={{ marginRight: width * 0.05 }}>
          <Text style={styles.text2}>Duration:</Text>
          <Text style={styles.text2}>Type:</Text>
          <Text style={styles.text2}>Subject:</Text>
        </View>
        <View>
        <Text style={styles.text3}>{calculateDuration(item.startDate, item.endDate)}</Text>
          <Text style={styles.text3}>{item.eventType}</Text>
          <Text style={[styles.text3, { maxWidth: '70%' }]} numberOfLines={1} ellipsizeMode='tail'>{item.subject.join(', ')}</Text>
        </View>
      </View>
      <View style={styles.bottomrow}>
        <MaterialCommunityIcons name='silverware-fork-knife' size={width * 0.04} style={{ marginRight: 5 }} />
        <Text style={styles.text3}>{item.mealIncluded}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default MapCard

const styles = StyleSheet.create({
  cardItems: {
    width: width * 0.5,
    height: '85%',
    backgroundColor: 'white',
    elevation: 5,
    borderTopLeftRadius: width * 0.03,
    borderTopRightRadius: width * 0.03,
    // alignItems: 'flex-start',
    paddingTop: height * 0.09,
    // paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleAvatar: {
    borderColor: 'white',
    elevation: 10,
    borderWidth: 3,
    borderRadius: 100,
    overflow: 'hidden',
    position: 'absolute',
    alignSelf: 'center',
    top: - width * 0.09
  },
  image: {
    width: width * 0.27,
    height: width * 0.27,
  },
  text1: {
    fontSize: height * 0.014,
    color: 'black',
    fontWeight: '600'
  },
  text2: {
    fontSize: height * 0.014,
    color: 'black',
    fontWeight: '600',
    marginBottom: height * 0.007
  },
  text3: {
    fontSize: height * 0.014,
    color: 'grey',
    marginBottom: height * 0.007
  },
  mainTitle: {
    fontSize: height * 0.02,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: height * 0.016,
    fontWeight: '400',
    color: 'black',
    paddingVertical: 7,
    textAlign: 'center'
  },
  bottomrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%', marginTop: 8
  }

})