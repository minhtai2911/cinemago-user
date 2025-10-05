"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface Profile {
  userId: string;
  fullname: string;
  role: Role;
  avatarUrl?: string;
  publicId?: string;
}

interface AuthContextProps {
  isLogged: boolean;
  profile: Profile | null;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  setAccessToken: (accessToken: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: ReactNode;
  initialAccessToken?: string;
}> = ({ children, initialAccessToken }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    initialAccessToken || null
  );

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode<Profile>(accessToken);
        setIsLogged(true);
        setProfile(decoded);
      } catch {
        setIsLogged(false);
        setProfile(null);
      }
    } else {
      setIsLogged(false);
      setProfile(null);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ isLogged, profile, setIsLogged, setProfile, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
