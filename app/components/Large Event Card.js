import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const workshopTitle = 'Aerospace Engineering Workshop';

const WorkshopPage = () => {
    return (
        <View style={styles.container}>

            <Image source={require('./assets/eventicon.png')} style={styles.eventicon} />

            <Text style={styles.title}>{workshopTitle}</Text>

            <View style={styles.steme}>
                <Image source={require('./assets/stemelogo.png')} style={styles.stemelogo} />
                <Text style={styles.subtitle}>STEME Youth Career Development Program</Text>
            </View>

            <View style={styles.pricesec}>
                <Text style={styles.price}>$15</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.leftBox}>
                    <Text style={styles.label}>From</Text>
                    <Text style={styles.text}>Aug 1st</Text>
                    <Text style={styles.text}>12:00pm CST</Text>
                </View>
                <View style={styles.rightBox}>
                    <Text style={styles.label}>To</Text>
                    <Text style={styles.text}>Aug 1st</Text>
                    <Text style={styles.text}>03:00pm CST</Text>
                </View>
            </View>

            <View style={styles.mealsec}>
                <View>
                    <Image source={require('./assets/meal.png')} style={[styles.meallogo, { width: 35, height: 35, marginTop: -5 }]} />
                </View>
                <Text style={styles.meal}>Meal Included</Text>
            </View>

            <View style={styles.reviewbox}>
                <Text style={styles.review}>Reviews</Text>
                <View style={styles.reviewsec}>
                    <Image source={require('./assets/5starts.png')} style={{ width: 100, height: 30, marginLeft: 50 }} />
                    <View style={styles.comment}>
                        <Image source={require('./assets/icon.png')} style={{ width: 50, height: 50 }} />
                        <Text>Yes it is a good workshop...hahaha</Text>
                    </View>
                </View>
            </View>



            <View style={[styles.buttonsec, { marginBottom: 20 }]}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttontext}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttontext}>Website</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    eventicon: {
        width: 160,
        height: 160,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginTop: 35,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    steme: {
        flex: 3,
        flexDirection: 'row',
        marginLeft: 70,
        marginRight: 70,
        height: 30,
    },
    stemelogo: {
        width: 70,
        height: 30,
        marginTop: 7,
    },
    subtitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 0,
        textAlign: 'center',
        height: 50,
    },

    pricesec: {
        flex: 3,
        margin: 0,
        marginTop: 10,
    },

    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',

    },
    section: {
        flexDirection: 'row',
        marginTop: -10,
        flex: 5,
    },
    leftBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 10,
    },
    rightBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#959595",
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
        color: "#959595",
    },
    meal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "#959595",
    },

    mealsec: {
        flex: 2,
        flexDirection: 'row',
    },

    review: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    reviewbox: {
        flex: 6,
        width: 400,
    },
    comment: {
        flexDirection: 'row',
    },
    buttonsec: {
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#6BB6FC',
        marginBottom: 10,
        width: 200,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
        alignItems: 'center',

    },
    buttontext: {
        fontWeight: 'bold',
        fontSize: 25,
    },

});

export default WorkshopPage;
