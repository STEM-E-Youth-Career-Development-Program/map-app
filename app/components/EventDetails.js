import React from 'react';
import Screen from './Screen';
import PageHeader from './PageHeader';
import Event from './Event';
import CreateEventScreen from '../screens/CreateEventScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet, Image, ScrollView, ImageBackground, Dimensions, Linking, Share } from 'react-native';
import Constants from 'expo-constants';


const height = Dimensions.get('window').height

const EventDetails = (props) => {

  const { allDetails, distance } = props.route.params;
  //const base64Image = `data:image/jpeg;base64,${allDetails.imageData}`;
  // console.log("check", allDetails)

  const renderImage = () => {
    if (!allDetails.imageData) {
      return (
        <ImageBackground
          source={require('../assets/STEME.png')}
          style={styles.eventImgBackground}
        >
          <View style={styles.overlayView} />
          <Image style={styles.eventImg} source={require('../assets/STEME.png')} />
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          source={{ uri: `data:image/jpeg;base64,${allDetails.imageData}` }}
          style={styles.eventImgBackground}
        >
          <View style={styles.overlayView} />
          <Image
            style={styles.eventImg}
            source={{ uri: `data:image/jpeg;base64,${allDetails.imageData}` }}
          />
        </ImageBackground>
      );
    }
  };
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUrlPress = () => {
    Linking.openURL(allDetails.url);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this event: ${allDetails.eventName} at ${allDetails.address}`,
        url: allDetails.url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared via activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error('Error sharing event:', error.message);
    }
  };


  return (
    <>
      <View style={{ paddingTop: Constants.statusBarHeight }}>
        <PageHeader header={allDetails.eventName} />
      </View>
      <ScrollView>
      {renderImage() }
        {/* <ImageBackground source={{ uri: base64Image }} style={styles.eventImg}>
          <View style={styles.overlayView} />
        </ImageBackground> */}
        <View style={styles.iconRow}>
        {/* <View style={[styles.iconButtons, { right: 15 }]}>
            <Image  source={{ uri: `${allDetails.imageData}` }}
          style={styles.eventImg} />
          </View> */}
         {allDetails.url && (
            <TouchableOpacity onPress={handleUrlPress} style={[styles.iconButtons, { right: 7 }]}>
              <Image source={require('../assets/earth.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          )}
           <TouchableOpacity onPress={handleShare} style={styles.iconButtons}>
            <Image source={require('../assets/share.png')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.conduct}>
          <Text style={{ fontWeight: 'bold', }}>Conducted By:</Text>
          <Text style={{ fontWeight: 'bold', color: 'grey' }}>{allDetails.compmayName}</Text>
        </View>

        {allDetails.url && (
        <Text style={styles.more}>
          For more information and registration, visit the{' '}
          <TouchableOpacity onPress={handleUrlPress}>
            <Text style={styles.underlineText}>Organizer's Website</Text>
          </TouchableOpacity>
        </Text>
        )}
        
        <View style={styles.contentBackground}>
          <View style={{ marginLeft: '2.5%', marginTop: 12 }}>
            <Text style={{ fontWeight: 'bold', color: '#171766', fontSize: 16 }}>Event Details:</Text>

            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              {/* <MaterialCommunityIcons name='map-marker-outline' size={20} style={{ paddingRight: 10 }} /> */}
              <Text style={{ fontWeight: '600', paddingRight: 2.5 }}>Eveent Name: </Text>
              <Text style={{ color: '#999999', maxWidth: '70%' }} numberOfLines={2} ellipsizeMode='tail'>{allDetails.eventName}</Text>
            </View>


            <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name='calendar-month-outline' size={20} style={{ paddingRight: 10 }} />
              <Text style={{ fontWeight: '600', paddingRight: 25 }}>Date: </Text>
              <Text style={{ color: '#999999' }}>{formatDate(allDetails.startDate)} - {formatDate(allDetails.endDate)}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <MaterialCommunityIcons name='calendar-month-outline' size={20} style={{ paddingRight: 10 }} />
              <Text style={{ fontWeight: '600', paddingRight: 25 }}>Time: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.startTime} - {allDetails.endTime} </Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <MaterialCommunityIcons name='map-marker-outline' size={20} style={{ paddingRight: 10 }} />
              <Text style={{ fontWeight: '600', paddingRight: 2.5 }}>Location: </Text>
              <Text style={{ color: '#999999', maxWidth: '70%' }} numberOfLines={2} ellipsizeMode='tail'>{allDetails.address}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 2.5 }}>Distance: </Text>
              <Text style={{ color: '#999999' }}>{distance.toFixed(2)} mi</Text>
            </View>

            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 10 }}>Subject: </Text>
              <Text style={{ color: '#999999', maxWidth: '70%' }} numberOfLines={2}>{allDetails.subject.join(', ')}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 10 }}>Event Type: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.eventType}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 28 }}>Average Cost: </Text>
              <Text style={{ color: '#999999' }}>${allDetails.cost}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 10 }}>Grade Level: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.gradeLevel}</Text>
            </View>
            <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 10 }}>Eligibility/Other: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.eligibility}</Text>
            </View>
            {/* <View style={{ marginTop: 6, display: 'flex', flexDirection: 'row' }}>
              <View style={{ width: '8%' }} />
              <Text style={{ fontWeight: '600', paddingRight: 10 }}>Age Group: </Text>
              <Text style={{ color: '#999999' }}>{allDetails.ageGroup}</Text>
            </View> */}

            <View style={{ marginVertical: 17 }}>
              <Text style={{ fontWeight: '600', fontSize: 16 }}>Description: </Text>
              <Text style={{ color: '#999999', maxWidth: '97%', textAlign: "justify" ,fontSize: 12, marginTop: 7, lineHeight: 17, letterSpacing: 0.025 }}  ellipsizeMode='tail'>{allDetails.description}</Text>
            </View>

            {/* <View style={styles.line} />

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

            <Text style={{ marginBottom: 20 }}>See More Reviews</Text> */}

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
    height: 'auto', // Set height to auto to accommodate varying text lengths
    borderRadius: 8,
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    top: '7%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap', // Allow text to wrap to the next line
    paddingTop: 20,
    paddingRight: 10,
    paddingBottom: 20,
    paddingLeft: 10

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