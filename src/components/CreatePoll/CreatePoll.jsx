import React, { useState, useEffect } from "react";
import "./CreatePoll.css";
import { Link } from "react-router-dom";

import { readContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { useSocialMedia } from "../../Context/SocialMediaContext";

const FollowList = () => {
  const { address } = useSocialMedia();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "getUnfollowedUsers",
        account: address,
      });

      setUsers(res);
    } catch (error) {
      console.log("Error while fetching users", error);
    }
  };

  const followUser = async (user) => {
    try {
      await writeContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "followUser",
        args: [user.user],
        account: address,
      });

      getUsers();
    } catch (error) {
      console.log("Error while following user", error);
    }
  };

  return (
    <div className="FollowList">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title fs-5 py-2">Find Friends</h2>
          {users &&
            users.map((user, index) => (
              <div key={index} className="user-container">
                <div className="user-info">
                  <img
                    src={`https://ipfs.io/ipfs/${user.profilePictureHash}`}
                    className="avatar"
                    alt="User"
                  />
                  <h2 className="username">{user.username}</h2>
                </div>
                <button
                  className="btn btn-primary follow-btn"
                  onClick={() => followUser(user)}
                >
                  Follow
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
