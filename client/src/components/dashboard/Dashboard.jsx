import React, {useEffect, useState, useCallback} from "react";
import { logoutUser } from "../../actions/authActions";
import { useSelector, useDispatch } from 'react-redux';
import { usePlaidLink, PlaidLink} from 'react-plaid-link';
import { getAccounts, addAccount } from "../../actions/accountActions";
import Accounts from './Accounts'


const Dashboard = () => {

  const dispatch = useDispatch();

  const [publicToken, setPublicToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { accounts, accountsLoading } = useSelector((state) => state.plaid);

  useEffect(() => {
    const fetchPublicToken = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/exchange_public_token", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: process.env.REACT_APP_CLIENT_ID,
          }),
        });
        const { public_token } = await response.json();
        setPublicToken(public_token);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicToken();
  }, []);

  useEffect(() => {
    dispatch(getAccounts());
  }, []);



  // Logout
  const onLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  // const handleOnSuccess = useCallback(async (publicToken) => {
  //   setIsLoading(true);
  //   await fetch("/api/exchange_public_token", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ public_token: publicToken }),
  //   });
   
  // }, []);

  // Creates a Link token
  const createLinkToken = React.useCallback(async () => {
    // For OAuth, use previously generated Link token
    if (window.location.href.includes("?oauth_state_id=")) {
      const linkToken = localStorage.getItem('link_token');
      setPublicToken(linkToken);
    } else {
      const response = await fetch("http://localhost:5000/api/create_link_token", {});
      const data = await response.json();
      setPublicToken(data.link_token);
      localStorage.setItem("link_token", data.link_token);
    }
  }, [setPublicToken]);

  let isOauth = false;

  // const config = {
  //   publicToken,
  //   handleOnSuccess,
  // };
  // if (window.location.href.includes("?oauth_state_id=")) {
  //   config.receivedRedirectUri = window.location.href;
  //   isOauth = true;
  // }
  // const { open, ready } = usePlaidLink(config);

  // useEffect(() => {
  //   if (publicToken == null) {
  //     createLinkToken();
  //   }
  //   if (isOauth && ready) {
  //     open();
  //   }
  // }, [publicToken, isOauth, ready, open]);

  //Add account
  const handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata,
    };
    dispatch(addAccount(plaidData));
  };

  let dashboardContent;
  if (accounts === null || accountsLoading) {
    dashboardContent = <p className="center-align">Loading...</p>;
  } else if (accounts.length > 0) {
    // User has accounts linked
    dashboardContent = <Accounts user={user} accounts={accounts} />;
  } else {
    // User has no accounts linked
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
          {/* {error && <div>{error.message}</div>}
      <Link
        token={publicToken}
        onSuccess={handleOnSuccess} 
      >
        <button onClick={() => open()} disabled={!ready || isLoading}>
          {isLoading ? 'Loading...' : 'Link your bank account'}
        </button>
      </Link> */}

            <PlaidLink
              buttonProps={{
                className:
                  "btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn",
              }}
              plaidLinkProps={{
                clientName: "YOUR_APP_NAME",
                key: publicToken,
                env: "sandbox",
                product: ["transactions", "auth"],
                onSuccess: handleOnSuccess,
              }}
              onScriptLoad={() => this.setState({ loaded: true })}
            >
              Link Account
            </PlaidLink>
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

  return (
    <div className="container">{dashboardContent}</div>
  );
};



export default Dashboard;
