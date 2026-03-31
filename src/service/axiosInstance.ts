import axios from "axios";

export const dictionaryInstance = axios.create({
  baseURL: `https://api.dictionaryapi.dev/api/v2/entries/en`,
  timeout: 5000,
});
