import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Button, TextInput, Modal, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import MultiChatRoom from './MultiChatRoom';

type Room = { name: string; numParticipants: number };

export default function RoomListScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const userId = useRef(`mobile-user-${Math.floor(Math.random() * 10000)}`);

  const baseURL = Platform.OS === "android"
    ? "http://192.168.1.10:3000"
    : "http://10.0.2.2:3000";

  useEffect(() => {
    fetchRooms(); // initial fetch

    const interval = setInterval(fetchRooms, 3000); // refetch every 3s
    return () => clearInterval(interval);
    }, []);


  const fetchRooms = async () => {
    try {
      const res = await fetch(`${baseURL}/listRooms`);
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = (roomName: string) => {
    setJoinedRoom(roomName);  // just set state
  };

  const createRoom = async () => {
    if (!newRoomName) return;
    try {
      setJoinedRoom(newRoomName);   // switch screen
      setModalVisible(false);
      setNewRoomName("");
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  // ⬇️ If a room is joined, show MultiChatRoom instead of list
  if (joinedRoom) {
    return (
        <MultiChatRoom
        roomName={joinedRoom}
        userId={userId.current}
        onLeaveRoom={(numParticipants) => {
            setRooms(prevRooms =>
            prevRooms.map(r =>
                r.name === joinedRoom ? { ...r, numParticipants } : r
            )
            );
            setJoinedRoom(null);
        }}
        />
    );
 }


  return (
  <View style={styles.container}>
    <Text style={styles.header}>Available Rooms</Text>

    {/* Create Room button */}
    <TouchableOpacity
      style={styles.createButton}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.createButtonText}>+ Create Room</Text>
    </TouchableOpacity>

    {loading ? (
      <Text style={styles.loadingText}>Loading rooms...</Text>
    ) : rooms.length === 0 ? (
      <Text style={styles.noRoomsText}>No rooms available</Text>
    ) : (
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.roomCard}>
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.roomInfo}>
              Participants: {item.numParticipants}
            </Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => joinRoom(item.name)}
            >
              <Text style={styles.joinButtonText}>Join Room</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    )}

    {/* Modal (already styled) */}
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create a New Room</Text>
          <TextInput
            style={styles.input}
            value={newRoomName}
            onChangeText={setNewRoomName}
            placeholder="Enter room name"
            placeholderTextColor="#999"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={createRoom}>
              <Text style={styles.primaryButtonText}>Create & Join</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 26,
    marginBottom: 15,
    textAlign: "center",
    color: "#222",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 40,
  },
  noRoomsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  roomInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "600",
  },
});

