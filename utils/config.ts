import Cookies from "js-cookie";

export const BASE_URL = "http://localhost:4000";
export const SOCKET_URL = "http://localhost:3002";

export const token = Cookies.get("token");

export const fileSize = 330;
