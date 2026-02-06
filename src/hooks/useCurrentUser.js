import { useMemo } from "react";

const DEFAULT_USER = { id: "u-1", name: "Alex Admin", role: "admin" };

const normalizeRole = (role) => String(role || "").trim().toLowerCase();

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const readStoredUser = () => {
  const storedProfile = safeParse(localStorage.getItem("currentUser"));
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("userName");
  const id = localStorage.getItem("userId");

  if (storedProfile) {
    return {
      ...DEFAULT_USER,
      ...storedProfile,
      role: normalizeRole(storedProfile.role || DEFAULT_USER.role),
    };
  }

  return {
    ...DEFAULT_USER,
    role: normalizeRole(role || DEFAULT_USER.role),
    name: name || DEFAULT_USER.name,
    id: id || DEFAULT_USER.id,
  };
};

export const getRoleFlags = (user) => {
  const role = normalizeRole(user?.role);
  return {
    isAdmin: role === "admin",
    isManager: role === "manager",
    isUser: role === "user",
  };
};

export default function useCurrentUser() {
  return useMemo(() => readStoredUser(), []);
}
