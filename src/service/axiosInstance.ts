import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `https://random-word-api.vercel.app`,
  timeout: 5000,
});

export const dictionaryInstance = axios.create({
  baseURL: `https://api.dictionaryapi.dev/api/v2/entries/en`,
  timeout: 5000,
});
