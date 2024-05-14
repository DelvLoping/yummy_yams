import { IUser } from "../redux/types";

export const saveInLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};
export const getFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};
export const removeFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
export const clearLocalStorage = (): void => {
  localStorage.clear();
};
export const isAuthenticated = (): boolean => {
  return getFromLocalStorage("jwt") !== null;
};
export const logout = (): void => {
  removeFromLocalStorage("jwt");
  removeFromLocalStorage("user");
};
export const login = (jwt: string, user: IUser): void => {
  setUser(user);
  setJwt(jwt);
};
export const getUser = (): IUser | null => {
  const user = getFromLocalStorage("user");
  return user ? JSON.parse(user) : null;
};
export const getJwt = (): string | null => {
  return getFromLocalStorage("jwt");
};
export const setUser = (user: IUser): void => {
  saveInLocalStorage("user", JSON.stringify(user));
};
export const setJwt = (jwt: string): void => {
  saveInLocalStorage("jwt", jwt);
};
