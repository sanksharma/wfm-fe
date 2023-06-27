import { API_URL } from "@/config";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: API_URL,
});
