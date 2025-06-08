import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const router = useRouter();
  const segements = useSegments(); 
  const {checkAuth, user, token} = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if ( fontsLoaded ) SplashScreen.hideAsync()
  }, [fontsLoaded]); 

  // 取出 AsyncStorage 是否已經有登入資料
  useEffect(() => {
    checkAuth() ;
  }, [])

  // handle navigation based on the auth state
  useEffect(() => {
    const inAuthScreen = segements[0] === "(auth)";
    const isSignedIn = user && token ; // 身份都有 代表已登入
    if ( !isSignedIn && !inAuthScreen ) { // 未登入 且不再登入頁面
      router.replace("/(auth)"); // 進入登入頁
    } else if ( isSignedIn && inAuthScreen ) { // 已登入 卻在登入頁
      router.replace("/(tabs)");
    }
  },[user, token, segements])


  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>
  
  );
}
