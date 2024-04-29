import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Avatar,
  TextField,
  List,
  Typography,
  Card,
  CardContent,
  CardActions,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "../../utils/api_url";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer";
import Grid from "@mui/material/Grid";
import ChatIcon from "../../components/Social/ChatIconButton";



const FriendsView = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [showModal, setShowModal] = useState(false);
  const [friendsPerPage, setFriendsPerPage] = useState(3); // Initial value is 3
  const [currentPage, setCurrentPage] = useState(1);
  const [friendSearchTerm, setFriendSearchTerm] = useState("");

  const [currentSearchPage, setCurrentSearchPage] = useState(1); // Initial value is 1
  const [searchUsersPage, setSearchUsersPage] = useState(3);

  const searchUsers = async (searchTerm) => {
    try {
      const response = await axios.get(API_URL + `api/users/search`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          query: searchTerm,
        },
      });
      const filteredUsers = response.data.filter(
        (user) =>
          !friends.some((friend) => friend.login === user.login) &&
          !requests.some((request) => request.sender.login === user.login)
      );

      setUsers(filteredUsers);
      console.log(filteredUsers);
    } catch (error) {
      console.error("Error searching users", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      searchUsers(searchTerm);
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(API_URL + "api/users/me/friends", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
    getFriendRequests();
  }, []);

  const handleAccept = (requestId) => {
    axios
      .post(
        API_URL + `api/friend-requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        setRequests(requests.filter((request) => request.id !== requestId));
        fetchFriends();
      })
      .catch((error) => {
        console.error("Error accepting friend request:", error);
      });
  };

  const handleReject = (requestId) => {
    axios
      .put(
        API_URL + `api/friend-requests/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        setRequests(requests.filter((request) => request.id !== requestId));
        fetchFriends();
      })

      .catch((error) => {
        console.error("Error rejecting friend request:", error);
      });
  };

  const sendRequest = async (receiverId) => {
    try {
      await axios.post(
        API_URL + `api/friend-requests/${receiverId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Friend request sent successfully");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const getFriendRequests = async () => {
    try {
      const response = await axios.get(
        API_URL + "api/friend-requests/requests",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error getting friend requests:", error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.delete(API_URL + `api/users/me/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFriends(friends.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const totalPages = Math.ceil(friends.length / friendsPerPage);

  const getCurrentFriends = () => {
    const startIdx = (currentPage - 1) * friendsPerPage;
    return friends
      .filter((friend) => friend.login.includes(friendSearchTerm))
      .slice(startIdx, startIdx + friendsPerPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const totalSearchPages = Math.ceil(users.length / searchUsersPage);

  const getCurrentSearchUsers = () => {
    return users.slice(0, currentSearchPage * friendsPerPage);
  };

  const handleNextSearchPage = () => {
    if (currentSearchPage < totalSearchPages) {
      setCurrentSearchPage(currentSearchPage + 1);
    }
  };

  return (
    <div className="theme-bg min-h-screen flex flex-col">
      <Navigation />
      <Container sx={{ mt: 10, mb: 3, flex: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Friends
            </Typography>
            <TextField
              value={friendSearchTerm}
              onChange={(e) => setFriendSearchTerm(e.target.value)}
              label="Search friends"
              variant="outlined"
              fullWidth
            />
            <Card style={{ flex: 1, overflow: "auto", width: "100%" }}>
              <List>
                {getCurrentFriends().map((friend) => (
                  <Card key={friend.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Avatar />
                      <Typography variant="h6" component="h2">
                        {friend.login}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        Remove Friend
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </List>
            </Card>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "auto",
                allignItems: "left",
              }}
            >
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </Button>

              {/* Page indicator */}
              <Typography>
                Page {currentPage} / {totalPages}
              </Typography>

              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              Search Users
            </Typography>

            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search users"
              variant="outlined"
              fullWidth
            />

            {Array.isArray(users) ? (
              getCurrentSearchUsers().map((user) => (
                <Card key={user.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Avatar />
                    <Typography variant="h6" component="h2">
                      {user.firstName}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => sendRequest(user.id)}
                    >
                      Send Friend Request
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No users found</Typography>
            )}
            {users.length > currentSearchPage * searchUsersPage && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNextSearchPage()}
              >
                More...
              </Button>
            )}
            <>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ mt: 5 }}
              >
                Friend Requests
              </Typography>
              <List>
                {requests.slice(0, 2).map((request) => (
                  <Card key={request.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Avatar
                        src={request?.sender?.profilePic || "defaultPic.png"}
                      />
                      <Typography variant="h6" component="h2">
                        {request?.sender?.login || "Unknown"}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => handleAccept(request.id)}>
                        Accept
                      </Button>
                      <Button onClick={() => handleReject(request.id)}>
                        Reject
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </List>

              {requests.length > 2 && (
                <Button variant="contained" color="primary" onClick={openModal}>
                  See More Friend Requests
                </Button>
              )}

              <Dialog
                open={showModal}
                onClose={closeModal}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>Friend Requests</DialogTitle>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={closeModal}
                  aria-label="close"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent>
                  <List>
                    {requests.map(
                      (
                        request // Requests after the first 2
                      ) => (
                        <Card key={request.id} sx={{ mb: 2 }}>
                          <CardContent>
                            <Avatar
                              src={
                                request?.sender?.profilePic || "defaultPic.png"
                              }
                            />
                            <Typography variant="h6" component="h2">
                              {request?.sender?.login || "Unknown"}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button onClick={() => handleAccept(request.id)}>
                              Accept
                            </Button>
                            <Button onClick={() => handleReject(request.id)}>
                              Reject
                            </Button>
                          </CardActions>
                        </Card>
                      )
                    )}
                  </List>
                </DialogContent>
              </Dialog>
            </>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default FriendsView;
