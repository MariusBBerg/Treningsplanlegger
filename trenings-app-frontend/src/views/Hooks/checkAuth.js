
import axios from "axios";
import { API_URL } from "../../utils/api_url";

const checkAuth = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return;
    }

    const user = JSON.parse(userStr);
    if (!user || !user.token) {
      return;
    }

    try {
      const response = await axios.get(API_URL+'validateToken', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.status === 200) {
        return;
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      localStorage.removeItem('user');
    }
  };

    export default checkAuth;