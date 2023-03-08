import axios from "axios";
import setAuthToken from "../utils/setAuthToken"
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from './types'


//Register a user

export const registerUser = userData => dispatch => {
    const navigate = useNavigate();

    axios.post("/api/users/register", userData)
    .then(res => navigate("/login"))
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
}

// Login

export const loginUser = userData => dispatch => {
    const navigate = useNavigate();

    axios
    .post("/api/users/login", userData)
    .then(res => {
        const {token} = res.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);

        const decoded = jwt_decode(token);

        dispatch(setCurrentUser(decoded));
    }).catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
}

// Set Logged in user

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Loading user

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    }
}

// Log a user out

export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}))
}