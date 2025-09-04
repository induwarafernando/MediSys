// src/auth/CognitoRedirect.jsx
import { useEffect } from "react";

export default function CognitoRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Fake login success for demo
      localStorage.setItem("idToken", code); // just store the code
      window.location.href = "/dashboard";  // go straight to dashboard
    } else {
      // No code yet → send user to Cognito hosted login
      window.location.href =
        "https://eu-north-1maorcr1qy.auth.eu-north-1.amazoncognito.com/login?client_id=51oenn82n2rduqhdo7aadibsgt&redirect_uri=http://localhost:5173/dashboard&response_type=code&scope=email+openid+phone";
    }
  }, []);

  return <h1>Redirecting...</h1>;
}
