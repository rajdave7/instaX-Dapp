import React, { useState, useEffect } from "react";
import "./FollowList.css";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { useSocialMedia } from "../../Context/SocialMediaContext";
import Navbar from "../../components/Navbar/Navbar";
import ConnectButton from "../../components/ConnectButton";

const FollowList = () => {
  const { address } = useSocialMedia();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Function to handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="FollowList">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for friends..." 
              className="form-control mb-3 card-dark"
              style={{ "::placeholder": { color: "#fff" } }}
            />

            </div>
            <div className="card card-dark">
              <div className="card-body">
                <h2 className="card-title fs-5 py-2">Find Friends</h2>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
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
                  ))
                ) : (
                  <p style={{ color: "#fff" }}>Friend not found</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <ConnectButton />
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowList;
