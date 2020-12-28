import { useAuth0 } from "@auth0/auth0-react";
import { hashCode } from "../utils";

export const useUserId = () => {
  const { user } = useAuth0();

  if (!user) {
    return "0";
  }
  return hashCode(user.sub);
};
