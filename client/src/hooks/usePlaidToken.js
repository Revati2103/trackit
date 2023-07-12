import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { addAccount } from "../../src/actions/accountActions";
import { useDispatch } from "react-redux";
import { usePlaidLink } from "react-plaid-link";


axios.defaults.headers.post['Content-Type'] = 'application/json';
export const usePlaid = () => {

    const dispatch = useDispatch();
  
    const [token, setToken] = useState(null);
  
    const onSuccess = useCallback(async (publicToken, metadata) => {
      const plaidData = {
        public_token: publicToken,
        metadata: metadata,
      };
      axios
        .post(
          `/api/exchange_public_token`,
          JSON.stringify({ public_token: publicToken, metadata }),
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Res", res);
          JSON.stringify(res.data);
          plaidData.accessToken = res.data.access_token;
          plaidData.item_id = res.data.item_id;
          dispatch(addAccount(plaidData));
        })
        .catch((err) => {
          console.log(err);
        });
    }, [dispatch]);
  
    const createLinkToken = useCallback(async () => {
      // For OAuth, use previously generated Link token
      if (window.location.href.includes("?oauth_state_id=")) {
        const linkToken = localStorage.getItem("link_token");
        setToken(linkToken);
      } else {
        axios
          .get(`/api/create_link_token`)
          .then((res) => {
            console.log("Create token res", res);
            JSON.stringify(res.data);
            setToken(res.data.link_token);
            localStorage.setItem("link_token", res.data.link_token);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, [setToken]);
  
    let isOauth = false;
  
    const config = {
      token,
      onSuccess,
    };
  
    // For OAuth, configure the received redirect URI
    if (window.location.href.includes("?oauth_state_id=")) {
      config.receivedRedirectUri = window.location.href;
      isOauth = true;
    }
  
    const { open, ready } = usePlaidLink(config);
  
    useEffect(() => {
      if (token == null) {
        createLinkToken();
      }
      if (isOauth && ready) {
        open();
      }
    }, [token, isOauth, ready, open]);
  
    return {
      token,
      setToken,
      ready,
      open,
      onSuccess,
      config
    };
  };
  
