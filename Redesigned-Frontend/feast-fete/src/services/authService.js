import axios from "axios";

const BASE_URL = "http://localhost:8081/api/auth";

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