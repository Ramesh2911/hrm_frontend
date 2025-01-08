import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (location.pathname.startsWith("/reset-password")) return;

        if (!token) {
            navigate("/");
            return;
        }

        // Check if the token is still valid here...
        // const checkTokenValidity = () => {
        //     var t = localStorage.getItem("token_expired_on").split(/[- :]/);
        //     var dt1 = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        //     var dt2 = new Date();

        //     var diff = (dt1.getTime() - dt2.getTime()) / 1000;
        //     diff /= 60;
        //     var td = Math.round(diff);
        //     if (td < 0) {
        //         return false;
        //     }
        //     else {
        //         return true;
        //     }
        // };

        const checkTokenValidity = () => {
            var tokenExpiredOn = localStorage.getItem("token_expired_on");
            if (tokenExpiredOn) {
                var t = tokenExpiredOn.split(/[- :]/);
                var dt1 = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                var dt2 = new Date();

                var diff = (dt1.getTime() - dt2.getTime()) / 1000;
                diff /= 60;
                var td = Math.round(diff);
                if (td < 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };

        const isTokenValid = checkTokenValidity(token);

        if (!isTokenValid) {
            localStorage.removeItem("token");
            navigate("/");
        }
    }, [navigate]);

    // Return any data that you want to make available to your components
    return {
        isAuthenticated: !!localStorage.getItem("token"),
        // guard: JSON.parse(localStorage.getItem("user")),
    };
}

export default useAuth;