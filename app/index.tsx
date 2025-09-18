import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector, Directions } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';

export default function App()
{
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<"work" | "break">("work");
  const [workTime, setWorkTime] = useState<number>(10);
  const [breakTime, setBreakTime] = useState<number>(5);
  const [remaining, setRemaining] = useState<number>(workTime);
  const [reset, setReset] = useState<boolean>(false);
  const [buttonColor, setButtonColor] = useState<string>("#E0E0E0");
  const router = useRouter();

  // swipe gestures
  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => router.replace("/stats"));

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => { }); // premier onglet → rien

  const gestures = Gesture.Exclusive(swipeLeft, swipeRight);

  // Timer logic
  useEffect(() =>
  {
    if (isRunning)
    {
      const id = setInterval(() =>
      {
        setRemaining(r =>
        {
          if (r > 1) return r - 1;
          if (currentPhase === "work")
          {
            setCurrentPhase("break");
            setRemaining(breakTime);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          } else
          {
            setCurrentPhase("work");
            setRemaining(workTime);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          return 0;
        });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [isRunning, currentPhase, breakTime, workTime, remaining]);

  // Reset logic
  useEffect(() =>
  {
    if (reset)
    {
      if (currentPhase === "work") setRemaining(workTime);
      else setRemaining(breakTime);
      setIsRunning(false);
      setReset(false);
    }
  }, [reset, workTime, breakTime, currentPhase]);

  // Button Color logic
  useEffect(() => 
  {
    if (isRunning) setButtonColor(currentPhase === "work" ? "#F2C94C" : "#6FCF97");
    else setButtonColor("#E0E0E0");
  }, [isRunning, currentPhase]);

  return (
    <GestureDetector gesture={gestures}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffffff" }}>
        <View style={styles.container}>
          <Pressable
            style=
            {[
              styles.circle,
              {
                backgroundColor: buttonColor,
                borderWidth: 2,
                borderColor: currentPhase === "work" ? "#F2C94C" : "#6FCF97"
              }
            ]}
            onPress={() => setIsRunning(r => !r)}
          >
            <Text style={styles.circleText}>
              {formatSeconds(remaining)}
            </Text>
            {isRunning ? <Ionicons name="pause" size={48} color="#111" /> : <Ionicons name="play" size={48} color="#111" />}
          </Pressable>
          <Pressable onPress={() => setReset(true)}>
            <Ionicons name="refresh" size={48} />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#F2C94C" }} />
          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#6FCF97" }} />
        </View>
      </View>
    </GestureDetector >
  );
}

function formatSeconds(s: number): string
{
  let minutes: string = (Math.floor(s / 60)).toString().padStart(2, '0');
  let seconds: string = (s % 60).toString().padStart(2, '0');
  return minutes + ':' + seconds;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  circle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5, // pour Android
  },
  circleText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#111",
  },
});