import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { getToken } from "../util/storage";

export const useUser = () => {
    const { user, setUser, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        // No JWT token → clear any stale user state and go to login
        const token = getToken();
        if (!token) {
            clearUser();
            navigate("/login");
            return;
        }

        // Token present + user already in context → nothing to do
        if (user) return;

        // Token present but user context is empty → fetch profile
        let isMounted = true;
        const fetchUserInfo = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
                if (isMounted && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log("Failed to fetch user info:", error);
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();
        return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, clearUser, navigate]);
};