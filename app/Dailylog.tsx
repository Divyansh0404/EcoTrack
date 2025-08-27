import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateEmissionFromLog } from "../utils/calculateEmissionfromLog";

export default function DailyLog() {
  const [transportMode, setTransportMode] = useState("Walk");
  const [distance, setDistance] = useState("");
  const [meals, setMeals] = useState("Vegetarian");
  const [electricityUsage, setElectricityUsage] = useState("");
  const [plasticUsed, setPlasticUsed] = useState("");

  const handleSaveLog = async () => {
    if (!distance || !electricityUsage || !plasticUsed) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }

    const log = {
      date: new Date().toISOString(),
      transportMode,
      distance: parseFloat(distance),
      meals,
      electricityUsage: parseFloat(electricityUsage),
      plasticUsed: parseFloat(plasticUsed),
    };

    const emission = calculateEmissionFromLog(log);
    const finalLog = { ...log, emission };

    try {
      const existing = await AsyncStorage.getItem("daily_activities");
      const logs = existing ? JSON.parse(existing) : [];
      logs.push(finalLog);
      await AsyncStorage.setItem("daily_activities", JSON.stringify(logs));
      Alert.alert("Success", `Activity saved. Estimated CO₂: ${emission} kg`);
      setDistance("");
      setElectricityUsage("");
      setPlasticUsed("");
    } catch (e) {
      console.error("Error saving log:", e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Daily Activities</Text>

      <Text style={styles.label}>Transport Mode</Text>
      <Picker
        selectedValue={transportMode}
        onValueChange={(val) => setTransportMode(val)}
        style={styles.input}
      >
        <Picker.Item label="Walk" value="Walk" />
        <Picker.Item label="Bike" value="Bike" />
        <Picker.Item label="Car" value="Car" />
        <Picker.Item label="Metro" value="Metro" />
      </Picker>

      <Text style={styles.label}>Distance Travelled (km)</Text>
      <TextInput
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
        placeholder="e.g., 5"
        style={styles.input}
      />

      <Text style={styles.label}>Meal Type</Text>
      <Picker
        selectedValue={meals}
        onValueChange={(val) => setMeals(val)}
        style={styles.input}
      >
        <Picker.Item label="Vegetarian" value="Vegetarian" />
        <Picker.Item label="Non-Vegetarian" value="Non-Vegetarian" />
        <Picker.Item label="Vegan" value="Vegan" />
      </Picker>

      <Text style={styles.label}>Electricity Usage (kWh)</Text>
      <TextInput
        value={electricityUsage}
        onChangeText={setElectricityUsage}
        keyboardType="numeric"
        placeholder="e.g., 2.5"
        style={styles.input}
      />

      <Text style={styles.label}>Plastic Used (kg)</Text>
      <TextInput
        value={plasticUsed}
        onChangeText={setPlasticUsed}
        keyboardType="numeric"
        placeholder="e.g., 1"
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Save Activity Log" onPress={handleSaveLog} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 30,
  },
});