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
  const [activeSlider, setActiveSlider] = useState<"work" | "break" | null>(null);
  const [tempMinutes, setTempMinutes] = useState<number | null>(null);

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
      <View style={styles.page}>
        <Pressable
          onPress={() => setIsRunning(r => !r)}
          style={[
            styles.circle,
            { borderColor: currentPhase === "work" ? "#F2C94C" : "#6FCF97" }
          ]}
        >
          <Text style={styles.time}>{formatSeconds(remaining)}</Text>
          {isRunning
            ? <Ionicons name="pause" size={36} color="#111" style={{ marginTop: 8 }} />
            : <Ionicons name="play" size={36} color="#111" style={{ marginTop: 8 }} />
          }
        </Pressable>

        <Pressable onPress={() => setReset(true)} style={styles.resetBtn}>
          <Ionicons name="refresh" size={28} color="#666" />
        </Pressable>

        <View style={styles.dotsRow}>
          <Pressable
            onPressIn={() => !activeSlider ? setActiveSlider("work") : null}
            onPressOut={() => activeSlider ? setActiveSlider(null) : null}
            style={[styles.dot, { backgroundColor: "#F2C94C" }]}
          />

          <Pressable
            onPressIn={() => !activeSlider ? setActiveSlider("break") : null}
            onPressOut={() => activeSlider ? setActiveSlider(null) : null}
            style={[styles.dot, { backgroundColor: "#6FCF97" }]}
          />

        </View>
      </View>
    </GestureDetector>
  );
}
function formatSeconds(s: number): string
{
  let minutes: string = (Math.floor(s / 60)).toString().padStart(2, '0');
  let seconds: string = (s % 60).toString().padStart(2, '0');
  return minutes + ':' + seconds;
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 24, // espace vertical propre
  },
  circle: {
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: "#FFF",
    justifyContent: "center", alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000", shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 16,
    elevation: 6,
  },
  time: { fontSize: 60, fontWeight: "900", color: "#111", letterSpacing: 1 },
  resetBtn: {
    padding: 10, borderRadius: 999, backgroundColor: "#F5F5F5",
    shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
  },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 18, marginTop: 4 },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 35,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3, // Android
  },
});