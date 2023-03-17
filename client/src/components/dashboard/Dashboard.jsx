// import React, {useEffect, useState, useCallback} from "react";
// import { logoutUser } from "../../actions/authActions";
// import { useSelector, useDispatch } from 'react-redux';
// import { usePlaidLink} from 'react-plaid-link';
// import { getAccounts, addAccount } from "../../actions/accountActions";
// import Accounts from './Accounts'

// const Dashboard = () => {
//   const [linkToken, setLinkToken] = useState(null);

//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { accounts, accountsLoading } = useSelector((state) => state.plaid);

 
  

  
//   // Logout
//   const onLogoutClick = (e) => {
//     e.preventDefault();
//     dispatch(logoutUser());
//   };

//   //Add account
//   const handleOnSuccess = (token, metadata) => {
//     const plaidData = {
//       public_token: token,
//       metadata: metadata,
//     };
//     dispatch(addAccount(plaidData));
//   };

//   // Initialize the Plaid Link instance
//   const { open, ready, error } = usePlaidLink({
//     token: linkToken,
//     onSuccess: handleOnSuccess,
//   });

//   // Handle the Plaid Link button click
//   const handleClick = () => {
//     if (linkToken) {
//       open();
//     } else {
//       console.log('Link token not available');
//     }
//   };


//   useEffect(() => {
//     dispatch(getAccounts());
//   }, []);


//   let dashboardContent;
//   if (accounts === null || accountsLoading) {
//     dashboardContent = <p className="center-align">Loading...</p>;
//   } else if (accounts.length > 0) {
//     // User has accounts linked
//     dashboardContent = <Accounts user={user} accounts={accounts} />;
//   } else {
//     // User has no accounts linked
//     dashboardContent = (
//       <div className="row">
//         <div className="col s12 center-align">
//           <h4>
//             <b>Welcome,</b> {user.name.split(" ")[0]}
//           </h4>
//           <p className="flow-text grey-text text-darken-1">
//             To get started, link your first bank account below
//           </p>
//           <div>
      
//           <button onClick={handleClick} disabled={!ready || error}>
//       Connect Bank Account
//     </button>
//           </div>
//           <button
//             onClick={onLogoutClick}
//             className="btn btn-large waves-effect waves-light hoverable red accent-3 main-btn"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container">{dashboardContent}</div>
//   );
// };



// export default Dashboard;
