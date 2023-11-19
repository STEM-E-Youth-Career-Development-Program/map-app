import React, { useState } from 'react';
import { View, Modal, Pressable, Text, StyleSheet } from 'react-native';

const InfoModal = ({ isVisible, onClose }) => {
    return (
        // <View style={styles.centeredView}>
        <Modal
            animationType='none'
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>About mapSTEM</Text>
                        <Pressable
                            style={styles.buttonClose}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>X</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.modalText}>The STEME Youth Career Development
                        Program's mapSTEM application tracks various events and activities in Science,
                        Technology, Engineering, Math and Enterpreneurship and makes it accessible and affordable for its users.</Text>

                </View>
            </View>
        </Modal>
        // </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        color: "#999999",
        paddingHorizontal: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 10,
        textAlign: "justify",
        fontSize: 16,
        lineHeight: 22
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textStyle: {
        color: "grey",
        fontSize: 20,
    }
});

export default InfoModal;
