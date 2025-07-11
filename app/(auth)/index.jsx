import { View, Text, Alert, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import styles from "../../assets/styles/login.styles";
import { useState } from "react"; 
import COLORS from "../../constants/colors";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
    const [email, setEmail] = useState("") ;
    const [password, setPassword] = useState("") ;
    const [showPassword, setShowPassword] = useState(false) ;
    const {isLoading, login, isCheckingAuth} = useAuthStore();
    
    const handleLogin = async () => {
        const result = await login(email, password);
        if (!result.success) Alert.alert("Error", result.error); 
        else {
            Alert.alert("Success!");
        }
    }; 

    if (isCheckingAuth) return null;

    return (
        <KeyboardAvoidingView
            style={{ flex:1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height" }
        >
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image
                    source={require("../../assets/images/book.png")}
                    style={styles.illustrationImage}
                    contentFit="contain"
                    />
                </View>
                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                name="mail-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter your email'
                                    placeholderTextColor={COLORS.placeholderTextColor}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                    
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter your password'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize='none'
                                />
                                <TouchableOpacity
                                    onPress={()=> setShowPassword(!showPassword) }
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons 
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <TouchableOpacity
                            onPress={handleLogin}
                            style={styles.button}
                            disabled={isLoading}
                        >
                            {isLoading ? (<ActivityIndicator color="#fff"/>) : (<Text style={styles.buttonText}>Login</Text>)}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            {/* Link一定要在外層  asChild是指轉導的功能傳給子元件 也就是 TouchableOpacity*/}
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.link}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}