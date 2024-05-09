import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import Welcome from "../Welcome/Welcome";

import Navbar from "../../components/Navbar/Navbar";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { useSocialMedia } from "../../Context/SocialMediaContext";
import { Link } from "react-router-dom";
import UserProfileCard from "../../components/UserProfileCard";
import ConnectButton from "../../components/ConnectButton";

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
    // getAnalytics();
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

      setFollowers((prevFollowers) =>
      prevFollowers.filter((follower) => follower.user !== user)
      );
    getFollowing();
    } catch (error) {
      console.log("Error while unfollowing user", error);
    }
  };
//   const getAnalytics = async () => {
//     try {
//         const analyticsData = await readContract(config, {
//             abi: SocialMediaABI,
//             address: SocialMediaAddress,
//             functionName: "getPostAnalytics",
//             args: [user], 
//         });

//         setAnalytics(analyticsData);
//         console.log(analyticsData);
//     } catch (error) {
//         console.log("Error while fetching analytics", error);
//     }
// };
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
             // Pass analytics to UserProfileCard
                        />
                        {/* {analytics && (
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h5 className="card-title">Analytics</h5>
                                    <p>Total Posts: {analytics.totalPosts}</p>
                                    <p>Total Likes: {analytics.totalLikes}</p>
                                    <p>Total Comments: {analytics.totalComments}</p>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    </>
);
};

export default UserProfile;
