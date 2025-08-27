import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const logo = require("../Assets/logo.png");

export default function Dashboard() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const [todayEmission, setTodayEmission] = useState(0);
  const tipOfTheDay = "Try using a reusable water bottle to reduce plastic waste!";

  const loadTodayEmission = async () => {
    try {
      const data = await AsyncStorage.getItem("daily_activities");
      const logs = data ? JSON.parse(data) : [];

      const today = new Date().toISOString().slice(0, 10); // e.g., '2025-04-17'

      const todayLogs = logs.filter((log) =>
        log.date.startsWith(today)
      );

      const total = todayLogs.reduce((sum, log) => sum + (log.emission || 0), 0);
      setTodayEmission(parseFloat(total.toFixed(2)));
    } catch (e) {
      console.error("Failed to load today's emission:", e);
    }
  };

  useFocusEffect(
    // Load today's emissions every time screen is focused
    () => {
      loadTodayEmission();
    }
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Image
        source={logo}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      />

      <Text style={styles.title}>Welcome to EcoTrack</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌍 Today's Emission</Text>
        <Text style={styles.emissionValue}>{todayEmission} kg CO₂</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Green Tip</Text>
        <Text style={styles.tipText}>{tipOfTheDay}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Log Carbon Footprint" onPress={() => router.push("/log-carbon")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: "#F5FCFF",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2E7D32",
  },
  card: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emissionValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#388E3C",
  },
  tipText: {
    fontSize: 15,
    color: "#444",
  },
  buttonGroup: {
    marginTop: 20,
    width: "100%",
    gap: 10,
  },
});