import {View, ImageBackground, Text, TouchableOpacity, StyleSheet, TextInput, Pressable, Dimensions} from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { colorScheme } from 'nativewind';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    curvedBox: {
        justifyContent: 'flex-end',
        bottom: -height * 0.4, // Responsive positioning
        left: -width * 0.2,
        alignItems: 'center',
        opacity: 0.8,
        width: width * 1.5,
        height: height * 0.8,
        borderRadius: width * 0.5,
        zIndex: 1,
        backgroundColor: '#E7D4BF',
    },
    inputContainer: {
        borderWidth: 4,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.8,
        height: height * 0.06,
        minHeight: 50, // Minimum touch target size
        zIndex: 40,
    },
    titleText: {
        position: 'absolute',
        top: height * -0.04,
        left: width * 0.4,
        zIndex: 20,
        fontSize: width * 0.06,
    },
    forgotPassword: {
        position: 'absolute',
        top: height * 0.22,
        left: width * 0.5,
        zIndex: 20,
    },
    exitButton: {
        position: 'absolute',
        top: height * -0.03,
        right: width * 0.1,
        zIndex: 20,
    },
    proceedButton: {
        position: 'absolute',
        top: height * 0.35,
        zIndex: 20,
        alignSelf: 'center',
    },
    signUpButton: {
        backgroundColor: '#6C4E31',
        shadowOffset: {width:0, height:2},
        shadowRadius:4,
        elevation: 5,
        width: width * 0.85,
        paddingVertical: height * 0.02,
        borderRadius: 35,
        marginTop: height * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: height * 0.35,
        alignSelf: 'center',
        zIndex:20
    }
});

const SignUpScreen = () => {
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    return (
        <View className="flex-1">
            <ImageBackground
                source={require('../assets/images/bg_main.jpg')}
                style={{width: '100%', height: '100%'}} 
                imageStyle={{resizeMode: "cover"}}>

            {/* Curved Background */}
            <View style={styles.curvedBox}></View>
            
            {/* Main Content */}
            <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: height * -0.30 }}>
                <Text style={styles.titleText}>SIGN UP</Text>
                
                {/* Username Input */}
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Text style={{ alignSelf: 'flex-start', zIndex: 40, marginVertical: 8, marginHorizontal: width * 0.1 }}>Username</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email-outline" size={width * 0.07} color="#353535" />
                        <TextInput
                            placeholder="Enter your username"
                            placeholderTextColor="#9E9A9A"
                            style={{ flex: 1, paddingLeft: 10, fontSize: width * 0.04 }}
                            keyboardType="default"
                        />
                    </View>
                </View>

                {/* Password Input */}
                <View style={{ width: '100%', alignItems: 'center', marginTop: height * 0.01 }}>
                    <Text style={{ alignSelf: 'flex-start', zIndex: 40, marginVertical: 8, marginHorizontal: width * 0.1 }}>Password</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-outline" size={width * 0.07} color="#353535" />
                        <TextInput
                            placeholder="Enter your password"
                            placeholderTextColor="#9E9A9A"
                            style={{ flex: 1, paddingLeft: 10, fontSize: width * 0.04 }}
                            keyboardType="default"
                            secureTextEntry={secureTextEntry}
                        />
                        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                            <MaterialCommunityIcons 
                                name={secureTextEntry ? "eye-off" : "eye"} 
                                size={width * 0.06} 
                                color="#353535" 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View style={{ width: '100%', alignItems: 'center', marginTop: height * 0.01 }}>
                    <Text style={{ alignSelf: 'flex-start', zIndex: 40, marginVertical: 8, marginHorizontal: width * 0.1 }}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-outline" size={width * 0.07} color="#353535" />
                        <TextInput
                            placeholder="Confirm your password"
                            placeholderTextColor="#9E9A9A"
                            style={{ flex: 1, paddingLeft: 10, fontSize: width * 0.04 }}
                            keyboardType="default"
                            secureTextEntry={secureTextEntry}
                        />
                    </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={{color: '#7B5E3C', textDecorationLine: 'underline', fontSize: width * 0.035, marginTop: height * 0.02, marginHorizontal: width * 0.1 }}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                {/* Exit Button */}
                <TouchableOpacity style={styles.exitButton}>
                    <Octicons name="x-circle-fill" size={width * 0.09} color="#74512D"/>
                </TouchableOpacity>
                
                {/* Proceed Button */}
                <TouchableOpacity style={styles.proceedButton}>
                    <MaterialCommunityIcons name="arrow-right-circle" size={width * 0.12} color="#74512D"/>
                </TouchableOpacity>

                {/* SignUp Button */}
                <Pressable 
                    style={styles.signUpButton}
                    onPress={()=>router.push("/")}>
                    <Text style={{color: '#FFFFFF', fontSize: width * 0.04}}>
                        Have an existing account? Log In
                    </Text>
                </Pressable>
            </View>
            </ImageBackground>
        </View>
    );
};

export default SignUpScreen;