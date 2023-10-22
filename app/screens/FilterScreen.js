import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import Slider from '@react-native-community/slider';
import PageHeader from '../components/PageHeader.js';
import Screen from '../components/Screen.js';
import NextButton from '../components/NextButton.js';

const FilterScreen = ({navigation}) => {
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
  if (cost == 100) {
    costText = '$100+'
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
        maximumValue={100}
        step={10}
        onValueChange={setCost}
        minimumTrackTintColor='#999999'
        thumbTintColor='grey'
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderText}>$0</Text>
        <Text style={styles.sliderText}>$100+</Text>
      </View>
      <View style={{alignSelf: 'center'}}>
        <Text style={styles.sliderValue}>{costText}</Text>
      </View>

      <NextButton title={'Apply'} onPress={() => navigation.goBack(distance, cost, selected)} />
      
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
})
