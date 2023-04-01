
import {  PlaidLink, usePlaidLink } from 'react-plaid-link';
import {
    getTransactions,
    deleteAccount
} from "../../actions/accountActions"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { logoutUser } from "../../actions/authActions";
import MaterialReactTable from "material-react-table";



const Accounts = ({user , accounts, publicToken, onSuccess}) => {
  const dispatch = useDispatch();
  const { transactions, transactionsLoading } = useSelector(state => state.plaid);

  useEffect(() => {
    dispatch(getTransactions(accounts));
  }, [dispatch, accounts]);

 // Add account
//  const handleOnSuccess = (token, metadata) => {
//       const plaidData = {
//         public_token: token,
//         metadata: metadata,
//         accounts: accounts
//       };

//       dispatch(addAccount(plaidData));
//     };
 
  
  // Delete account
  const onDeleteClick = id => {
    const accountData = {
      id: id,
      accounts: accounts
    };
    dispatch(deleteAccount(accountData));
  };

   // Logout
   const onLogoutClick = e => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  const plaidLinkProps = {
    clientName: 'TrackIt',
    env: 'sandbox',
    product: ['auth', 'transactions'],
    publicKey: publicToken,
    onSuccess: onSuccess,
   
  }

  const { open, ready } = usePlaidLink(plaidLinkProps);


  let accountItems = accounts.map(account => (
    <li key={account._id} style={{ marginTop: "1rem" }}>
      <button
        style={{ marginRight: "1rem" }}
        onClick={() => onDeleteClick(account._id)}
        className="btn btn-small btn-floating waves-effect waves-light hoverable red accent-3"
      >
        <i className="material-icons">delete</i>
      </button>
      <b>{account.institutionName}</b>
    </li>
  ));

  // Setting up data table
  const transactionsColumns = [
    {title: "Account", header: "Account", accessorKey: "account" },
    { title: "Date", header: "Date", accessorKey: "date", type: "date", defaultSort: "desc" },
    { title: "Name", header: "Name", accessorKey: "name" },
    { title: "Amount", header: "Amount", accessorKey: "amount", type: "numeric" },
    { title: "Category", header: "Category", accessorKey: "category" }
  ];
  

let transactionsData = [];

if (transactions && Array.isArray(transactions)) {
  transactions.forEach(account => {
    if (account && account.transactions && Array.isArray(account.transactions)) {
      account.transactions.forEach(transaction => {
        if (transaction) {
          transactionsData.push({
            account: account.accountName,
            date: transaction.date,
            category: transaction.category && transaction.category.length > 0 ? transaction.category[0] : '',
            name: transaction.name,
            amount: transaction.amount
          });
        }
      });
    }
  });
}




  return (
    <div className="row">
      <div className="col s12">
        <button
          onClick={onLogoutClick}
          className="btn-flat waves-effect"
        >
          <i className="material-icons left">keyboard_backspace</i> Log Out
        </button>
        <h4>
          <b>Welcome!</b>
        </h4>
        <p className="grey-text text-darken-1">
          Hey there, {user.name.split(" ")[0]}
        </p>
        <h5>
          <b>Linked Accounts</b>
        </h5>
        <p className="grey-text text-darken-1">
          Add or remove your bank accounts below
        </p>
        <ul>{accountItems}</ul>
        <PlaidLink {...plaidLinkProps}>
            <button onClick={() => open()
        } disabled={!ready}>
        <strong>Add account</strong>
      </button>
      </PlaidLink>
        <hr style={{ marginTop: "2rem", opacity: ".2" }} />
        <h5>
          <b>Transactions</b>
        </h5>
        {transactionsLoading ? (
          <p className="grey-text text-darken-1">Fetching transactions...</p>
        ) : (
          <>
            <p className="grey-text text-darken-1">
              You have <b>{transactionsData.length}</b> transactions from your
              <b> {accounts.length}</b> linked
              {accounts.length > 1 ? (
                <span> accounts </span>
              ) : (
                <span> account </span>
              )}
              from the past 30 days
            </p>
            <MaterialReactTable
              columns={transactionsColumns}
              data={transactionsData}
              title="Search Transactions"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Accounts


