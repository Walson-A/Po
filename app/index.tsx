import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector, Directions } from "react-native-gesture-handler";

export default function App()
{
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<"work" | "break">("work");
  const [workTime, setWorkTime] = useState<number>(10);
  const [breakTime, setBreakTime] = useState<number>(5);
  const [remaining, setRemaining] = useState<number>(workTime);
  const [reset, setReset] = useState<boolean>(false);

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
  }, [isRunning, currentPhase, breakTime, workTime]);

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

  return (
    <GestureDetector gesture={gestures}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <Text>{currentPhase === "work" ? "Votre session de travail se termine dans : " : "Votre pause se termine dans : "}</Text>
        <Text style={{ fontSize: 48, fontWeight: "900", color: "#111" }}>{formatSeconds(remaining)}</Text>
        <Pressable onPress={() => setIsRunning(r => !r)}>
          <Text>{isRunning ? "Pause" : "Start"}</Text>
        </Pressable>
        <Pressable onPress={() => setReset(true)}>
          <Text>Reset</Text>
        </Pressable>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#F2C94C" }} />
          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#6FCF97" }} />
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
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});