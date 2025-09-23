import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MultiChatRoom from "./room/MultiChatRoom";
import RoomListScreen from "./room/RoomListScreen";

const CreateRoom: React.FC = () => {
  return (
      <RoomListScreen />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default CreateRoom;
