import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";


dotenv.config();

const app = express();
const port = 3000;


app.use(cors({
  origin: "*", 
}));

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

const livekitHost = process.env.LIVEKIT_URL; 
const client = new RoomServiceClient(livekitHost, apiKey, apiSecret);

let roomsCache = [];

// http://localhost:3000/getToken?room=myroom&user=user1

app.get("/listRooms", async (req, res) => {
  try {
    const rooms = await client.listRooms();
    roomsCache = rooms.map((r) => ({ name: r.name, numParticipants: r.numParticipants || 0 }));
    res.json({ rooms: roomsCache });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});


app.get("/getToken", async(req, res) => {
  const room = req.query.room || "default-room";
  const identity =
    req.query.user || "guest-" + Math.random().toString(36).substring(2, 8);

  try {
    console.log("🔹 Generating token...");
    console.log("   ➡️ Room:", room);
    console.log("   ➡️ Identity:", identity);

    const at = new AccessToken(apiKey, apiSecret, { identity });
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    });

    const jwtArray = await at.toJwt();                 // Uint8Array
    const jwt = Buffer.from(jwtArray).toString(); // convert to string

    console.log("✅ Token generated successfully");
    console.log("🔑 Token (first 60 chars):", jwt.substring(0, 60) + "...");

    res.json({ token: jwt });
  } catch (err) {
    console.error("❌ Exception while creating token:", err);
    res.status(500).json({ error: "Exception during token generation" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Token server running at http://localhost:${port}`);
});
