import React from 'react';
import Screen from './Screen';
import PageHeader from './PageHeader';
import Event from './Event';
import CreateEventScreen from '../screens/CreateEventScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const height = Dimensions.get('window').height

const eventExample = {
  id: 1,
  heading: 'Medical Workshop',
  startDate: 'Mar 23',
  endDate: 'Mar 25',
  subject: 'Science',
  location: '...',
  cost: 20,
  organization: 'UT Austin',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel.',
}

const EventDetails = (props) => {

  const { allDetails } = props.route.params;

  return (
    <>
      <View style={{ paddingTop: Constants.statusBarHeight }}>
        <PageHeader header={allDetails.eventName} />
      </View>
      <ScrollView>
        <ImageBackground source={require('../assets/eventdetailex.png')} style={styles.eventImg}>
          <View style={styles.overlayView} />
        </ImageBackground>
        <View style={styles.iconRow}>
          <View style={[styles.iconButtons, { right: 7 }]}>
            <Image source={require('../assets/earth.png')} style={{ width: 20, height: 20 }} />
          </View>
          <View style={styles.iconButtons}>
            <Image source={require('../assets/share.png')} style={{ width: 20, height: 20 }} />
          </View>
        </View>

        <View style={styles.conduct}>
          <Text style={{ fontWeight: 'bold', }}>Conducted By:</Text>
          <Text style={{ fontWeight: 'bold', color: 'grey' }}>{allDetails.eventLocation}</Text>
        </View>

        <Text style={styles.more}>For more information and registration, visit the <Text style={styles.underlineText}>organizer's website.</Text></Text>
        <View style={styles.contentBackground}>
          <View style={{ marginLeft: '2.5%', marginTop: 12 }}>
            <Text style={{ fontWeight: 'bold', color: '#171766', fontSize: 16 }}>Event Details:</Text>
            <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name='calendar-month-outline' size={20} style={{ paddingRight: 10 }} />
              <Text style={{ fontWeight: '600', paddingRight: 25 }}>Date: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.eventDate}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <MaterialCommunityIcons name='calendar-month-outline' size={20} style={{ paddingRight: 10 }} />
              <Text style={{ fontWeight: '600', paddingRight: 25 }}>Time: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.eventTime}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <MaterialCommunityIcons name='map-marker-outline' size={20} style={{ paddingRight: 10 }} />
              <Text style={{ fontWeight: '600', paddingRight: 2.5 }}>Location: </Text>
              <Text style={{ color: '#999999' }}>321 Street Dr, {allDetails.eventLocation}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 2.5 }}>Distance: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.eventDistance} away</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 28 }}>Cost: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.eventCost}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 10 }}>Subject: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.eventSubject}</Text>
            </View>

            <View style={{ marginVertical: 17 }}>
              <Text style={{ fontWeight: '600', fontSize: 16 }}>Description: </Text>
              <Text style={{ color: '#999999', fontSize: 12, marginTop: 7, lineHeight: 17, letterSpacing: 0.025 }}>{allDetails.description}</Text>
            </View>

            <View style={styles.line} />

            <Text style={styles.ratingtext}>Rating & Reviews</Text>
            <Text style={{ fontSize: 35, fontWeight: 'bold' }}>5.0</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../assets/star.png')} style={styles.reviewstar} />
              <Image source={require('../assets/star.png')} style={styles.reviewstar} />
              <Image source={require('../assets/star.png')} style={styles.reviewstar} />
              <Image source={require('../assets/star.png')} style={styles.reviewstar} />
              <Image source={require('../assets/star.png')} style={styles.reviewstar} />
              <Text style={{ marginLeft: 5, fontSize: 10, color: 'grey' }}>(13 reviews)</Text>
            </View>
            <Text style={[styles.ratingtext, { marginTop: 12, marginBottom: 12 }]}>Reviews</Text>
            <View style={{ marginBottom: 15, flexDirection: 'row', }}>
              <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex} />
              <View style={{ marginLeft: 5, flex: 1 }}>
                <View style={{ flexDirection: 'row', width: '98%' }}>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar} />
                  <Image source={require('../assets/star.png')} style={styles.reviewstar} />
                  <Text style={{ marginLeft: 'auto', fontSize: 10, color: 'grey' }}>June 29</Text>
                </View>
                <Text style={{ fontWeight: '700', color: '#171766', marginVertical: 2.5, fontSize: 13 }}>Asad Ahmed</Text>
                <Text style={styles.reviewcomment}>Amazing, supportive staff at events and the app was so easy to use - it saved us so much time!</Text>
              </View>
            </View>
            <View style={{ marginBottom: 15, flexDirection: 'row' }}>
              <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex} />
              <View style={{ marginLeft: 5, flex: 1 }}>
                <View style={{ flexDirection: 'row', width: '98%' }}>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar} />
                  <Image source={require('../assets/star.png')} style={styles.reviewstar} />
                  <Image source={require('../assets/star.png')} style={styles.reviewstar} />
                  <Image source={require('../assets/star.png')} style={styles.reviewstar} />
                  <Image source={require('../assets/star.png')} style={styles.reviewstar} />
                  <Text style={{ marginLeft: 'auto', fontSize: 10, color: 'grey' }}>June 29</Text>
                </View>
                <Text style={{ fontWeight: '700', color: '#171766', marginVertical: 2.5, fontSize: 13 }}>Ali Ahmed</Text>
                <Text style={styles.reviewcomment}>Amazing, supportive staff at events and the app was so easy to use - it saved us so much time!</Text>
              </View>
            </View>

            <Text style={{ marginBottom: 20 }}>See More Reviews</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  eventImg: {
    width: '100%',
    height: height / 3.75,
    zIndex: 0,
    resizeMode: 'contain',
  },
  iconRow: {
    flexDirection: 'row',
    display: 'flex',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  iconButtons: {
    width: 35,
    height: 35,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conduct: {
    width: '50%',
    height: 45,
    borderRadius: 8,
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    top: '7%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  more: {
    marginVertical: 20,
    textAlign: 'center',
    color: '#999999',
    fontWeight: '600',
    width: '70%',
    alignSelf: 'center'
  },
  underlineText: {
    color: '#555', fontWeight: '700', textDecorationLine: 'underline'
  },
  contentBackground: {
    width: '95%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 15,
  },
  line: {
    width: '98%',
    marginRight: '2%',
    alignSelf: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  ratingtext: {
    fontWeight: 'bold',
    color: '#171766',
    fontSize: 16,
    marginTop: 5
  },
  reviewpfpex: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  reviewstar: {
    width: 11,
    height: 11,
    marginRight: 2
  },
  reviewcomment: {
    fontWeight: '300',
    color: 'grey',
    fontSize: 13
  },
  overlayView: {
    height: "100%",
    width: "100%",
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',

  }
});

export default EventDetails;