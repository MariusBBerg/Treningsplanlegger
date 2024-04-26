import React from "react";
import axios from "axios";
import { API_URL } from "../../utils/api_url";
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;

const revokeGoogleAccess = () => {
    axios
    .post(
      API_URL + "api/google-calendar/revoke",
      {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    )
    .then((response) => {
      console.log(response.data);
      user.isGoogleAuthenticated = false;
      localStorage.setItem('user', JSON.stringify(user)); 
    })
    .catch((error) => {
      console.error("Error revoking Google access", error);
      alert("Failed to revoke Google access");
    });
  };


export default revokeGoogleAccess;
