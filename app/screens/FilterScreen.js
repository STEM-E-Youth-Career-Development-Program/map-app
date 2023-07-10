import { useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';


const filterScreen = () => {
  const [selected, setArea] = useState('');
  const [distance, setDistance] = useState(0);
  var distanceText = 'Within ' + distance + ' miles';
  if (distance == 100) {
    distanceText = '100+ miles'
  } else if (distance == 0) {
    distanceText = 'Exact Location'
  };
  const [cost, setCost] = useState(0);
  var costText = 'Max. $' + cost;
  if (cost == 1000) {
    costText = '$1000+'
  } else if (cost == 0) {
    costText = 'Free'
  };
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const areas = [
    {value:'Science'},
    {value:'Technology'},
    {value:'Engineering'},
    {value:'Math'},
    {value:'Entrepreneurship'},
  ]
  const [Yes, setYes] = useState(false);
  const [No, setNo] = useState(false);
  var yestextColor = 'grey';
  var notextColor = 'grey';
  if (Yes == (true)) {
    yestextColor = 'black'
  };
  if (No == (true)) {
    notextColor = 'black'
  };

  return (
    <SafeAreaView style={{backgroundColor: '#EEEEEE', flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter & Sort</Text>
      </View>

      <Text style={styles.heading}>Subject</Text>
      <View style={styles.line} />
      <View style={{paddingHorizontal: 16, paddingTop: 15}}>
        <MultipleSelectList
          setSelected={(area) => setArea(area)}
          data={areas} 
          save="value"
          placeholder="Select STEME Area"
          searchPlaceholder='Select STEME Area'
          search={false}
        />
      </View>
      
      <Text style={[styles.heading, {marginTop: '5%'}]}>Distance</Text>
      <View style={styles.line} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={5}
        onValueChange={setDistance}
        minimumTrackTintColor='#999999'
        thumbTintColor='grey'
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderText}>Exact Location</Text>
        <Text style={{color: '#5A5A5A'}}>{distanceText}</Text>
        <Text style={styles.sliderText}>100+ miles</Text>
      </View>

      <Text style={styles.heading}>Cost</Text>
      <View style={styles.line} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1000}
        step={10}
        onValueChange={setCost}
        minimumTrackTintColor='#999999'
        thumbTintColor='grey'
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderText}>$0</Text>
        <Text style={{color: '#5A5A5A'}}>{costText}</Text>
        <Text style={styles.sliderText}>$1000+</Text>
      </View>

      <Text style={styles.heading}>Meal Included</Text>
      <View style={styles.line} />
      <View style={{flexDirection: 'row'}}>
        <Checkbox
          style={styles.checkbox}
          value={Yes}
          onValueChange={setYes}
          color='grey'
        />
        <Text style={[styles.checkbox, {color: yestextColor}]}>Yes</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Checkbox
          style={styles.checkbox}
          value={No}
          onValueChange={setNo}
          color='grey'
        />
        <Text style={[styles.checkbox, {color: notextColor}]}>No</Text>
      </View>

      <LinearGradient
        colors={['black', '#5A5A5A']}
        style={styles.button}
        locations={[0.1, 0.9]}
      >
        <Pressable
          onPress={() => {
            //change screen
          }}
        >
          <Text style={styles.apply}>Apply</Text>
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default filterScreen;

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight,
    flexDirection: 'row',
  },
  heading: {
    fontWeight: 800,
    fontSize: 15,
    marginTop: '10%',
    marginLeft: '4%',
  },
  title: {
    fontWeight: 800,
    fontSize: 15,
    alignSelf: 'center',
  },
  line: {
    backgroundColor: '#999999',
    alignSelf: 'center',
    height: '.2%',
    width: '92%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '92%',
    height: '6%',
    alignSelf: 'center',
    bottom: 15,
    borderRadius: 8,
  },
  apply: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
  },
  slider: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 5,
  },
  sliderText: {
    fontSize: 15,
    color: '#999999',
    fontWeight: 300,
  },
  checkbox: {
    marginLeft: '4%',
    marginTop: 15,
    fontWeight: 800,
  }
})
