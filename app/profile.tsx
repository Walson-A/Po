import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector, Directions } from "react-native-gesture-handler";

export default function Profile()
{
    const router = useRouter();

    const swipeLeft = Gesture.Fling()
        .direction(Directions.LEFT)
        .onEnd(() => { }); // dernier onglet → rien

    const swipeRight = Gesture.Fling()
        .direction(Directions.RIGHT)
        .onEnd(() => router.replace("/stats"));

    const gestures = Gesture.Exclusive(swipeLeft, swipeRight);

    return (
        <GestureDetector gesture={gestures}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 24 }}>Profil screen</Text>
            </View>
        </GestureDetector>
    );
}