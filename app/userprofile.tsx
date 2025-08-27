import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [diet, setDiet] = useState("Vegetarian");
  const [commute, setCommute] = useState("Bike");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem("user_profile");
      if (data) {
        const profile = JSON.parse(data);
        setName(profile.name);
        setAge(profile.age.toString());
        setDiet(profile.diet);
        setCommute(profile.commute);
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  };

  const saveProfile = async () => {
    if (!name || !age) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }

    const profile = {
      name,
      age: parseInt(age),
      diet,
      commute,
    };

    try {
      await AsyncStorage.setItem("user_profile", JSON.stringify(profile));
      Alert.alert("Saved", "Profile saved successfully!");
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={styles.input}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Enter your age"
        style={styles.input}
      />

      <Text style={styles.label}>Diet Type</Text>
      <Picker
        selectedValue={diet}
        onValueChange={(value) => setDiet(value)}
        style={styles.input}
      >
        <Picker.Item label="Vegetarian" value="Vegetarian" />
        <Picker.Item label="Non-Vegetarian" value="Non-Vegetarian" />
        <Picker.Item label="Vegan" value="Vegan" />
      </Picker>

      <Text style={styles.label}>Primary Commute</Text>
      <Picker
        selectedValue={commute}
        onValueChange={(value) => setCommute(value)}
        style={styles.input}
      >
        <Picker.Item label="Walk" value="Walk" />
        <Picker.Item label="Bike" value="Bike" />
        <Picker.Item label="Car" value="Car" />
        <Picker.Item label="Metro" value="Metro" />
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Save Profile" onPress={saveProfile} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
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