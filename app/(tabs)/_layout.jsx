import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function TabLayout() {
    const inset = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                headerTitleStyle: {
                    color: COLORS.textPrimary,
                    fontWeight: "600"
                }, 
                headerShadowVisible: false,
                tabBarStyle: {
                    backgroundColor: COLORS.cardBackground,
                    borderTopWidth: 1, 
                    borderTopColor: COLORS.border,
                    paddingTop: 5,
                    paddingBottom: inset.bottom,
                    height: 60 + inset.bottom
                }
            }}
        >
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({color, size}) =>( <Ionicons name="home-outline"
                size={size} 
                color={color}
                />),
            }} />
            <Tabs.Screen name="create" options={{
                title: "Create",
                tabBarIcon: ({color, size}) =>( <Ionicons name="add-circle-outline"
                size={size} 
                color={color}
                />),
            }}/>
            <Tabs.Screen name="profile" options={{
                title: "Profle",
                tabBarIcon: ({color, size}) =>( <Ionicons name="person-outline"
                size={size} 
                color={color}
                />),
            }} />
            <Tabs.Screen
                name="movie" // 這個 name 會直接匹配 app/(tabs)/movie/ 目錄
                              // 然後 Expo Router 會自動尋找該目錄下的 index.jsx
                options={{
                    title: "Movie", // 這個 title 應該會被應用
                    tabBarIcon: ({ color, size }) => (<Ionicons name="film-outline" size={size} color={color} />),
                }}
            />
        </Tabs>
    )
}