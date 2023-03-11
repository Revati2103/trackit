import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

const Dashboard = ({ auth: { user }, logoutUser }) => {

  const onLogoutClick = (e) => {
    e.preventDefault();
    logoutUser();
  };

  return (
    <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div className="row">
        <div className="col s12 center-align">
          <h4>
            <b>Hi,</b> {user.name.split(" ")[0]}
            <p className="flow-text grey-text text-darken-1">
              You are logged into {" "}
              <span style={{ fontFamily: "monospace" }}>TrackIt</span> app 👏
            </p>
          </h4>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem",
            }}
            onClick={onLogoutClick}
            className="btn btn-large waves-effect waves-light hoverable teal accent-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
