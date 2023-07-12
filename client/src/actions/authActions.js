import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";

export const registerUser = (userData) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_API_URL}/api/users/register`, userData)
    .then((res) => {
      const navigate = useNavigate();
      navigate("/login");
    })
    .catch(err => {
        if (err.response) {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        } else {
            console.log(err);
        }
    });
};

export const loginUser = (userData) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_API_URL}/api/users/login`, userData)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      const navigate = useNavigate();
      navigate("/dashboard");
    })
    .catch(err => {
      if (err.response) {
          dispatch({
              type: GET_ERRORS,
              payload: err.response.data
          });
      } else {
          console.log(err);
      }
  });
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
