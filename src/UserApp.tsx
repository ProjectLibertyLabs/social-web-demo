import React from "react";
import { UserAccount } from "./types";
import Header from "./chrome/Header";
import Feed from "./Feed";

interface UserAppProps {
  account: UserAccount;
  onLogout: () => void;
}

const UserApp = ({ account, onLogout }: UserAppProps): JSX.Element => {
  return (
    <>
      <Header account={account} logout={onLogout} />
      <Feed account={account} />
    </>
  );
};

export default UserApp;
