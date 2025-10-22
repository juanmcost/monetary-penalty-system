import { fetchFromApi } from "./utils";

export const getObjectives = async () => {
  return fetchFromApi("objectives");
};