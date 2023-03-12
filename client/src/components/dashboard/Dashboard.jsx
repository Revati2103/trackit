import React, {useEffect} from "react";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";
import { useSelector, useDispatch } from 'react-redux';
import { PlaidLink } from 'react-plaid-link';
import { getAccounts, addAccount } from "../../actions/accountActions";
import Accounts from './Accounts'


const Dashboard = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAccounts());
  }, []);

  const { user } = useSelector((state) => state.auth);
  const { accounts, accountsLoading } = useSelector((state) => state.plaid);

  // Logout
  const onLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  // Add account
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
            <PlaidLink
              buttonProps={{
                className:
                  "btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn",
              }}
              plaidLinkProps={{
                clientName: "YOUR_APP_NAME",
                key: "YOUR_PLAID_PUBLIC_KEY",
                env: "sandbox",
                product: ["transactions"],
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

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getAccounts: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  plaid: PropTypes.object.isRequired
};


export default Dashboard;
