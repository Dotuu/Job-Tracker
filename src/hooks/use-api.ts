import { useAuth } from "@clerk/react";
import { useCallback } from "react";

export const useAuthToken = () => {
  const { getToken } = useAuth();

  return useCallback(async () => {
    const token = await getToken();
    if (!token) {
      throw new Error("Not signed in");
    }
    return token;
  }, [getToken]);
};
