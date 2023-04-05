import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

let price = "$15";
let title = "Aerospace Engineering";
let date = "Aug 1st";


const SmallEventCard = () => {
  return (
    <View style={styles.cardContainer}>
      <Image style={styles.imageLeft} source={{ uri: 'https://images.labroots.com/content_article_profile_image_1a4862eef924eb2f1cb06a5318b813d227635154_8163.jpg' }} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        </View>
        <View style = {styles.textColumn}>
        <Text style={styles.date}>{date}</Text>
        <Text style = {styles.price}>{price}</Text>
        </View>
      <Image style={styles.imageRight} source={{ uri: 'https://cdn.vectorstock.com/i/preview-2x/03/30/apple-simple-icon-vector-6550330.webp' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    width: 250,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
  },
  imageLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  textContainer: {
    flex: 2,
  },
  textColumn:{
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
  imageRight: {
    width: 35,
    height: 35,
  },
});

export default SmallEventCard;