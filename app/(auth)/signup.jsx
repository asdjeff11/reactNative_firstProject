import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import styles from '../../assets/styles/signup.styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react"; 
import COLORS from '../../constants/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from "../../store/authStore";

export default function Signup() {
  const [userName, setUserName] = useState("") ;
  const [email, setEmail] = useState("") ;
  const [password, setPassword] = useState("") ;
  const [showPassword, setShowPassword] = useState(false) ;

  const {user, isLoading, token, register } = useAuthStore();

  const router = useRouter();

  const handleSignup = async() => {
    const result = await register(userName, email, password); 
    if (!result.success) Alert.alert("Error", result.error)
    else {
        Alert.alert("Success!", userName)
    }
  }; 

  return (
    <KeyboardAvoidingView
        style={{ flex:1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height" }
    >
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>Book Worm </Text>
                    <Text style={styles.subtitle}>Share your favorite reads</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder='John Doe'
                                placeholderTextColor={COLORS.placeholderTextColor}
                                value={userName}
                                onChangeText={setUserName}
                                autoCapitalize='none'
                            />
                        </View>
                    </View>

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
                                placeholder='abcd@gmail.com'
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
                                placeholder='******'
                                placeholderTextColor={COLORS.placeholderText}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
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
                </View>

                <TouchableOpacity
                    onPress={handleSignup}
                    style={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? (<ActivityIndicator color="#fff"/>) : (<Text style={styles.buttonText}>Sign Up</Text>)}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={()=> router.back()}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

            
        </View>
    </KeyboardAvoidingView>
  )
}