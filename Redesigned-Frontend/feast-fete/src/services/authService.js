import axios from "axios";

const API1 = import.meta.env.VITE_AUTH_URL;
const BASE_URL = `${API1}/api/auth`;

export const loginUser = async (data) => {

    return await axios.post(
        `${BASE_URL}/login`,
        data
    );
};

export const registerUser = async (data) => {

    return await axios.post(
        `${BASE_URL}/register`,
        data
    );
};