import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlaidLink} from 'react-plaid-link';
import { logoutUser } from "../../actions/authActions";
import {  getAccounts, addAccount } from "../../actions/accountActions";
import Accounts from "./Accounts";
import Spinner from "./Spinner";
import axios from "axios";



const Dashboard2 = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { accounts, accountsLoading } = useSelector((state) => state.plaid);
  const [token, setToken] = useState(null);
  const [publicToken, setPublicToken] = useState(null);

  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

//   const onSuccess = useCallback(async (publicToken, metadata) => {
//     const plaidData = {
//       public_token: publicToken,
//       metadata: metadata,
//     };

//     try {
//       const response = await fetch("/api/exchange_public_token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//        body: JSON.stringify({ public_token: publicToken}),
   
       
//       });
//       //console.log(response);
// const data = await response.json();
// console.log({data: data.access_token});
// // Update the public token state variable
// setPublicToken(publicToken);

//       dispatch(addAccount(plaidData));
//     } catch (error) {
//       console.log(error);
//     }
//   }, [dispatch]);


const onSuccess = useCallback(async (publicToken, metadata) => {
  const plaidData = {
    public_token: publicToken,
    metadata: metadata,
  };
axios
.post("/api/exchange_public_token", {public_token: publicToken})
.then((res) => {
  console.log(res.data);
  setPublicToken(publicToken);
  dispatch(addAccount(plaidData));

}).catch(err => {
  console.log(err);
})
  
}, [dispatch]);

  // const createLinkToken = useCallback (async () => {
  //   // For OAuth, use previously generated Link token
  //   if (window.location.href.includes("?oauth_state_id=")) {
  //     const linkToken = localStorage.getItem('link_token');
  //     setToken(linkToken);
  //   } else {
  //     try{
  //       const response = await fetch("/api/create_link_token", {});
  //       const data = await response.json();
  //       setToken(data.link_token);
       
  //       localStorage.setItem("link_token", data.link_token);

  //     }catch (error) {
  //     console.log(error);
  //   }
      
  //   }
  // }, [setToken]);


  const createLinkToken = useCallback (async () => {
    // For OAuth, use previously generated Link token
    if (window.location.href.includes("?oauth_state_id=")) {
      const linkToken = localStorage.getItem('link_token');
      setToken(linkToken);
    } else {

      axios
      .get("/api/create_link_token")
      .then((res) => {
          setToken(res.data.link_token);
          localStorage.setItem("link_token", res.data.link_token);
      }).catch(err => {
          console.log(err);
      })
      
    }
  }, [setToken]);

  
  
  



  

  let isOauth = false;

  const config = {
    token,
    onSuccess,
  };

  // For OAuth, configure the received redirect URI
  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (token == null) {
      createLinkToken();
    }
    if (isOauth && ready) {
      open();
    }
  }, [token, isOauth, ready, open]);



  const onLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

 



  let dashboardContent;

  if (accounts === null || accountsLoading) {
    dashboardContent = <Spinner />;
  } else if (accounts.length > 0) {
    //dashboardContent = <Accounts />;
    dashboardContent = <Accounts user={user} accounts={accounts} publicToken={publicToken}/>;
  } else {
    dashboardContent = (
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Welcome,</b> {user.name.split(" ")[0]}
            </h4>
            <p className="flow-text grey-text text-darken-1">
              To get started, link your first bank account below
            </p>
            <div>
        
            <button style={{marginTop: '40px' }} onClick={() => open()
        } disabled={!ready}>
        <strong>Link account</strong>
      </button>
            </div>
            <button
              onClick={onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable red accent-3 main-btn"
            >
              Logout
            </button>
          </div>
        </div>
      );
  }

  return <div className="container">{dashboardContent}</div>;
};



export default Dashboard2;