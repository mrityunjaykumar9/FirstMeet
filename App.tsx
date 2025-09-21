import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { Text, View } from 'react-native';

import SignUpScreen from './src/components/SignUpScreen';
import SignInScreen from './src/components/SignInScreen';

import RandomChat from './src/features/RandomChat';
import CreateRoom from './src/features/CreateRoom';
import PracticeSession from './src/features/PracticeSession';
import Notes from './src/features/Notes';
import HomeScreen from './src/components/HomeScreen';

// Define the types for your entire app's navigation stack
type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;  
  Home: undefined;
  RandomChat: undefined;
  CreateRoom: undefined;
  PracticeSession: undefined;
  Notes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RandomChat" component={RandomChat} />
        <Stack.Screen name="CreateRoom" component={CreateRoom} />
        <Stack.Screen name="PracticeSession" component={PracticeSession} />
        <Stack.Screen name="Notes" component={Notes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;
