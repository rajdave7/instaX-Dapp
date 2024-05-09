import React, { useState, useEffect } from "react";

import Navbar from "../../components/Navbar/Navbar";
import CreatePost from "../../components/CreatePost/CreatePost";
import Post from "../../components/Post/Post";
import Welcome from "../Welcome/Welcome";
import ConnectButton from "../../components/ConnectButton";

import { readContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { InstaXContractABI,InstaXAddress } from "../../Context/constants"; 
import { useSocialMedia } from "../../Context/SocialMediaContext";

const Home = () => {
  const { address } = useSocialMedia();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState("desc"); // Default sorting by descending order

  if (!localStorage.getItem("isRegistered")) {
    return <Welcome />;
  }

  useEffect(() => {
    if (!localStorage.getItem("isRegistered")) {
      window.location.href = "/welcome";
    } else {
      getPosts();
    }
  }, [localStorage.getItem("isRegistered"), sortBy]);

  const getPosts = async () => {
    try {
      const res = await readContract(config, {
        abi:InstaXContractABI,
        address:InstaXAddress,
        functionName: "getFollowingUsersPosts",
        account: address,
      });
  
      let sortedPosts;
      if (sortBy === "asc") {
        sortedPosts = res.sort((a, b) => compareBigInt(a.timestamp, b.timestamp));
      } else {
        sortedPosts = res.sort((a, b) => compareBigInt(b.timestamp, a.timestamp));
      }
      setPosts(sortedPosts);
  
      for (let i = 0; i < sortedPosts.length; i++) {
        const user = await readContract(config, {
          abi:InstaXContractABI,
          address:InstaXAddress,
          functionName: "getUser",
          args: [sortedPosts[i].user],
        });
  
        setUsers((prev) => [...prev, user]);
      }
    } catch (error) {
      console.log("Error while fetching posts", error);
    }
  };
  
  const compareBigInt = (a, b) => {
    const bigIntA = BigInt(a);
    const bigIntB = BigInt(b);
    if (bigIntA < bigIntB) return -1;
    if (bigIntA > bigIntB) return 1;
    return 0;
  };
  

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="Home">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <CreatePost />
          </div>
            <div className="col-md-5">
            <div className="form-group">
            <label htmlFor="sort" className="text-light card-dark" style={{ padding: '5px 10px', borderRadius: '5px' }}>Sort by: </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="custom-select card-dark" style={{ marginLeft: '10px' , padding: '5px 10px', borderRadius: '5px' }}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {users && posts && posts.map((post, index) => (
              <Post key={index} post={post} user={users[index]} />
            ))}
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

export default Home;
