import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';
import PageHeader from '../components/PageHeader.js';
import Screen from '../components/Screen.js';
import SubmitButton from '../components/SubmitButton.js';

const FilterScreen = () => {
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
    <Screen>
      <PageHeader header={'Filter & Sort'} />

      <Text style={styles.heading}>Subject</Text>
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
        <Text style={styles.sliderText}>100+ miles</Text>
      </View>
      <View style={{alignSelf: 'center'}}>
        <Text style={styles.sliderValue}>{distanceText}</Text>
      </View>

      <Text style={styles.heading}>Cost</Text>
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
        <Text style={styles.sliderText}>$1000+</Text>
      </View>
      <View style={{alignSelf: 'center'}}>
        <Text style={styles.sliderValue}>{costText}</Text>
      </View>

       <Text style={styles.heading}>Meal Included</Text>
      <View style={{flexDirection: 'row'}}>
        <Checkbox
          style={styles.checkbox}
          value={Yes}
          onValueChange={setYes}
          color={yestextColor}
        />
        <Text style={[styles.checkbox, {color: yestextColor}]}>Yes</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Checkbox
          style={styles.checkbox}
          value={No}
          onValueChange={setNo}
          color={notextColor}
        />
        <Text style={[styles.checkbox, {color: notextColor}]}>No</Text>
      </View>
      <SubmitButton title={'Apply'} />
      
  </Screen>
  )
}

export default FilterScreen;

const styles = StyleSheet.create({
  heading: {
    fontWeight: '800',
    fontSize: 15,
    marginTop: '10%',
    borderBottomColor: '#999999',
    borderBottomWidth: 2,
    width: '92%',
    alignSelf: 'center'
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
    fontWeight: '300',
  },
  sliderValue: {
    fontSize: 15,
    color: '#5A5A5A',
    fontWeight: '500',
    marginTop: -20,
  },
  checkbox: {
    marginLeft: '4%',
    marginTop: 15,
    fontWeight: '800',
  },
})
