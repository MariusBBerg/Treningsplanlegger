import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import ChatIcon from "@mui/icons-material/Chat";
import Fab from "@mui/material/Fab";
import ChatRoom from "./ChatRoom";


const ChatIconButton = () => {
    const [chatOpen, setChatOpen] = useState(false);


    return(        
    <>
    <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setChatOpen(true)}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <ChatIcon />
      </Fab>
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      >
        
        <ChatRoom />
      </Drawer>
      </>)
}
export default ChatIconButton;