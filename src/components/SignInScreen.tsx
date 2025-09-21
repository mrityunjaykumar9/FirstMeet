import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, Alert, Animated, KeyboardAvoidingView, 
  ScrollView, Platform 
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase"; // adjust import path

type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;  
  Home: undefined;
  RandomChat: undefined;
  CreateRoom: undefined;
  PracticeSession: undefined;
  Notes: undefined;
};

type SignInProps = StackScreenProps<RootStackParamList, 'SignIn'>;

const SignInScreen: React.FC<SignInProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');

  // Animated values
  const emailBorderColor = useRef(new Animated.Value(0)).current;
  const passwordBorderColor = useRef(new Animated.Value(0)).current;

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
      outputRange: ['#E0E0E0', '#66BB6A'],
    });
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password!");
      return;
    }

    try {
      // ✅ Firebase email/password login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Alert.alert("Success", `Welcome back, ${user.email}!`);
      navigation.navigate('Home');
    } catch (error: any) {
      console.error("❌ SignIn Error:", error);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in with your email</Text>
          
          <View style={styles.card}>
            {/* Email */}
            <Animated.View style={[styles.inputContainer, { borderColor: interpolateColor(emailBorderColor) }]}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => handleFocus(emailBorderColor)}
                onBlur={() => handleBlur(emailBorderColor)}
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
            
            {/* Sign In Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkContainer}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
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

export default SignInScreen;
