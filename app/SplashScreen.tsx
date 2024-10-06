import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationProp } from '@react-navigation/native';

interface SplashScreenProps {
  navigation: NavigationProp<any>; // Define the navigation prop type
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');  // Ensure 'Home' exists in your navigation stack
    }, 5000);

    return () => clearTimeout(timer);  // Cleanup timeout
  }, [navigation]);  // Adding navigation as a dependency

  return (
    <View style={styles.container}>
      {/* Top Logo (REVA Agri) */}
      <Animatable.View animation="fadeIn" duration={1500} style={styles.topLogoContainer}>
        <Image
          source={require('@/assets/images/grapeai.png')}  // Add the REVA Agri logo
          style={styles.topLogo}
          resizeMode="contain"
        />
      </Animatable.View>

      {/* Center Logos (Government and other logo) */}
      <Animatable.View animation="zoomIn" duration={1500} style={styles.centerLogosContainer}>
        <View style={styles.logosRow}>
          <Image
            source={require('@/assets/images/govt-logo.png')}  // Add the Government logo
            style={styles.logo1}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/revauniversity.png')}  // Add the second logo
            style={styles.logo2}
            resizeMode="contain"
          />
        </View>
      </Animatable.View>

      {/* Powered By Section */}
      <Animatable.View animation="fadeIn" delay={500} duration={1500} style={styles.poweredByContainer}>
        <Text style={styles.poweredByText}>Powered By</Text>
        <Text style={styles.companyText}>ATOMS 360</Text>
      </Animatable.View>

      {/* School Section with Orange Styling */}
      <Animatable.View animation="fadeIn" delay={500} duration={1500} style={styles.poweredByContainer}>
        <Text style={styles.schoolText}>School Of EEE</Text>
        <Text style={styles.collegeText}>REVA University</Text>
      </Animatable.View>

      {/* Footer Text */}
      <Animatable.View animation="fadeInUp" delay={1000} duration={1500} style={styles.footerTextContainer}>
        <Text style={styles.footerText}>All copyright's reserved</Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',  // Keep the background white
  },
  topLogoContainer: {
    marginTop: 20,
  },
  topLogo: {
    width: 150,
    height: 150,
  },
  centerLogosContainer: {
    alignItems: 'center',
  },
  logosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',  // Distribute logos evenly
    alignItems: 'center',
    width: '100%',  // Ensure row takes up full width
    paddingHorizontal: 20,  // Add some padding to the sides
  },
  logo1: {
    width: 150,  // Adjust size to fit within screen
    height: 150,
  },
  logo2: {
    width: 300,  // Adjust size to fit within screen
    height: 450,
  },
  poweredByContainer: {
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: 18,
    color: '#000000',  // Black text color
    marginBottom: 5,
  },
  schoolText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F48329',  // Orange color for School Of EEE
    marginBottom: 5,
  },
  companyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',  // Black text color
  },
  collegeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F48329',  // Orange color for REVA University
  },
  footerTextContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#000000',  // Black text color
  },
});

export default SplashScreen;
