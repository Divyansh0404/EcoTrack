import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const categories = ['Plastic', 'Metal', 'Glass', 'Textile', 'Steel', 'Chemical'];

export default function LogCarbonScreen() {
  const [category, setCategory] = useState('Plastic');
  const [weight, setWeight] = useState('');
  const [emission, setEmission] = useState<number | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleCalculate = async () => {
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight)) {
      Alert.alert('Invalid Input', 'Please enter a valid weight.');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.2:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, weight: parsedWeight }),
      });

      const data = await response.json();
      if (data.predicted_emission) {
        setEmission(data.predicted_emission);
      } else {
        Alert.alert('Error', data.error || 'Failed to calculate emission.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Log Carbon Emission</Text>

        <Text style={styles.label}>Select Category</Text>
        <TouchableOpacity
          style={styles.pickerWrapper}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={{ paddingLeft: 10 }}>{category}</Text>
        </TouchableOpacity>

        <Modal visible={pickerVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setPickerVisible(false);
                }}
              >
                {categories.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
              <Button title="Close" onPress={() => setPickerVisible(false)} />
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter weight in kg"
        />

        <View style={styles.buttonContainer}>
          <Button title="Calculate Emission" onPress={handleCalculate} />
        </View>

        {emission !== null && (
          <Text style={styles.result}>
            Estimated Emission: {emission.toFixed(2)} kg CO₂
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginTop: 20 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 8,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 30,
  },
  result: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  pickerModal: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});