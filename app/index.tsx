import {View, ImageBackground, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';
import { router } from 'expo-router';
import React from 'react';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    background: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        position: 'absolute',
        top: height * 0.10,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#FFF2E4',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: height * 0.60,
    },
    buttonText: {
        color: '#6C4E31',
        fontSize: 23,
        fontWeight: 'bold',
    },
});

const LoginScreen = () => {
    return (
        <View style={styles.mainContainer}>
            <ImageBackground
                source={require('../assets/images/Startup-Page.png')} // Your background image
                style={styles.background}
                imageStyle={{ resizeMode: 'cover' }}>
                
                <TouchableOpacity style={styles.button} onPress={() => router.push('/homepage')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

export default LoginScreen;