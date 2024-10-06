import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, ActivityIndicator, Surface, HelperText } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import { NavigationProp } from '@react-navigation/native';
import { getPrediction } from "@/components/services/predictionService"// Corrected import path
import Toast from 'react-native-toast-message'; // Import Toast

interface InputScreenProps {
  navigation: NavigationProp<any>;
}

const InputScreen: React.FC<InputScreenProps> = ({ navigation }) => {
  const [inputs, setInputs] = useState<{
    solarRadiation: string;
    humidity: string;
    conductivity: string;
    phosphorous: string;
    pHValue: string;
    temperature: string;
    nitrogen: string;
    potassium: string;
  }>({
    solarRadiation: '',
    humidity: '',
    conductivity: '',
    phosphorous: '',
    pHValue: '',
    temperature: '',
    nitrogen: '',
    potassium: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const prediction = await getPrediction(inputs);
      if (prediction) {
        navigation.navigate('Output', { prediction }); // Pass prediction to OutputScreen
      } else {
        // Show toast message when no prediction is received
        Toast.show({
          text1: 'No Prediction Received',
          text2: 'Please check your input values and try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Prediction error:', error);
      // Show alert for prediction error
      Alert.alert('Prediction Error', 'An error occurred while fetching the prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGuideline = (key: keyof typeof inputs): string => {
    const guidelines: Record<string, string> = {
      solarRadiation: 'Value in kWh/m², range: 0-1000',
      humidity: 'Percentage, range: 0-100%',
      conductivity: 'mS/cm, range: 0-10',
      phosphorous: 'mg/L, range: 0-50',
      pHValue: 'Value, range: 0-14',
      temperature: 'Temperature in °C',
      nitrogen: 'mg/L, range: 0-100',
      potassium: 'mg/L, range: 0-100',
    };
    return guidelines[key] || 'Please enter a valid value';
  };

  const hasErrors = (value: string): boolean => {
    return value === ''; // A simple check for empty input
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1000}>
        <Surface style={styles.surface}>
          {Object.keys(inputs).map((key, index) => (
            <Animatable.View key={key} animation="fadeInLeft" delay={index * 100}>
              <TextInput
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={inputs[key as keyof typeof inputs]}
                onChangeText={(text) => setInputs({ ...inputs, [key]: text })}
                style={styles.input}
                mode="outlined"
                placeholder={getGuideline(key as keyof typeof inputs)}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {getGuideline(key as keyof typeof inputs)}
              </HelperText>
              <HelperText type="error" visible={hasErrors(inputs[key as keyof typeof inputs])}>
                {inputs[key as keyof typeof inputs] === '' && `Please provide a valid ${key}`}
              </HelperText>
            </Animatable.View>
          ))}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator animating={true} color="#fff" /> : 'Predict'}
          </Button>
        </Surface>
      </Animatable.View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F6F7',
  },
  surface: {
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#FFF',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#8E44AD',
  },
  helperText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default InputScreen;