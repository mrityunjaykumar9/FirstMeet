import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Home: undefined;
  RandomChat: undefined;
  CreateRoom: undefined;
  PracticeSession: undefined;
  Notes: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Choose what you want to do today</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("RandomChat")}>
        <Ionicons name="chatbubbles-outline" size={40} color="#4A90E2" />
        <Text style={styles.cardText}>Talk to a Random Person</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("CreateRoom")}>
        <MaterialCommunityIcons name="account-group-outline" size={40} color="#50C878" />
        <Text style={styles.cardText}>Create a Room (Topic-based)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PracticeSession")}>
        <FontAwesome5 name="book-reader" size={36} color="#FF8C00" />
        <Text style={styles.cardText}>Practice Session (Language)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Notes")}>
        <Ionicons name="document-text-outline" size={40} color="#8A2BE2" />
        <Text style={styles.cardText}>Learning Materials & Notes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
    color: "#333",
  },
});
