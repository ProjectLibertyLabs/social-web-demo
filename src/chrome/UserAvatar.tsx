import React from "react";
import { Avatar } from "antd";
import * as blockies from "blockies-ts";
import { UserOutlined } from "@ant-design/icons";
import type { User } from "../types";
import styles from "./UserAvatar.module.css";

const avatarSizeOptions = new Map([
  ["small", 28],
  ["medium", 50],
  ["large", 100],
  ["xl", 150],
]);

interface UserAvatarProps {
  user: User | undefined;
  avatarSize: "small" | "medium" | "large" | "xl";
}

const UserAvatar = ({ user, avatarSize }: UserAvatarProps): JSX.Element => {
  const iconURL = user
    ? user.profile?.icon ||
      blockies.create({ seed: user.dsnpId.toString() }).toDataURL()
    : "";

  return (
    <Avatar
      className={styles.root}
      icon={<UserOutlined />}
      src={iconURL}
      size={avatarSizeOptions.get(avatarSize)}
      style={{ minWidth: avatarSizeOptions.get(avatarSize) }}
    />
  );
};

export default UserAvatar;
