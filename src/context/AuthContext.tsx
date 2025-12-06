"use client";

import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { getProfile } from "@/services";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface Profile {
  id: string;
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
  setAccessToken: (accessToken: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: ReactNode;
  initialAccessToken?: string | null;
}> = ({ children, initialAccessToken = null }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(
    initialAccessToken
  );

  const setAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);

    localStorage.setItem("accessToken", token || "");
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setAccessTokenState(savedToken);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!accessToken) {
        if (isMounted) {
          setIsLogged(false);
          setProfile(null);
        }
        return;
      }

      try {
        const response = await getProfile();
        if (isMounted) {
          setIsLogged(true);
          setProfile(response.data.data as Profile);
        }
      } catch {
        if (isMounted) {
          setIsLogged(false);
          setProfile(null);
          setAccessToken(null);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken, setAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        profile,
        setIsLogged,
        setProfile,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
