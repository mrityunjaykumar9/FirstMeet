  import * as React from 'react';
  import {
    StyleSheet,
    View,
    FlatList,
    ListRenderItem,
    Button,
    Text,
    Platform,
    Dimensions
  } from 'react-native';
  import { useEffect, useState } from 'react';
  import {
    AudioSession,
    LiveKitRoom,
    useTracks,
    TrackReferenceOrPlaceholder,
    VideoTrack,
    isTrackReference,
    useLocalParticipant,
    useIsSpeaking,
    useParticipants,
  } from '@livekit/react-native';
  import { Track } from 'livekit-client';
  import { request, PERMISSIONS } from 'react-native-permissions';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


  const wsURL = "wss://groupvoicechat-ulw2ohcd.livekit.cloud";
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


  export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff', // black looks cleaner for video calls
      justifyContent: 'center',
      alignItems: 'center',
    },
    singleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.8,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#222',
    },
    doubleContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    doubleParticipant: {
      width: SCREEN_WIDTH * 0.9,  // each ~90% width
      height: SCREEN_HEIGHT * 0.4, // each ~half height
      marginVertical: 4,
      borderRadius: 8,
      backgroundColor: '#222',
    },

    gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  gridParticipant: {
    width: '50%',   // half screen width
    height: '50%',  // half screen height
    borderWidth: 1,
    borderColor: '#111', // optional separator
  },

    participantView: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    participantVideo: {
      ...StyleSheet.absoluteFillObject,
      resizeMode: 'cover', // fill without distortion
    },
    placeholderView: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#333',
    },
    overlay: {
      position: 'absolute',
      bottom: 6,
      left: 6,
      right: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    participantName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
    speakingIndicator: {
      fontSize: 16,
      color: '#0f0',
      marginLeft: 6,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 12,
      backgroundColor: '#111',
    },
    buttonContainer: {
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    joinButtonWrapper: {
      width: '80%',
      borderRadius: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    joinButton: {
      padding: 15,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    joinButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffffff',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    roomCard: {
      width: SCREEN_WIDTH * 0.85,
      backgroundColor: '#f0f0f0', // light gray for contrast
      borderRadius: 15,
      padding: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },

    roomName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#2E7D32', // dark green for positive vibes
      marginBottom: 20,
      textAlign: 'center',
    },


  });


  export default function MultiChatRoom({
    roomName,
    userId,
    onLeaveRoom,
  }: {
    roomName: string;
    userId: string;
    onLeaveRoom: (numParticipants: number) => void;
  }) {
    const [token, setToken] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [roomReady, setRoomReady] = useState(false);
    console.log("Room Name:", roomName);
    // const userId = React.useRef(`mobile-user-${Math.floor(Math.random() * 10000)}`);

    useEffect(() => {
      const requestPermissions = async () => {
        try {
          await request(PERMISSIONS.ANDROID.CAMERA);
          await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        } catch (err) {
          console.error("Failed to request permissions:", err);
        }
      };
      requestPermissions();

      const fetchToken = async () => {
        try {
          const user_name = userId || `mobile-user-${Math.floor(Math.random() * 10000)}`;
          const room_name = roomName || "myroom";
          const baseURL =
          Platform.OS === "android"
              ? "http://192.168.1.10:3000"
              : "http://10.0.2.2:3000";

          const apiURL = `${baseURL}/getToken?room=${encodeURIComponent(room_name)}&user=${encodeURIComponent(user_name)}`;

            // Print the final API URL
            console.log("Final API URL:", apiURL);

            const response = await fetch(apiURL);

          // const response = await fetch(`http://192.168.1.6:3000/getToken?room=${encodeURIComponent(roomName)}&user=${encodeURIComponent(userName)}`);
          const data = await response.json();
          if (data.token) {
            setToken(data.token);
            console.log("Fetched token:", data.token);
          }
        } catch (err) {
          console.error("Error fetching token:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchToken();
    }, []);

    useEffect(() => {
      const startAudioSession = async () => {
        try {
          await AudioSession.startAudioSession();
        } catch (e) {
          console.error("Failed to start audio session", e);
        }
      };
      startAudioSession();
      return () => {
        AudioSession.stopAudioSession();
      };
    }, []);

    return (
      <View style={styles.container}>
        {isConnected ? (
          <LiveKitRoom
            serverUrl={wsURL}
            token={token}
            options={{
              adaptiveStream: { pixelDensity: 'screen' },
            }}
            audio={true}
            video={true}
            onConnected={() => {
              setRoomReady(true);
            }}
            onDisconnected={() => {
              setIsConnected(false);
              setRoomReady(false);
            }}
            
          >
           {roomReady && (
              <RoomView
                onLeave={(participant_count) => {
                  setIsConnected(false);
                  setRoomReady(false);
                  onLeaveRoom?.(participant_count);
                }}
              />
            )}
          </LiveKitRoom>
        ) : (
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#66BB6A" />
            ) : token ? (
              <View style={styles.roomCard}>
                <Text style={styles.roomName}>{roomName || "My Room"}</Text>
                <TouchableOpacity
                  style={styles.joinButtonWrapper}
                  onPress={() => setIsConnected(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#66BB6A', '#b5e8c4ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.joinButton}
                  >
                    <Text style={styles.joinButtonText}>Join Room</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: '#fff' }}>Error fetching token.</Text>
            )}
          </View>

        )}
      </View>
    );
  }


  const ParticipantTile = React.memo(({ item }: { item: TrackReferenceOrPlaceholder }) => {
    if (!item.participant) return null;
    const isSpeaking = useIsSpeaking(item.participant);

    return (
      <View style={styles.participantView}>
        {isTrackReference(item) ? (
          <VideoTrack
            trackRef={item}
            style={styles.participantVideo}
          />
        ) : (
          <View style={styles.placeholderView}>
            <Text style={styles.participantName}>{item.participant.name}</Text>
            {isSpeaking && <Text style={styles.speakingIndicator}>🗣️</Text>}
          </View>
        )}
        <View style={styles.overlay}>
          <Text style={styles.participantName}>{item.participant.name}</Text>
          {isSpeaking && <Text style={styles.speakingIndicator}>🗣️</Text>}
        </View>
      </View>
    );
  });

  type RoomViewProps = {
    onLeave: (numParticipants: number) => void;
    onParticipantCountChange?: (count: number) => void;
  };

  const RoomView: React.FC<RoomViewProps> = ({ onLeave, onParticipantCountChange }) => {
    const { localParticipant } = useLocalParticipant();
    const tracks = useTracks([Track.Source.Camera]);
    const participants = useParticipants();

    useEffect(() => {
      if (onParticipantCountChange) {
        onParticipantCountChange(participants.length + 1); // +1 for local participant
      }
    }, [participants]);

    const toggleCamera = async () => {
      if (localParticipant) {
        await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
      }
    };

    const toggleMic = async () => {
      if (localParticipant) {
        await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
      }
    };

    const renderLayout = () => {
      if (tracks.length === 1) {
        return (
          <View style={styles.singleContainer}>
            <ParticipantTile item={tracks[0]} />
          </View>
        );
      } else if (tracks.length === 2) {
        return (
          <View style={styles.doubleContainer}>
            {tracks.map((item, idx) => (
              <View style={styles.doubleParticipant} key={item.participant?.identity ?? idx}>
                <ParticipantTile item={item} />
              </View>
            ))}
          </View>
        );
      } else {
        return (
          <View style={styles.gridContainer}>
            {tracks.slice(0, 4).map((item, index) => (
              <View style={styles.gridParticipant} key={item.participant?.identity ?? index}>
                <ParticipantTile item={item} />
              </View>
            ))}
          </View>
        );
      }
    };

    return (
      <View style={styles.container}>
        {renderLayout()}

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <Button
            title={localParticipant?.isCameraEnabled ? "📹 Camera" : "📸 Off"}
            onPress={toggleCamera}
          />
          <Button
            title={localParticipant?.isMicrophoneEnabled ? "🎤 Mic" : "🔇 Muted"}
            onPress={toggleMic}
          />
          <Button
            title="Leave Room"
            onPress= {() => {
             onLeave(participants.length); // +1 for local participant
            }}
            color="red"
          />
        </View>
      </View>
    );
  };



  // const RoomView: React.FC<RoomViewProps> = ({ onLeave }) => {
  //   const { localParticipant } = useLocalParticipant();
  //   const tracks = useTracks([Track.Source.Camera]);

  //   const toggleCamera = async () => {
  //     if (localParticipant) {
  //       await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  //     }
  //   };

  //   const toggleMic = async () => {
  //     if (localParticipant) {
  //       await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  //     }
  //   };

  //   return (
  //     <View style={styles.container}>
  //       {/* Grid container */}
  //       <View style={styles.gridContainer}>
  //         {tracks.slice(0, 4).map((item, index) => (
  //           <ParticipantTile key={index} item={item} />
  //         ))}
  //       </View>

  //       {/* Controls */}
  //       <View style={styles.controlsContainer}>
  //         <Button
  //           title={localParticipant?.isCameraEnabled ? "📹" : "📸"}
  //           onPress={toggleCamera}
  //         />
  //         <Button
  //           title={localParticipant?.isMicrophoneEnabled ? "🎤" : "🔇"}
  //           onPress={toggleMic}
  //         />
  //         <Button
  //           title="Leave Room"
  //           onPress={onLeave}
  //           color="red"
  //         />
  //       </View>
  //     </View>
  //   );
  // };



  // const RoomView: React.FC<RoomViewProps> = ({ onLeave }) => {
  //   const { localParticipant } = useLocalParticipant();
  //   const tracks = useTracks([Track.Source.Camera]);

  //   const toggleCamera = async () => {
  //     if (localParticipant) {
  //       await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  //     }
  //   };

  //   const toggleMic = async () => {
  //     if (localParticipant) {
  //       await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  //     }
  //   };

  //   const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({ item }) => {
  //     return <ParticipantTile item={item} />;
  //   };

  //   return (
  //     <View style={styles.container}>
  //       <FlatList
  //         data={tracks}
  //         renderItem={renderTrack}
  //         contentContainerStyle={styles.flatListContainer}
  //         keyExtractor={(item) => item.participant.identity + (item.source || 'placeholder')}
  //       />
  //       <View style={styles.controlsContainer}>
  //         <Button
  //           title={localParticipant?.isCameraEnabled ? "📹" : "📸"}
  //           onPress={toggleCamera}
  //         />
  //         <Button
  //           title={localParticipant?.isMicrophoneEnabled ? "🎤" : "🔇"}
  //           onPress={toggleMic}
  //         />
  //         <Button
  //           title="Leave Room"
  //           onPress={onLeave}
  //           color="red"
  //         />
  //       </View>
  //     </View>
  //   );
  // };



