
import axios from "axios";

const setAuthToken = token => {

    //Apply authorization token to requests only if logged in 
    
    if(token){
       axios.defaults.headers.common["Authorization"] = token;   
    }else{
       delete axios.defaults.headers.common["Authorization"]
    }

}

export default setAuthToken;