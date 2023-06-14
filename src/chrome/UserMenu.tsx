import React, { useState } from "react";
import { Button } from "antd";

interface UserMenuProps {
  logout: () => void;
}

const UserMenu = ({ logout }: UserMenuProps): JSX.Element => {
  return (
    <Button aria-label="Logout" onClick={logout}>
      Sign Out
    </Button>
  );
};

export default UserMenu;
