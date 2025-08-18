import { signIn, signOut, tryRestoreSession, refreshIfNeeded, parseGroups, signUp, confirmSignUp } from "./cognitoAuth";

export const authApi = {
  async login(email, password, rememberMe) {
    const { idToken, accessToken, refreshToken } = await signIn(email, password);
    const { groups, clinicId } = parseGroups(idToken);
    const role = groups.includes("Reviewer") ? "internal_staff" : "clinic_user";

    // Persist (your LoginPage expects these)
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("accessToken", accessToken);
    if (rememberMe && refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    if (clinicId) localStorage.setItem("clinicId", clinicId);

    return { idToken, accessToken, refreshToken, role };
  },

  async logout() {
    await signOut();
  },

  // Optional helpers for app boot
  async restore() {
    const s = await tryRestoreSession();
    if (!s) return null;
    const { idToken } = s;
    const { groups, clinicId } = parseGroups(idToken);
    const role = groups.includes("Reviewer") ? "internal_staff" : "clinic_user";
    localStorage.setItem("idToken", s.idToken);
    localStorage.setItem("accessToken", s.accessToken);
    if (s.refreshToken) localStorage.setItem("refreshToken", s.refreshToken);
    localStorage.setItem("role", role);
    if (clinicId) localStorage.setItem("clinicId", clinicId);
    return { ...s, role };
  },

  async refresh() {
    return refreshIfNeeded();
  },

  // Sign-up flow (note: adding users to groups must be done by an admin/automation)
  async register({ email, password, role, clinicId }) {
    const attrs = [];
    if (clinicId) attrs.push({ Name: "custom:clinicId", Value: clinicId });
    // Client apps cannot add groups; do that via Admin API or console after sign-up.
    return signUp(email, password, attrs);
  },

  async confirm(email, code) {
    return confirmSignUp(email, code);
  },
};
