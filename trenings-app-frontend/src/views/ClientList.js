import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import Navigation from '../components/Navigation/Navigation';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/workouts/clients`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients", error);
      }
    };
    fetchClients();
  }, []);

  const handleDeleteClient = async (clientId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Oppdater klientlisten ved å fjerne den slettede klienten
      setClients(clients.filter((client) => client.id !== clientId));
    } catch (error) {
      console.error("Error deleting client", error);
    }
  };

  return (
        
    
    <Container sx={{ mt: 15 }}>
        <Navigation />
        <Typography variant="h4" gutterBottom>
        Your Clients
      </Typography>
      <List>
        {clients.map((client) => (
          <ListItem key={client.id} sx={{ display: "flex", justifyContent: "space-between" }}>
            <ListItemText primary={`${client.firstName} ${client.lastName}`} />
            <Box>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClient(client.id)}
              >
                Delete
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ClientList;
