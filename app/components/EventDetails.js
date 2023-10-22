import React from 'react';
import PageHeader from './PageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, View, Text, StyleSheet, Image, FlatList, Pressable, ImageBackground } from 'react-native';
import Constants from 'expo-constants';

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

const commentExamples = [
  {
    Name: 'user',
    Icon: '',
    Rating: 5,
    Comment: 'this is a comment',
    Date: 'October 21',
  },
  {
    Name: 'user',
    Icon: '',
    Rating: 4,
    Comment: 'this is a comment',
    Date: 'October 21',
  },
  {
    Name: 'user',
    Icon: '',
    Rating: 3,
    Comment: 'this is a comment',
    Date: 'October 21',
  },
  {
    Name: 'user',
    Icon: '',
    Rating: 2,
    Comment: 'this is a comment',
    Date: 'October 21',
  },
  {
    Name: 'user',
    Icon: '',
    Rating: 1,
    Comment: 'this is a comment',
    Date: 'October 21',
  },
];

const EventDetails = ({navigation, props}) => {
  var stars = [];
  function ratingStars() {
    for (i=0;i<=commentExamples.Rating;i++) {
      stars.push('#f8d74c')
    }
    for(i=0;i<=(5 - commentExamples.Rating);i++) {
      stars.push('grey')
    }
  }
  return (
    <View style={styles.screen}>
      <PageHeader header="Medical Workshop" />
      
      <ImageBackground source={require('../assets/eventdetailex.png')} imageStyle={{height: 200, flex: 1}} resizeMode='cover' style={{marginBottom: 10}}>
        <View style={styles.iconRow}>
          <View style={[styles.iconButtons, {right: 20}]}>
            <Image source={require('../assets/earth.png')} style={{ width: 20, height: 20 }}/>
          </View>
          <View style={styles.iconButtons}>
            <Image source={require('../assets/share.png')} style={{ width: 20, height: 20 }}/>
          </View>
        </View>
        <View style={styles.conduct}>
          <Text style={{fontWeight:'bold',marginLeft:3}}>Conducted By:</Text>
          <Text style={{fontWeight:'bold',color:'grey'}}>{eventExample.organization}</Text>
        </View>
      </ImageBackground>

      <Text style={styles.more}>For more information and registration, visit the organizer's website.</Text>
      
      <ScrollView style={styles.contentBackground}>
          <Text style={{ fontWeight: 'bold', color: '#1d1664', fontSize: 15 }}>Event Details:</Text>
          <View style={{marginVertical: 5, display: 'flex', flexDirection: 'row'}}>
            <MaterialCommunityIcons name='calendar-month-outline' size={25} style={{padding: 5}}/>
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <View style={{flexDirection: 'row', marginBottom: 'auto', marginTop: 'auto'}}>
                <Text style={styles.subtitle}>Date: </Text>
                <Text style={{color:'#999999'}}>{eventExample.startDate} - {eventExample.endDate}</Text>
              </View>
            </View>
          </View>
          <View style={{marginVertical: 5, display: 'flex', flexDirection: 'row'}}>
            <MaterialCommunityIcons name='map-marker-outline' size={25} style={{padding: 5}}/>
            <View style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
              <Text style={styles.subtitle}>Location: </Text>
              <Text style={{color:'#999999'}}>{eventExample.location}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: '2%'}}>
            <View style={{marginVertical: 5}}>
              <View style={{flexDirection:'row', marginBottom: 5}}>
                <Text style={styles.subtitle}>Cost: </Text>
                <Text style={{color:'#999999'}}>${eventExample.cost}</Text>
              </View>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={styles.subtitle}>Subject: </Text>
              <Text style={{color:'#999999'}}>{eventExample.subject}</Text>
            </View>
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={styles.subtitle}>Description: </Text>
            <Text style={{color:'#999999', fontSize: 12}}>{eventExample.description}</Text>
          </View>

          <View style={styles.line}/>

          <Text style={styles.ratingtext}>Rating & Reviews</Text>
          <Text style={{fontSize:40, fontWeight: 'bold'}}>5.0</Text>
          <View style={{flexDirection:'row'}}>
            <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
            <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
            <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
            <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
            <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
            <Text style={{marginLeft:2, fontSize:10}}>(13 reviews)</Text>
          </View>

          <Text style={[styles.ratingtext, {marginVertical: 10}]}>Reviews</Text>
            <View style={{marginBottom: 15, flexDirection: 'row'}}>
              <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>
              <View>
                <View style={{flexDirection: 'row', width: '95%'}}>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <Text style={{marginLeft: 'auto', fontSize: 10, color: 'grey'}}>June 29</Text>
                </View>
                <Text style={{fontWeight:'bold', color:'#171766'}}>name</Text>
                <Text style={styles.reviewcomment}>lastutitivutviutyvuytyvutu</Text>
              </View>
            </View>

            <View style={{marginBottom: 15, flexDirection: 'row'}}>
              <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>
              <View>
                <View style={{flexDirection: 'row', width: '95%'}}>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <Text style={{marginLeft: 'auto', fontSize: 10, color: 'grey'}}>June 29</Text>
                </View>
                <Text style={{fontWeight:'bold', color:'#171766'}}>name</Text>
                <Text style={styles.reviewcomment}>lastutitivutviutyvuytyvutu</Text>
              </View>
            </View>

            <View style={{marginBottom: 15, flexDirection: 'row'}}>
              <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>
              <View>
                <View style={{flexDirection: 'row', width: '95%'}}>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <MaterialCommunityIcons name={"star"} size={10} color={'#f8d74c'}/>
                  <Text style={{marginLeft: 'auto', fontSize: 10, color: 'grey'}}>June 29</Text>
                </View>
                <Text style={{fontWeight:'bold', color:'#171766'}}>name</Text>
                <Text style={styles.reviewcomment}>lastutitivutviutyvuytyvutu</Text>
              </View>
            </View>

          <Pressable style={{marginBottom: 20}}>
            <Text>See More Reviews</Text>
          </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f3f3f3',
  },
  iconRow: {
    flexDirection: 'row',
    display: 'flex',
    marginLeft: 'auto',
    padding: 20
  },
  iconButtons: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conduct:{
    width: '50%',
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,.75)',
    alignSelf: 'center',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  more:{
    marginVertical: 15,
    textAlign: 'center',
    color: '#999999',
    paddingTop: 60
  },
  contentBackground:{
    width: '92.5%',
    padding: '2.5%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 15,
  },
  line:{
    width:'98%',
    marginRight: '2%',
    alignSelf: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: .8,
    marginVertical: 10,
  },
  ratingtext:{
    fontWeight: 'bold',
    color: '#171766',
    fontSize: 15,
  },
  reviewpfpex:{
    width:30,
    height:30,
    borderRadius: 30,
  },
  reviewcomment:{
    fontWeight:'300',
    color: 'grey',
  },
  subtitle:{
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default EventDetails;