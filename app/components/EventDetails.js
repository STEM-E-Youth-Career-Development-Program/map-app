import React from 'react';
import Screen from './Screen';
import PageHeader from './PageHeader';
import Event from './Event';
import { View, Text, StyleSheet, Image } from 'react-native';

const eventExample = {
  id: 1,
  heading: 'Medical Workshop',
  startDate: 'Mar 23',
  endDate: 'Mar 25',
  subject: 'Science',
  distance: '1.7',
  cost: '20',
  meal: true,
  active: true,
  organization: 'UT Austin',
}

const EventDetails = (props) => {
  var mealBoolean;
  if (eventExample.meal==true) {
    mealBoolean='Yes'
  } else if (meal==false) {
    mealBoolean='No'
  };
  return (
    <Screen>
      <PageHeader header="Medical Workshop" />
      <Image source={require('../assets/eventdetailex.png')} style={styles.eventImg}/>
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
      <Text style={styles.more}>For more information and registration, visit the organizer's website.</Text>
      <View style={styles.contentBackground}>
        <View style={{marginLeft: '2%', marginTop: 10}}>
          <Text style={{ fontWeight: 'bold', color: '#1d1664' }}>Event Details:</Text>
          <View style={{marginVertical: 5}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: 'bold'}}>Date: </Text>
              <Text style={{color:'#999999'}}>{eventExample.startDate} - {eventExample.endDate}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: 'bold'}}>Time: </Text>
              <Text style={{color:'#999999'}}>12 AM - 12 PM CST</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: '2%'}}>
            <View style={{marginVertical: 5}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight: 'bold',}}>Cost: </Text>
                <Text style={{color:'#999999'}}>${eventExample.cost}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight: 'bold'}}>Distance: </Text>
                <Text style={{color:'#999999'}}>{eventExample.distance} mi</Text>
              </View>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{marginBottom:'2%', fontWeight: 'bold',}}>Subject: </Text>
              <Text style={{marginBottom:'1.5%',color:'#999999'}}>{eventExample.subject}</Text>
            </View>
          </View>
          <View style={styles.line}/>
            <Text style={styles.ratingtext}>Rating & Reviews</Text>
            <Text style={{fontSize:40, fontWeight: 'bold'}}>5.0</Text>
            <View style={{flexDirection:'row'}}>
              <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
              <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
              <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
              <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
              <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
              <Text style={{marginLeft:2, fontSize:10}}>(13 reviews)</Text>
            </View>
          <Text style={[styles.ratingtext, {marginVertical: 10}]}>Reviews</Text>
            <View style={{marginBottom: 15, flexDirection: 'row'}}>
              <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>
              <View>
                <View style={{flexDirection: 'row', width: '95%'}}>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
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
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
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
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
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
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
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
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
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
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Text style={{marginLeft: 'auto', fontSize: 10, color: 'grey'}}>June 29</Text>
              </View>
              <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
              <Text style={styles.reviewcomment}>lastutitivutviutyvuytyvutu</Text>
            </View>
          </View>
          <View style={{marginBottom: 15, flexDirection: 'row'}}>
            <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>
            <View>
              <View style={{flexDirection: 'row', width: '95%'}}>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Text style={{marginLeft: 'auto', fontSize: 10, color: 'grey'}}>June 29</Text>
              </View>
              <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
              <Text style={styles.reviewcomment}>lastutitivutviutyvuytyvutu</Text>
            </View>
          </View>
          <View style={{marginBottom: 15, flexDirection: 'row'}}>
            <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>
            <View>
              <View style={{flexDirection: 'row', width: '95%'}}>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                <Text style={{marginLeft: 'auto', fontSize: 10, color: 'grey'}}>June 29</Text>
              </View>
              <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
              <Text style={styles.reviewcomment}>lastutitivutviutyvuytyvutu</Text>
            </View>
          </View>
          <Text>See More Reviews</Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  eventImg: {
    width:'100%',
    height:'20%',
    zIndex: 0,
  },
  iconRow: {
    flexDirection: 'row',
    display: 'flex',
    position: 'absolute',
    right: 20,
    top: 60,
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
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    top: '12.5%',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  more:{
    marginVertical: 15,
    textAlign: 'center',
    color: '#999999',
  },
  contentBackground:{
    width: '95%',
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
  reviewstar:{
    width:10,
    height:10,
  },
  reviewcomment:{
    fontWeight:'300',
    color: 'grey',
  },
});

export default EventDetails;