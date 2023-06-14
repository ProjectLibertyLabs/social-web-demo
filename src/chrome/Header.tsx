import React from "react";
import UserAvatar from "./UserAvatar";
import { Popover } from "antd";
import UserMenu from "./UserMenu";
import type { UserAccount } from "../types";

type HeaderProps = {
  account: UserAccount;
  logout: () => void;
};

const Header = ({ account, logout }: HeaderProps): JSX.Element => {
  return (
    <div className="Header__block">
      <h1 className="Header__title">Social Web</h1>
      <Popover
        placement="bottomRight"
        trigger="click"
        content={<UserMenu logout={logout} />}
      >
        <UserAvatar user={account} avatarSize="small" />
        <div>{account.handle}</div>
      </Popover>
    </div>
  );
};
export default Header;
