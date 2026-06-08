import axios from "axios";

const BASE_URL = "https://feast-fete.onrender.com/api/auth";

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