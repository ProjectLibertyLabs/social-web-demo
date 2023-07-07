import React from "react";
import styles from "./App.module.css";
import LoginScreen from "./login/LoginScreen";

import useStickyState from "./helpers/StickyState";

import * as dsnpLink from "./dsnpLink";
import { UserAccount } from "./types";
import Header from "./chrome/Header";
import Feed from "./Feed";
import { Col, ConfigProvider, Layout, Row, Slider } from "antd";
import { setAccessToken } from "./service/AuthService";
import ConnectionsList from "./network/ConnectionsList";
import { Content } from "antd/es/layout/layout";

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
      <Layout className={styles.root}>
        <Header account={userAccount} logout={handleLogout} />
        {!userAccount && (
          <Content className={styles.content}>
            <LoginScreen onLogin={handleLogin} />
          </Content>
        )}
        {userAccount && (
          <Content className={styles.content}>
            <Row>
              <Col sm={24} md={12} lg={24 - 8}>
                <Feed account={userAccount} />
              </Col>
              <Col sm={24} md={12} lg={8}>
                <ConnectionsList
                  account={userAccount}
                  graphRootUser={userAccount}
                />
              </Col>
            </Row>
          </Content>
        )}
      </Layout>
    </ConfigProvider>
  );
};

export default App;
