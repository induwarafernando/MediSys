// src/auth/CognitoRedirect.jsx
import { useEffect } from "react";

export default function CognitoRedirect() {
  useEffect(() => {
    window.location.href =
      "https://us-east-1wsdpinif9.auth.us-east-1.amazoncognito.com/login?client_id=17io65mc4753i4f92b5tcek6mt&redirect_uri=http://localhost:5173/dashboard&response_type=code&scope=email+openid+phone";
  }, []);

  return <>
  <h1>Redirecting...</h1>
  <p>If you are not redirected automatically, follow <a href="https://us-east-1wsdpinif9.auth.us-east-1.amazoncognito.com/login?client_id=17io65mc4753i4f92b5tcek6mt&redirect_uri=http://localhost:5173/dashboard&response_type=code&scope=email+openid+phone">this link</a>.</p>
  </>; // or a spinner if you like
}
