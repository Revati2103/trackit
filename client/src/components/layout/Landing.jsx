import React from "react";
import { Link } from "react-router-dom";
import trackit from '../../img/trackIt.jpg'

const Landing = () => {
  return (
    <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div className="row">
        <div className="col s12 center-align">
          
        <img
              src={trackit}
              style={{ width: "400px" }}
              className="responsive-img banner"
              alt="banner"
            />

          <h4>
            <b>Manage all your expenses at one place</b>
          </h4>
          <p className="flow-text grey-text text-darken-1">
            Get started today! 
          </p>
          <br />
          <div className="col s6">
            <Link
              to="/register"
              style={{
                width: "140px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect waves-light hoverable teal accent-4"
            >
              Register
            </Link>
          </div>
          <div className="col s6">
            <Link
              to="/login"
              style={{
                width: "140px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large btn-flat waves-effect lime black-text"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
