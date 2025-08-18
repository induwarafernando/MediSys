// src/services/cognitoAuth.js
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { jwtDecode } from "jwt-decode";

const REGION   = import.meta.env.VITE_COG_REGION;
const POOL_ID  = import.meta.env.VITE_COG_USER_POOL_ID;
const CLIENT_ID= import.meta.env.VITE_COG_CLIENT_ID;

function cfgOK() {
  const missing = [];
  if (!REGION)    missing.push("VITE_COG_REGION");
  if (!POOL_ID)   missing.push("VITE_COG_USER_POOL_ID");
  if (!CLIENT_ID) missing.push("VITE_COG_CLIENT_ID");
  if (missing.length) {
    console.error("[Cognito] Missing env:", missing.join(", "));
    return false;
  }
  return true;
}

let pool = null;
if (cfgOK()) {
  pool = new CognitoUserPool({ UserPoolId: POOL_ID, ClientId: CLIENT_ID });
}

export function parseGroups(idToken) {
  try {
    const d = jwtDecode(idToken);
    return { groups: d["cognito:groups"] || [], clinicId: d["custom:clinicId"] || null };
  } catch (e) {
    console.warn("[Cognito] jwt decode failed:", e);
    return { groups: [], clinicId: null };
  }
}

export function getCurrentUser() {
  if (!pool) return null;
  return pool.getCurrentUser() || null;
}

export async function signIn(email, password) {
  if (!pool) throw new Error("Cognito not configured (check env).");
  const user = new CognitoUser({ Username: email, Pool: pool });
  const details = new AuthenticationDetails({ Username: email, Password: password });
  return new Promise((resolve, reject) => {
    user.authenticateUser(details, {
      onSuccess: (session) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => reject(err),
      newPasswordRequired: () => reject(new Error("New password required (admin must set).")),
    });
  });
}

export async function signOut() {
  getCurrentUser()?.signOut();
}

export function tryRestoreSession() {
  if (!pool) return Promise.resolve(null);
  const cu = getCurrentUser();
  if (!cu) return Promise.resolve(null);
  return new Promise((resolve) => {
    cu.getSession((err, session) => {
      if (err || !session?.isValid()) return resolve(null);
      resolve({
        idToken: session.getIdToken().getJwtToken(),
        accessToken: session.getAccessToken().getJwtToken(),
        refreshToken: session.getRefreshToken().getToken(),
      });
    });
  });
}

export function refreshIfNeeded() {
  if (!pool) return Promise.resolve(null);
  const cu = getCurrentUser();
  if (!cu) return Promise.resolve(null);
  return new Promise((resolve) => {
    cu.getSession((err, session) => {
      if (err || !session) return resolve(null);
      if (session.isValid()) {
        return resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      }
      cu.refreshSession(session.getRefreshToken(), (e, newSession) => {
        if (e) return resolve(null);
        resolve({
          idToken: newSession.getIdToken().getJwtToken(),
          accessToken: newSession.getAccessToken().getJwtToken(),
          refreshToken: newSession.getRefreshToken().getToken(),
        });
      });
    });
  });
}

export function signUp(email, password, attributes = []) {
  if (!pool) return Promise.reject(new Error("Cognito not configured (check env)."));
  return new Promise((resolve, reject) => {
    pool.signUp(email, password, attributes, null, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

export function confirmSignUp(email, code) {
  if (!pool) return Promise.reject(new Error("Cognito not configured (check env)."));
  const user = new CognitoUser({ Username: email, Pool: pool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
