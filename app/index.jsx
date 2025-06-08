import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "../store/authStore"; 
import { useEffect } from 'react';


export default function Index() {
  const {user, token, checkAuth, logout} = useAuthStore(); 
  useEffect(() => {
    checkAuth(); 
  }, [])
  
  return (
    <View style={styles.constainer}>
      <Text style={styles.title}>Hello {user?.username}</Text>
      <Text style={styles.title}>Token: {token}</Text>
      <TouchableOpacity onPress={ logout }>
        <Text>Logout</Text>
      </TouchableOpacity>
      {/*  <Image source={ require("local file") }> */}
      <Link href="/(auth)/signup">Signup Page</Link>
      <Link href="/(auth)">Login Page</Link>
    </View>
  );
}


const styles = StyleSheet.create({
  constainer:{ 
    flex:1, 
    justifyContent: "center",
    alignItems: "center",
  }, 
  title:{ 
    color:"#ff12f5",
  }
})
