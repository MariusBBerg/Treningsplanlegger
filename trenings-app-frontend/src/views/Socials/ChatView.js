import React from "react";
import { Container } from "@mui/material";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer";
import ChatRoom from "../../components/Social/ChatRoom";


const ChatView = () => {
    return (
        <div className="theme-bg min-h-screen flex flex-col">
            <Navigation />
                        <Container sx={{ mt: 10,}}>
                            <ChatRoom />
                            </Container>
                            <Footer />

        </div>
    );
}
export default ChatView;