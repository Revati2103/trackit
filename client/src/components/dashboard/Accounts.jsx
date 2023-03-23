import { PlaidLink } from 'react-plaid-link';
import {
    getTransactions,
    addAccount,
    deleteAccount
} from "../../actions/accountActions"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { logoutUser } from "../../actions/authActions";
import MaterialReactTable from "material-react-table";



const Accounts = ({user , accounts, publicToken}) => {
  const dispatch = useDispatch();
  const { transactions, transactionsLoading } = useSelector(state => state.plaid);

  useEffect(() => {
    dispatch(getTransactions(accounts));
  }, [dispatch, accounts]);

  // Add account
  const handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: publicToken,
      metadata: metadata,
      accounts: accounts
    };
    dispatch(addAccount(plaidData));
  };

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
    { title: "Account", field: "account" },
    { title: "Date", field: "date", type: "date", defaultSort: "desc" },
    { title: "Name", field: "name" },
    { title: "Amount", field: "amount", type: "numeric" },
    { title: "Category", field: "category" }
  ];

  let transactionsData = [];
  transactions.forEach(function(account) {
    account.transactions.forEach(function(transaction) {
      transactionsData.push({
        account: account.accountName,
        date: transaction.date,
        category: transaction.category[0],
        name: transaction.name,
        amount: transaction.amount
      });
    });
  });



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
        <PlaidLink
          buttonProps={{
            className:
              "btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn"
          }}
          plaidLinkProps={{
            clientName: "TrackIt",
            key: publicToken,
            env: "sandbox",
            product: ["transactions"],
            onSuccess: handleOnSuccess
          }}
          onScriptLoad={() => this.setState({ loaded: true })}
        >
          Add Account
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


