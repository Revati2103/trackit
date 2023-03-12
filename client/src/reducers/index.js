import {combineReducers} from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import accountReducer from "./accountReducers";

 const rootReducer = combineReducers ({
    auth: authReducer,
    errors: errorReducer,
    plaid: accountReducer
})

export default rootReducer;