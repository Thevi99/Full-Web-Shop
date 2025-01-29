"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
interface User {
  username: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Function to check if user exists in MongoDB
export const checkUserInMongo = async (username: string) => {
  try {
    const response = await fetch(`/api/checkUser?username=${username}`);
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking user in MongoDB:", error);
    return false;
  }
};
