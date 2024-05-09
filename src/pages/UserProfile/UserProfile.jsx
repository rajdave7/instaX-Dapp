import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import Welcome from "../Welcome/Welcome";

import Navbar from "../../components/Navbar/Navbar";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { useSocialMedia } from "../../Context/SocialMediaContext";
import { Link } from "react-router-dom";
import UserProfileCard from "../../components/UserProfileCard"; // Import the UserProfileCard component

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(true);
  const [showFollowing, setShowFollowing] = useState(false);

  const { address } = useSocialMedia();

  useEffect(() => {
    getUser();
    getFollowers();
    getFollowing();
  }, []);

  if (!localStorage.getItem("isRegistered")) {
    return <Welcome />;
  }

  const getUser = async () => {
    try {
      const data = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "getUser",
        args: [address],
      });

      setUser(data);
    } catch (error) {
      console.log("Error while fetching user", error);
    }
  };

  const getFollowers = async () => {
    try {
      const data = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "getFollowers",
        args: [address],
      });

      setFollowers(data);
    } catch (error) {
      console.log("Error while fetching user", error);
    }
  };

  const getFollowing = async () => {
    try {
      const data = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "getFollowing",
        args: [address],
      });

      setFollowing(data);
      console.log(data);
    } catch (error) {
      console.log("Error while fetching user", error);
    }
  };

  const handleToggleFollowers = () => {
    setShowFollowers(true);
    setShowFollowing(false);
  };

  const handleToggleFollowing = () => {
    setShowFollowing(true);
    setShowFollowers(false);
  };

  const handleUnfollow = async (user) => {
    try {
      await writeContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "unfollowUser",
        args: [user],
        account: address,
      });

      getFollowing();
    } catch (error) {
      console.log("Error while unfollowing user", error);
    }
  };

  return (
    <>
      <div className="UserProfile">
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-3">
              <Navbar />
            </div>
            <div className="col-md-6">
              <UserProfileCard
                user={user}
                followers={followers}
                following={following}
                showFollowers={showFollowers}
                showFollowing={showFollowing}
                handleToggleFollowers={handleToggleFollowers}
                handleToggleFollowing={handleToggleFollowing}
                handleUnfollow={handleUnfollow}
              />
            </div>
          </div>
      </div>
      </div>
    </>
  );
};

export default UserProfile;