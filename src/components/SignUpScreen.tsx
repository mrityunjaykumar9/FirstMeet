import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Animated, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase"; // adjust the path to where your firebase.ts is


type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;  
  Home: undefined;
  RandomChat: undefined;
  CreateRoom: undefined;
  PracticeSession: undefined;
  Notes: undefined;
};

type SignUpProps = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpProps> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');      // ✅ new
  const [phone, setPhone] = useState<string>('');      // ✅ new
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Animated border colors
  const nameBorderColor = useRef(new Animated.Value(0)).current;
  const usernameBorderColor = useRef(new Animated.Value(0)).current;
  const emailBorderColor = useRef(new Animated.Value(0)).current;     // ✅ new
  const phoneBorderColor = useRef(new Animated.Value(0)).current;     // ✅ new
  const passwordBorderColor = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderColor = useRef(new Animated.Value(0)).current;

  const handleFocus = (borderColor: Animated.Value) => {
    Animated.timing(borderColor, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (borderColor: Animated.Value) => {
    Animated.timing(borderColor, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const interpolateColor = (borderColor: Animated.Value) => {
    return borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#E0E0E0', '#66BB6A'], // light gray to vibrant green
    });
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address!");
      return;
    }
    if (phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number!");
      return;
    }

    try {
      // ✅ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Save extra details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        username,
        email,
        phone,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("SignIn");
    } catch (error: any) {
      Alert.alert("Signup Error", error.message);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Unlock a world of languages</Text>
          
          <View style={styles.card}>
            {/* Full Name */}
            <Animated.View style={[styles.inputContainer, { borderColor: interpolateColor(nameBorderColor) }]}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                onFocus={() => handleFocus(nameBorderColor)}
                onBlur={() => handleBlur(nameBorderColor)}
              />
            </Animated.View>

            {/* Username */}
            <Animated.View style={[styles.inputContainer, { borderColor: interpolateColor(usernameBorderColor) }]}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                onFocus={() => handleFocus(usernameBorderColor)}
                onBlur={() => handleBlur(usernameBorderColor)}
              />
            </Animated.View>

            {/* Email */}
            <Animated.View style={[styles.inputContainer, { borderColor: interpolateColor(emailBorderColor) }]}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => handleFocus(emailBorderColor)}
                onBlur={() => handleBlur(emailBorderColor)}
              />
            </Animated.View>

            {/* Phone Number */}
            <Animated.View style={[styles.inputContainer, { borderColor: interpolateColor(phoneBorderColor) }]}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => handleFocus(phoneBorderColor)}
                onBlur={() => handleBlur(phoneBorderColor)}
              />
            </Animated.View>

            {/* Password */}
            <Animated.View style={[styles.inputContainer, { borderColor: interpolateColor(passwordBorderColor) }]}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => handleFocus(passwordBorderColor)}
                onBlur={() => handleBlur(passwordBorderColor)}
              />
            </Animated.View>

            {/* Confirm Password */}
            <Animated.View style={[styles.inputContainer, { borderColor: interpolateColor(confirmPasswordBorderColor) }]}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => handleFocus(confirmPasswordBorderColor)}
                onBlur={() => handleBlur(confirmPasswordBorderColor)}
              />
            </Animated.View>
            
            {/* Sign Up Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Link to Sign In */}
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.linkContainer}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#66BB6A',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#66BB6A',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  link: {
    color: '#2E7D32',
    fontSize: 16,
  },
});

export default SignUpScreen;
