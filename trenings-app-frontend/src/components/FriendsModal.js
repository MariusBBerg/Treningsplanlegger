import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, List, ListItem, ListItemText, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from '../utils/api_url';

const FriendsModal = ({ open, onClose, user }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(API_URL + 'api/users/me/friends', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [user]);

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.delete(API_URL + `api/users/me/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFriends(friends.filter(friend => friend.id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="friends-modal-title"
      aria-describedby="friends-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="friends-modal-title" variant="h6" component="h2">
          Friends
        </Typography>
        <List>
          {friends.map(friend => (
            <ListItem key={friend.id}>
              <ListItemText primary={friend.login} />
              <Button variant="contained" color="secondary" onClick={() => handleRemoveFriend(friend.id)}>
                Remove Friend
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default FriendsModal;