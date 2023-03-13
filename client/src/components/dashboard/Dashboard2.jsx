import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {logoutUser} from "../../actions/authActions";
import {getAccounts, addAccount} from "../../actions/accountActions";
import Accounts from './Accounts';

const Dashboard2 = () => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const plaid = useSelector(state => state.plaid);
  
    useEffect(() => {
        dispatch(getAccounts());
      }, [dispatch]);
    
 // Logout
 const onLogoutClick = e => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  // Add account
  const handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata
    };
    dispatch(addAccount(plaidData));
  };

  return (
    <div>
      <h4>
        <b>Welcome,</b> {auth.user.name.split(' ')[0]}
      </h4>
      <button onClick={onLogoutClick}>Logout</button>
      {/* Render your accounts data here */}
    </div>
  );
}

export default Dashboard2