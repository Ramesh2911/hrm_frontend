import axios from "axios";

function destroyToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expired_on");
    localStorage.removeItem("user");
    localStorage.removeItem("center");
}

export const refresh = (error) => {
    return new Promise((resolve, reject) => {
        error.response.config.headers["token"] = localStorage.getItem("token");
        axios(error.response.config).then(function (res) {
            return resolve(res);
        }).catch((error) => {
            destroyToken();
            window.location.replace("/");
            return reject(error);
        });
    });
};