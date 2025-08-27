import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // ✅ NEW IMPORT

const materials = ["Plastic", "Glass", "Metal", "Textile"];

export default function AddLog() {
  const navigation = useNavigation(); // ✅ HOOK INSTEAD OF PROP
  const [material, setMaterial] = useState<string>(materials[0]);
  const [amount, setAmount] = useState<string>("");
  const [emission, setEmission] = useState<string>("");

  const handleAddLog = async () => {
    if (!amount || !emission) {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }

    const newLog = {
      id: Math.random().toString(),
      material,
      amount,
      emission,
    };

    try {
      const existingLogs = await AsyncStorage.getItem("logs");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(newLog);
      await AsyncStorage.setItem("logs", JSON.stringify(logs));
      navigation.goBack(); // ✅ now guaranteed to work
    } catch (error) {
      console.error("Error saving log:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Log</Text>

      <Text style={styles.label}>Material</Text>
      <TextInput
        style={styles.input}
        value={material}
        onChangeText={setMaterial}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Emission (kg CO₂)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={emission}
        onChangeText={setEmission}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddLog}>
        <Text style={styles.buttonText}>Add Log</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
  },
});