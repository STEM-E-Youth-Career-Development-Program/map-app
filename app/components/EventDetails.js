import React from 'react';
import Screen from './Screen';
import PageHeader from './PageHeader';
import { View, Text, StyleSheet, Image } from 'react-native';

const EventDetails = () => {
  return (
    <Screen>
      <PageHeader header="Medicine Workshop" />

      <Image source={require('../assets/eventdetailex.png')} style={styles.event}/>
      <View style={styles.earth}><Image source={require('../assets/earth.png')} style={styles.littlepfpex}/></View>
      <View style={styles.share}><Image source={require('../assets/share.png')} style={styles.littlepfpex}/></View>
      <View style={styles.conduct}>
          <Text style={{fontWeight:'bold',marginTop:'6%',marginLeft:'2%'}}>Conducted By:</Text>
          <Text style={{fontWeight:'bold',color:'grey',marginTop:'6%'}}>    UT Austin</Text>
      </View>

      
      <Text style={styles.more}>For more information and registration, go to the organizer website</Text>
      

      <View style={styles.content}>
          <Text style={styles.detail}>Event Details:</Text>

          <View style={styles.fromto}>
              <View style={styles.fro}>
                  <Text style={{fontWeight: 'bold',}}>From:    </Text>
                  <Text style={{color:'#999999'}}>March 25th</Text>
              </View>

              <View style={styles.to}>
                  <Text style={{fontWeight: 'bold',}}>To:         </Text>
                  <Text style={{color:'#999999'}}>March 27th</Text>
              </View>
          </View>

          <View style={styles.daytime}>
              <View style={styles.day}>
                  <Text style={{marginBottom:'2%', fontWeight: 'bold',}}>Day:</Text>
                  <Text style={{fontWeight: 'bold',marginBottom:'1.5%',color:'#999999'}}>25th March</Text>
                  <Text style={{fontWeight: 'bold',marginBottom:'1.5%',color:'#999999'}}>26th March</Text>
                  <Text style={{fontWeight: 'bold',marginBottom:'1.5%',color:'#999999'}}>27th March</Text>
              </View>

              <View style={styles.time}>
                  <Text style={{marginBottom:'2%', fontWeight: 'bold',}}>Time:</Text>
                  <Text style={{fontWeight: 'bold',marginBottom:'1.5%',color:'#999999'}}>2pm - 4pm CST</Text>
                  <Text style={{fontWeight: 'bold',marginBottom:'1.5%',color:'#999999'}}>2pm - 4pm CST</Text>
                  <Text style={{fontWeight: 'bold',marginBottom:'1.5%',color:'#999999'}}>2pm - 4pm CST</Text>
              </View>
          </View>
          
          <View style={styles.cddt}>
                  <View style={styles.costdistance}>
                          <View style={styles.cost}>
                              <Text style={{fontWeight: 'bold',}}>Cost: </Text>
                              <Text style={{color:'#999999'}}>$20</Text>
                          </View>
                          

                          <View style={styles.distance}>
                              <Text style={{fontWeight: 'bold',}}>Distance: </Text>
                              <Text style={{color:'#999999'}}>1.7 miles</Text>
                          </View>
                  </View>

                  <View style={styles.durationtype}>
                          <View style={styles.duration}>
                              <Text style={{fontWeight: 'bold',}}>Duration: </Text>
                              <Text style={{color:'#999999'}}>3 days</Text>
                          </View>

                          <View style={styles.type}>
                              <Text style={{fontWeight: 'bold',}}>Type: </Text>
                              <Text style={{color:'#999999'}}>Online</Text>
                          </View>
                  </View>
          </View>
          <View style={styles.meal}>
                          <Text style={{fontWeight: 'bold',}}>Meal Included: </Text>
                          <Text style={{color:'#999999'}}>Yes</Text>
          </View>
      

      <View style={styles.line}></View>

      <View style={styles.rating}>
            <Text style={styles.ratingtext}>Rating & Reviews</Text>
            <Text style={styles.ratingscore}>5.0</Text>
            <View style={{flexDirection:'row'}}>
                  <View style={styles.reviewstars}>
                      <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                  </View>
                  <Text style={{marginLeft:2,fontSize:10}}>(13 reviews)</Text>
            </View>
      </View>

      <View style={styles.review}>
        <Text style={styles.reviewtext}>Reviews</Text>

        <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>1jgbtutitivutviutyvuytyvutu</Text>
            </View>
        </View>

        <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>2jgbtutitivutviutyvuytyvutu</Text>
            </View>
        </View>

        <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>jgbtutitivutviutyvuytyvutu</Text>
            </View>
        </View>

        <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>jgbtutitivutviutyvuytyvutu</Text>
            </View>
        </View>

                <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>jgbtutitivutviutyvuytyvutu</Text>
            </View>
        </View>

        <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>jgbtutitivutviutyvuytyvutu</Text>
            </View>
        </View>

        <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>jgbtutitivutviutyvuytyvutu</Text>
            </View>
        </View>

        <View style={styles.reviewall}>
            <View style={styles.reviewup}>
              <View style={styles.reviewupleft}>
                  <Image source={require('../assets/pfpex.png')} style={styles.reviewpfpex}/>

                  <View style={{marginLeft:5}}>
                      <View style={styles.reviewstars}>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                            <Image source={require('../assets/star.png')} style={styles.reviewstar}/>
                      </View>
                      <Text style={{fontWeight:'bold',color:'#171766',}}>name</Text>
                  </View>
              </View>
              <Text style={{marginRight:5}}>June 29</Text>
            </View>
            <View style={styles.reviewcomment}>
                      <Text>lastutitivutviutyvuytyvutu</Text>
            </View>
        </View>
      </View>
    </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#E5E5E5'
  },
  header:{
    width:'100%',
    height:'10%',
    backgroundColor:'white',
    flexDirection:'row',
    justifyContent: 'center', // Added justifyContent property
    alignItems: 'center', // Added alignItems property
  },
  arrow:{
    height:15,
    width:28,
    marginTop:'7%',
    marginLeft:15,
  },
  title:{
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: '7%',
    alignItems: 'center',
    flex: 1, // Added flex property
    textAlign: 'center', // Added textAlign property
    marginLeft:-43,
  },
  event:{
    width:'100%',
    height:'20%',
  },
  earth:{
    width:30,
    height:30,
    borderRadius:30,
    backgroundColor:'#ffffff',
    position:'absolute',
    right:50,
    top:'12%',
  },
  share:{
    width:30,
    height:30,
    borderRadius:30,
    backgroundColor:'#ffffff',
    position:'absolute',
    right:10,
    top:'12%',
  },
  littlepfpex:{
    width:15,
    height:15,
    marginTop:7.5,
    marginLeft:7.5,
  },
  conduct:{
    width:'50%',
    height:50,
    borderRadius:8,
    backgroundColor:'#ffffff',
    position:'absolute',
    left:'25%',
    top:'17.5%',
    flexDirection:'row',
  },
  more:{
    marginTop:'2.75%',
    marginBottom:'2.75%',
    width:'70%',
    marginLeft:'15%',
    textAlign:'center',
    color:'#999999',
  },
  content:{
    width:'93%',
    marginLeft: '3.5%',
    backgroundColor:'#ffffff'
  },
  detail:{
    marginTop: '1.5%',
    marginLeft: '2%',
    marginBottom:'2%',
    fontWeight: 'bold',
    color:'#171766',
  },
  fromto:{
    marginLeft: '2%',
    marginBottom:'2%',
  },
  fro:{
    flexDirection: 'row',
    marginBottom:'1%',
  },
  to:{
    flexDirection: 'row',
  },
  daytime:{
    flexDirection: 'row',
    marginLeft: '2%',
    marginBottom:'2%',
    marginRight:'2%',
  },
  day:{
    width:'35%',
  },
  time:{
    marginLeft: '30%',
  },
  cddt:{
    flexDirection:'row',
    marginLeft: '2%',
  },
  costdistance:{
    flexDirection: 'column',
    width: '60%',
  },
  cost:{
    flexDirection:'row',
    marginBottom:'3.5%',
  },
  distance:{
    flexDirection:'row',
    marginBottom:'3.5%',
  },
  durationtype:{
    flexdirection:'column',
    marginLeft: '5%',
    
  },
  duration:{
    flexDirection:'row',
    marginBottom:'5.5%',
    marginRight:'2%',
  },
  type:{
    flexDirection:'row',
    marginBottom:'3.5%',
     marginRight:'2%',
  },
  meal:{
    flexDirection: 'row',
    marginLeft: '2%',
    marginBottom:'2.5%',
    width:'90%',
  },
  line:{
    width:'88%',
    marginLeft:'6%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom:'2.5%',
  },
  rating:{
    marginLeft:'2%',
    marginBottom:'3.5%',
  },
  ratingtext:{
    fontWeight: 'bold',
    color:'#171766',
  },
  ratingscore:{
    fontSize:40,
    fontWeight: 'bold',
  },
  review:{
    marginLeft:'2%',
  },
  reviewtext:{
    fontWeight: 'bold',
    color:'#171766',
  },
  reviewall:{
    marginTop: 3,
  },
  reviewup:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  reviewupleft:{
    flexDirection:'row',
  },
  reviewpfpex:{
    width:30,
    height:30,
  },
  reviewstars:{
    flexDirection:'row',
  },
  reviewstar:{
    width:10,
    height:10,
  },
  reviewcomment:{
    marginLeft:35,
  },
});

export default EventDetails;