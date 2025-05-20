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
        backgroundColor: '#6C4E31',
        paddingVertical: 15,
        paddingHorizontal: 45,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: height * 0.60,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const LoginScreen = () => {
    return (
        <View style={styles.mainContainer}>
            <ImageBackground
                source={require('../assets/images/Group 15.png')} // Your background image
                style={styles.background}
                imageStyle={{ resizeMode: 'cover' }}>
                
                <View style={styles.title}>
                    <Image 
                        source={require('../assets/images/Pocket Salon.png')} 
                        style={{ width: width * 0.91, height: height * 0.067 }}/>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/homepage')}>
                    <Text style={styles.buttonText}>GET STARTED</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

export default LoginScreen;