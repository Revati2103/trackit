import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {  getAccounts } from "../../actions/accountActions";
import Accounts from "./Accounts";
import Spinner from "./Spinner";
import { usePlaid } from "../../hooks/usePlaidToken";
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps,tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';


const Dashboard = () => {

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow arrowPlacement="right" />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));


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

            {/* <Tooltip title="Choose any bank and use the following credentials: username: user_good password: pass_good Mobile code: 1234">
            <button style={{marginTop: '40px' , backgroundColor: 'teal'}} onClick={() => open()
        } disabled={!ready} 
        >
        <strong>Link account</strong>
      </button>
      </Tooltip> */}

<HtmlTooltip
  title={
    <React.Fragment>
      <Typography color="inherit" sx={{ fontWeight: 'bold' }}>Choose any bank and use the following credentials:</Typography>
      <Typography color="inherit"><strong>Username:</strong> user_good</Typography>
      <Typography color="inherit"><strong>Password:</strong> pass_good</Typography>
      <Typography color="inherit"><strong>Mobile code:</strong> 1234</Typography>
    </React.Fragment>
  }
  arrow
  placement="right"
>
  <button style={{marginTop: '40px' , backgroundColor: 'teal'}} onClick={() => open()} disabled={!ready}>
    <strong>Link account</strong>
  </button>
</HtmlTooltip>

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