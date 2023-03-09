import React from "react";
import { Route, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';

const PrivateRoute = ({ path, element }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
    return isAuthenticated ? (
      <Route path={path} element={element} />
    ) : (
      <Navigate to="/login" replace />
    );
  };

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
