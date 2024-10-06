import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

interface UserProfile {
  name: string;
  email: string;
  phone?: string; // Optional field
  address?: string; // Optional field
  soilType: string;
  farmArea: string; // in acres
  landRevenueSurveyNo: string;
  gpsLocation: {
    latitude: string;
    longitude: string;
  };
  referralCode: string; // New field for referral code
  predictionsCount: number; // New field for predictions count
}

const initialUserProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  address: '123 Main St, Anytown, USA',
  soilType: '',
  farmArea: '',
  landRevenueSurveyNo: '',
  gpsLocation: {
    latitude: '',
    longitude: '',
  },
  referralCode: '', // Initialize referral code
  predictionsCount: 0, // Initialize predictions count
};


const ProfileScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          gpsLocation: {
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          },
        }));
      } else {
        console.log('Location permission not granted');
      }
    };

    fetchLocation();
  }, []);

  const handleInputChange = (key: keyof UserProfile, value: string) => {
    setUserProfile({ ...userProfile, [key]: value });
  };

  const handleGpsChange = (key: 'latitude' | 'longitude', value: string) => {
    setUserProfile({
      ...userProfile,
      gpsLocation: { ...userProfile.gpsLocation, [key]: value },
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log('Updated Profile:', userProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out successfully.');
  };

  const handleReferralSubmit = () => {
    Alert.alert('Referral Code', `Referral code ${userProfile.referralCode} submitted.`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/your-background-image.jpg' }} // Replace with your image URL
        style={styles.image}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{userProfile.name}</Text>
            <Text style={styles.detail}>Email: {userProfile.email}</Text>
            {userProfile.phone && <Text style={styles.detail}>Phone: {userProfile.phone}</Text>}
            {userProfile.address && <Text style={styles.detail}>Address: {userProfile.address}</Text>}
            <Text style={styles.detail}>Predictions Count: {userProfile.predictionsCount}</Text>

            {/* Editable Fields */}
            {isEditing ? (
              <>
                <Picker
                  selectedValue={userProfile.soilType}
                  onValueChange={(itemValue) => handleInputChange('soilType', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Soil Type" value="" />
                  <Picker.Item label="Alluvial" value="Alluvial" />
                  <Picker.Item label="Black" value="Black" />
                  <Picker.Item label="Red" value="Red" />
                  <Picker.Item label="Laterite" value="Laterite" />
                  <Picker.Item label="Saline" value="Saline" />
                  <Picker.Item label="Sandy" value="Sandy" />
                  <Picker.Item label="Clay" value="Clay" />
                  <Picker.Item label="Loamy" value="Loamy" />
                  <Picker.Item label="Peaty" value="Peaty" />
                </Picker>
                <TextInput
                  label="Area of Farm (in acres)"
                  value={userProfile.farmArea}
                  onChangeText={(text) => handleInputChange('farmArea', text)}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  label="Land Revenue Survey No"
                  value={userProfile.landRevenueSurveyNo}
                  onChangeText={(text) => handleInputChange('landRevenueSurveyNo', text)}
                  style={styles.input}
                />
                <TextInput
                  label="GPS Latitude"
                  value={userProfile.gpsLocation.latitude}
                  onChangeText={(text) => handleGpsChange('latitude', text)}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  label="GPS Longitude"
                  value={userProfile.gpsLocation.longitude}
                  onChangeText={(text) => handleGpsChange('longitude', text)}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  label="Referral Code"
                  value={userProfile.referralCode}
                  onChangeText={(text) => handleInputChange('referralCode', text)}
                  style={styles.input}
                />
                <Button mode="contained" onPress={handleReferralSubmit} style={styles.button}>
                  Submit Referral
                </Button>
                <Button mode="contained" onPress={handleSave} style={styles.button}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Text style={styles.detail}>Soil Type: {userProfile.soilType || 'Not provided'}</Text>
                <Text style={styles.detail}>Farm Area: {userProfile.farmArea || 'Not provided'} acres</Text>
                <Text style={styles.detail}>Land Revenue Survey No: {userProfile.landRevenueSurveyNo || 'Not provided'}</Text>
                <Text style={styles.detail}>
                  GPS Location: {userProfile.gpsLocation.latitude && userProfile.gpsLocation.longitude 
                    ? `${userProfile.gpsLocation.latitude}, ${userProfile.gpsLocation.longitude}` 
                    : 'Not provided'}
                </Text>
                <Button mode="outlined" onPress={handleEditToggle} style={styles.button}>
                  Edit
                </Button>
              </>
            )}
            <Button mode="outlined" onPress={handleLogout} style={styles.button}>
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as needed
    resizeMode: 'cover',
  },
  scrollViewContent: {
    paddingTop: 200, // Adjust to prevent content from hiding behind the image
  },
  card: {
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;