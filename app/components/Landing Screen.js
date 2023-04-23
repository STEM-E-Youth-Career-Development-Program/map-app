import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const landingPageTitle = 'MapSTEM';

const LandingPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>MapSTEM</Text>

            <View id="user" style={styles.user}>
                <Text style={styles.hello}>Hello User</Text>
                <Text id="line" style={styles.greeting}>Good Morning                              March 19th, 2023</Text>
            </View>

            <View style={styles.message}>
                <Text style={styles.info}>The STEME Youth Career Development
                    Program’s mapSTEM application tracks
                    various events and activities in Science,
                    Technology,   Engineering,   Math,   and
                    Entrepreneurship and makes it accessible and
                    affordable for its users.</Text>
                <Text style={styles.check}>Check the events near you on a map by clicking the button below</Text>
            </View>

            <View style={styles.button}>
                <TouchableOpacity style={styles.box}>
                    <Text style={styles.buttontext}>View Events</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#F3F3F3",
        flex: 1,
        alignItems: "center"
    },

    title: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
        display: "block",
        backgroundColor: "white",
        paddingTop: 60,
        width: "100%",
        height: 120
    },

    user: {
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 25,
        width: "90%",
        height: 85,
        display: "block",
        justifyContent: 'center',
        align: 'center',
    },

    hello: {
        fontWeight: 'bold',
        marginLeft: 12,
        marginTop: 7,
        textAlign: "left"

    },

    greeting: {
        marginLeft: 12,
        marginBottom: 0,
        textAlign: "left"
    },

    info: {
        textAlign: "left",
        fontSize: 18,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 30,
    },

    check: {
        marginTop: 30,
        fontSize: 18,
        marginLeft: 16,
        marginRight: 16
    },

    box: {
        borderRadius: 10,
        backgroundColor: "#272727",
        marginTop: 35,
        height: 40,
        width: 336,
        justifyContent: 'center',
        align: 'center',
    },

    buttontext: {
        fontWeight: 'bold',
        fontSize: 20,
        color: "white",
        textAlign: "center"
    },

});

export default LandingPage;