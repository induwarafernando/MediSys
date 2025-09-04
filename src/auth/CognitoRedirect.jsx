// src/auth/CognitoRedirect.jsx
import { useEffect, useState } from "react";
import { Stethoscope, Hospital } from "lucide-react"; // medical-themed icons

export default function CognitoRedirect() {
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setProcessing(false);
      return;
    }

    const currentUrl = window.location.href;
    let clientId = "";
    let redirectUri = "";
    let tokenEndpoint = "";

    if (currentUrl.includes("/internal")) {
      clientId = "61hi982s20u919b8iij70i2d97"; // Internal Staff app client id
      redirectUri = "http://localhost:5173/internal";
      tokenEndpoint =
        "https://us-east-1bvf8difqt.auth.us-east-1.amazoncognito.com/oauth2/token";
    } else {
      clientId = "8q03mmehccquenkhikjog75it"; // Clinic app client id
      redirectUri = "http://localhost:5173/dashboard/";
      tokenEndpoint =
        "https://us-east-1gdpinciim.auth.us-east-1.amazoncognito.com/oauth2/token";
    }

    fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code,
        redirect_uri: redirectUri,
      }),
    })
      .then((res) => res.json())
      .then((tokens) => {
        const idToken = tokens.id_token;
        if (!idToken) {
          console.error("❌ No id_token received");
          setProcessing(false);
          return;
        }

        const payload = JSON.parse(atob(idToken.split(".")[1]));
        const role = payload["cognito:groups"]?.[0] || "clinic_user";

        localStorage.setItem("idToken", idToken);
        localStorage.setItem("role", role);

        if (role === "internal_staff") {
          window.location.href = "/internal";
        } else {
          window.location.href = "/dashboard";
        }
      })
      .catch((err) => {
        console.error("Token exchange failed", err);
        setProcessing(false);
      });
  }, []);

  if (processing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <Hospital className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-700">
            Processing login…
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we securely connect you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        <div className="flex flex-col items-center mb-6">
          <Stethoscope className="w-12 h-12 text-green-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">MediSys Portal</h1>
          <p className="text-gray-500 text-sm mt-2">
            Secure access for clinics & internal staff
          </p>
        </div>

        <div className="space-y-4">
          <button
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => {
              window.location.href =
                "https://us-east-1gdpinciim.auth.us-east-1.amazoncognito.com/login?client_id=8q03mmehccquenkhikjog75it&redirect_uri=http://localhost:5173/dashboard/&response_type=code&scope=email+openid+phone";
            }}
          >
            Login as Clinic User
          </button>

          <button
            className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
            onClick={() => {
              window.location.href =
                "https://us-east-1bvf8difqt.auth.us-east-1.amazoncognito.com/login?client_id=61hi982s20u919b8iij70i2d97&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:5173/internal";
            }}
          >
            Login as Internal Staff
          </button>
        </div>
      </div>
    </div>
  );
}
