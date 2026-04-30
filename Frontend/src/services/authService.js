import api, { setAccessToken } from "./api";

export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  const { accessToken, user } = res.data.data;

  setAccessToken(accessToken);

  return { user,accessToken };
};

export const register = (data) => {
  return api.post("/auth/register", data);
};

export const getMe = () => {
  return api.get("/auth/get-me");
};

export const logout = async () => {
  await api.get("/auth/logout");
  setAccessToken(null);
};

export const resendOTP = async (email) => {
  return api.post("/auth/resend-otp", { email });
};

export const logoutAll = async () => {
  const res = await api.get("/auth/logout-all");
  setAccessToken(null);
  return res;
};