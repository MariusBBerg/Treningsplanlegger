import React, { useEffect, useState, useRef } from "react";
import { over } from "stompjs";
import axios from "axios";
import SockJS from "sockjs-client";
import { API_URL } from "../../utils/api_url";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { grey } from "@mui/material/colors";

let stompClient = null;
const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [friends, setFriends] = useState([]);
  const [privateChats, setPrivateChats] = useState(new Map());

  useEffect(() => {
    fetchFriends();
    connect();

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
        console.log("Disconnected on component unmount");
      }
    };
  }, []);
  useEffect(() => {
    if (receiver) {
      fetchMessages(receiver.id);
    }
  }, [receiver]);

  const fetchFriends = async () => {
    const response = await axios.get(`${API_URL}api/users/me/friends`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setFriends(response.data);
    if (!receiver && response.data.length > 0) {
        setReceiver(response.data[0]);
      }
    
  };

  const fetchMessages = async (receiverId) => {
    try {
      const response = await axios.get(`${API_URL}messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const messages = response.data;
      console.log(messages);
      setPrivateChats((prevChats) => {
        const newChats = new Map(prevChats);
        newChats.set(receiver.login, messages);
        return newChats;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const connect = () => {
    if (!stompClient) {
      const sock = new SockJS(`${API_URL}ws`);
      stompClient = over(sock);
      stompClient.connect({}, onConnected, onError);
    }
  };

  const onConnected = () => {
    console.log("Connected");
    stompClient.subscribe(
      `/user/${user.login}/private`,
      onPrivateMessageReceived
    );
  };

  const onPrivateMessageReceived = (payload) => {
    const payloadBody = JSON.parse(payload.body);
    setPrivateChats((prevChats) => {
      const newChats = new Map(prevChats);
      const messages = newChats.get(payloadBody.sender.login) || [];
      messages.push(payloadBody);
      newChats.set(payloadBody.sender.login, messages);
      return newChats;
    });
  };

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  const sendPrivateMessage = () => {
    if (stompClient && receiver) {
      const chatMessage = {
        sender: user,
        receiver: receiver,
        date: new Date(),
        message: message,
      };

      stompClient.send(`/app/private-message`, {}, JSON.stringify(chatMessage));

      setPrivateChats((prevChats) => {
        const newChats = new Map(prevChats);
        const messages = newChats.get(receiver.login) || [];
        messages.push(chatMessage);
        newChats.set(receiver.login, messages);
        return newChats;
      });

      setMessage("");
    }
  };

  const onError = (error) => {
    console.error("Connection error", error);
  };

  return (
    <Box sx={{ display: "flex", height: "80vh", backgroundColor: grey[100] }}>
      <Box sx={{ width: "30%", borderRight: `1px solid ${grey[300]}` }}>
        <Typography variant="h6" sx={{ my: 2, mx: 2 }}>
          Chats
        </Typography>
        <List>
          {friends.map((friend) => (
            <ListItem
              button
              key={friend.login}
              onClick={() => setReceiver(friend)}
              style={{
                backgroundColor:
                  receiver === friend ? "lightgray" : "transparent",
              }}
            >
              <ListItemAvatar>
                <Avatar>{friend.login[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={friend.login} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: "70%", display: "flex", flexDirection: "column" }}>
        <Paper sx={{ flex: 1, overflow: "auto", m: 2, p: 2 }}>
          {privateChats.get(receiver?.login)?.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender.login === user.login
                    ? "flex-end"
                    : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                sx={{
                  p: 1,
                  bgcolor:
                    message.sender.login === user.login
                      ? "primary.main"
                      : grey[300],
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "text.secondary" }}
                >
                  {message.sender.login}
                </Typography>
                <Typography variant="body2">{message.message}</Typography>
              </Paper>
            </Box>
          ))}
        </Paper>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderTop: `1px solid ${grey[300]}`,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={handleMessage}
            sx={{ mr: 1 }}
          />
          <Button variant="contained" onClick={sendPrivateMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatRoom;
