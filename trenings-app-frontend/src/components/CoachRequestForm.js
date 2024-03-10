import React, { useState, useEffect } from "react";
import axios from "axios";

const CoachRequestForm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        fetchRequests();
    }, []);

    const searchUsers = async (searchTerm) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/search`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    query: searchTerm,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error searching users', error);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            searchUsers(searchTerm);
        } else {
            setUsers([]);
        }
    }, [searchTerm]);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/coach-requests/user/${user.id}/requests`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setRequests(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching requests", error);
        }
    };

    const sendRequest = async (userId) => {
        try {
            await axios.post(
                `http://localhost:8080/api/coach-requests/user/${user.id}/request/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            fetchRequests();
        } catch (error) {
            console.error("Error sending request", error);
        }
    };

    const respondToRequest = async (requestId, response) => {
        try {
            await axios.post(
                `http://localhost:8080/api/coach-requests/request/${requestId}/response`,
                response,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            fetchRequests();
        } catch (error) {
            console.error("Error responding to request", error);
        }
    };

    return (
        <div>
            <h1>Coach Requests</h1>
            <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {users.map((user) => (
                <div key={user.id}>
                    <p>{user.firstName}</p>
                    <button onClick={() => sendRequest(user.id)}>Send Request</button>
                </div>
            ))}
            {requests.map((request) => (
                <div key={request.id}>
                    <p>
                        {request.requester && request.requester.firstName} to{" "}
                        {request.requested && request.requested.firstName}
                    </p>
                    <button onClick={() => respondToRequest(request.id, "Accepted")}>
                        Accept
                    </button>
                    <button onClick={() => respondToRequest(request.id, "Rejected")}>
                        Reject
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CoachRequestForm;