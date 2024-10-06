import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Title, Paragraph, Card, Surface, Button, ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import HTML from 'react-native-render-html';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';

// Define the types for the prediction object
interface Prediction {
  disease: string;
  pestAttacks: {
    [key: string]: string; // Key is the pest name, value is the probability as a string
  };
}

// Define the props for the OutputScreen component
interface OutputScreenProps {
  prediction: Prediction;
  onBackToHome: () => void;
}

const OutputScreen: React.FC<OutputScreenProps> = ({ prediction, onBackToHome }) => {
  const [llmAnalysis, setLlmAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLlmAnalysis();
  }, []);

  const fetchLlmAnalysis = async () => {
    try {
      // Prepare the data in the format the server expects
      const formattedData = {
        disease: prediction.disease,
        flea_beetle: prediction.pestAttacks['Flea Beetle'].replace('%', ''),
        thrips: prediction.pestAttacks['Thrips'].replace('%', ''),
        mealybug: prediction.pestAttacks['MealyBug'].replace('%', ''),
        jassids: prediction.pestAttacks['Jassids'].replace('%', ''),
        red_spider_mites: prediction.pestAttacks['Red Spider Mites'].replace('%', ''),
        leaf_eating_caterpillar: prediction.pestAttacks['Leaf Eating Caterpillar'].replace('%', ''),
      };

      const response = await fetch('http://10.0.2.2:8000/describe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.text();
      setLlmAnalysis(data);
    } catch (error: any) {
      console.error('Error fetching LLM analysis:', error);
      setLlmAnalysis(`<p>Failed to load LLM analysis. Error: ${error.message}</p>`);
    } finally {
      setLoading(false);
    }
  };

  const generateScreenContentHTML = () => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .title { font-size: 24px; color: #8E44AD; text-align: center; }
            .card { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .card-title { font-size: 18px; margin-bottom: 10px; }
            .bar-container { display: flex; align-items: center; margin-bottom: 10px; }
            .bar-label { width: 30%; }
            .bar-wrapper { flex: 1; }
            .bar { height: 20px; background-color: #8E44AD; border-radius: 10px; }
            .probability-text { margin-left: 10px; }
          </style>
        </head>
        <body>
          <h1 class="title">Prediction Results</h1>
          
          <div class="card">
            <h2 class="card-title">Predicted Disease</h2>
            <p>${prediction.disease}</p>
          </div>
          
          <div class="card">
            <h2 class="card-title">Pest Attack Probabilities</h2>
            ${Object.entries(prediction.pestAttacks).map(([pest, probability]) => `
              <div class="bar-container">
                <div class="bar-label">${pest}</div>
                <div class="bar-wrapper">
                  <div class="bar" style="width: ${parseFloat(probability)}%;"></div>
                </div>
                <span class="probability-text">${probability}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="card">
            <h2 class="card-title">Detailed Analysis</h2>
            ${llmAnalysis}
          </div>
        </body>
      </html>
    `;
  };

  const downloadScreenContentAsPDF = async () => {
    try {
      // Request write permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'You need to give storage permission to generate the PDF');
          return;
        }
      }

      const htmlContent = generateScreenContentHTML();

      // Generate PDF
      const options = {
        html: htmlContent,
        fileName: 'OutputScreenContent',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);

      // Share the generated PDF
      await Share.open({
        url: `file://${file.filePath}`,
        type: 'application/pdf',
        title: 'Output Screen Content',
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate or share PDF');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1000}>
        <Surface style={styles.surface}>
          <Title style={styles.title}>Prediction Results</Title>

          <Animatable.View animation="fadeIn" delay={300}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Predicted Disease</Title>
                <Paragraph>{prediction.disease}</Paragraph>
              </Card.Content>
            </Card>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={600}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Pest Attack Probabilities</Title>
                <View style={styles.chartContainer}>
                  {Object.entries(prediction.pestAttacks).map(([pest, probability], index) => (
                    <Animatable.View key={pest} animation="fadeInLeft" delay={index * 100} style={styles.barContainer}>
                      <View style={styles.labelContainer}>
                        <Paragraph>{pest}</Paragraph>
                      </View>
                      <View style={styles.barWrapper}>
                        <View style={[styles.bar, { width: `${parseFloat(probability)}%` }]} />
                        <Paragraph style={styles.probabilityText}>{probability}</Paragraph>
                      </View>
                    </Animatable.View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={900}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Detailed Analysis</Title>
                {loading ? (
                  <ActivityIndicator animating={true} color="#8E44AD" />
                ) : (
                  <HTML source={{ html: llmAnalysis }} contentWidth={300} />
                )}
              </Card.Content>
            </Card>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={1200}>
            <Button
              mode="contained"
              onPress={onBackToHome}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Back to Home
            </Button>
          </Animatable.View>

          <Animatable.View animation="fadeIn" delay={1500}>
            <Button
              mode="contained"
              onPress={downloadScreenContentAsPDF}
              style={[styles.button, styles.pdfButton]}
              labelStyle={styles.buttonLabel}
            >
              Download Screen as PDF
            </Button>
          </Animatable.View>
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
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#8E44AD',
  },
  card: {
    marginBottom: 20,
  },
  chartContainer: {
    marginTop: 10,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelContainer: {
    width: '30%',
  },
  barWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 20,
    backgroundColor: '#8E44AD',
    borderRadius: 10,
  },
  probabilityText: {
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#8E44AD',
    borderRadius: 10,
  },
  buttonLabel: {
    color: '#FFF',
  },
  pdfButton: {
    marginTop: 10,
    backgroundColor: '#27AE60',
  },
});

export default OutputScreen;