import React from "react";
import styles from "./App.module.css";
import LoginScreen from "./login/LoginScreen";

import useStickyState from "./helpers/StickyState";

import * as dsnpLink from "./dsnpLink";
import { UserAccount } from "./types";
import Header from "./chrome/Header";
import Feed from "./Feed";
import { Col, ConfigProvider, Row } from "antd";
import { setAccessToken } from "./service/AuthService";

const App = (): JSX.Element => {
  const _fakeUser = {
    address: "0x",
    expiresIn: 100,
    accessToken: "23",
    handle: "handle-test",
    dsnpId: 1,
  };
  const [userAccount, setUserAccount] = useStickyState<UserAccount | undefined>(
    undefined,
    "user-account"
  );

  if (userAccount) setAccessToken(userAccount.accessToken, userAccount.expires);

  const handleLogin = (account: UserAccount, _network: string) => {
    setAccessToken(account.accessToken, account.expires);
    setUserAccount(account);
  };

  const handleLogout = () => {
    setUserAccount(undefined);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4473ec",
          colorSuccess: "#29fd47",
          colorWarning: "#ff7f0e",
          colorInfo: "#4473ec",
        },
      }}
    >
      <div className={styles.root}>
        <Row>
          <Col span={24}>
            <Header account={userAccount} logout={handleLogout} />
          </Col>
        </Row>
        <Row className={styles.content}>
          <Col span={12}>
            {!userAccount ? (
              <LoginScreen onLogin={handleLogin} />
            ) : (
              <Feed account={userAccount} />
            )}
          </Col>
          <Col span={12}>

          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default App;
