import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";

export default function Layout()
{
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Tabs screenOptions={{ headerShown: false }}>
                    <Tabs.Screen name="index" options={{ title: "Timer" }} />
                    <Tabs.Screen name="stats" options={{ title: "Stats" }} />
                    <Tabs.Screen name="profile" options={{ title: "Profil" }} />
                </Tabs>
            </View>
        </GestureHandlerRootView>
    );
}