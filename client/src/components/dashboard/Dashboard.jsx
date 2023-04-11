import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {  getAccounts } from "../../actions/accountActions";
import Accounts from "./Accounts";
import Spinner from "./Spinner";
import { usePlaid } from "../../hooks/usePlaidToken";

const Dashboard = () => {

 const dispatch = useDispatch();
 const { user } = useSelector((state) => state.auth);
 const { accounts, accountsLoading } = useSelector((state) => state.plaid);
 const { ready , open} = usePlaid();

  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

  const onLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

 
  let dashboardContent;

  if (accounts === null || accountsLoading) {
    dashboardContent = <Spinner />;
  } else if (accounts.length > 0) {
    dashboardContent = (
    
          <Accounts user={user} accounts={accounts} />
     
    );
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



export default Dashboard;