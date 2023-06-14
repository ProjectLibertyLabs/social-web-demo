import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import LoginScreen from "./login/LoginScreen";
import UserApp from "./UserApp";

import * as dsnpLink from "./dsnpLink";
import { UserAccount } from "./types";

const App = (): JSX.Element => {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);

  const handleLogin = (account: UserAccount) => {
    setUserAccount(account);
  };

  const handleLogout = () => {
    setUserAccount(null);
  };

  return (
    <div>
      {!userAccount ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <UserApp account={userAccount} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
