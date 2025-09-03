// src/auth/CognitoRedirect.jsx
import { useEffect } from "react";

export default function CognitoRedirect() {
  useEffect(() => {
    window.location.href =
      "https://us-east-1pcvcgdetm.auth.us-east-1.amazoncognito.com/login?client_id=5ve8nr867esvsm2eajeplflb2e&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fdashboard";
  }, []);

  return <>
  <h1>Redirecting...</h1>
  <p>If you are not redirected automatically, follow <a href="https://us-east-1pcvcgdetm.auth.us-east-1.amazoncognito.com/login?client_id=5ve8nr867esvsm2eajeplflb2e&redirect_uri=http://localhost:5173/dashboard&response_type=code&scope=email+openid+phone">this link</a>.</p>
  </>; // or a spinner if you like
}
