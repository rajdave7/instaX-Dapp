import React, { useEffect, useState } from "react";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar";
import CreatePost from "../../components/CreatePost/CreatePost";
import { readContract } from "@wagmi/core";
import ConnectButton from "../../components/ConnectButton";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { useSocialMedia } from "../../Context/SocialMediaContext";
import Welcome from "../Welcome/Welcome";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const { address } = useSocialMedia();
  const [sortBy, setSortBy] = useState("desc"); // Default sorting by descending order

  if (!localStorage.getItem("isRegistered")) {
    return <Welcome />;
  }

  useEffect(() => {
    getPosts();
  }, [sortBy]);

  const getPosts = async () => {
    try {
      const data = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "getUserPosts",
        args: [address],
      });

      let sortedPosts;
      if (sortBy === "asc") {
        sortedPosts = data.sort((a, b) => compareBigInt(a.timestamp, b.timestamp));
      } else {
        sortedPosts = data.sort((a, b) => compareBigInt(b.timestamp, a.timestamp));
      }
      setPosts(sortedPosts);

      try {
        const user = await readContract(config, {
          abi: SocialMediaABI,
          address: SocialMediaAddress,
          functionName: "getUser",
          args: [address],
        });

        setUser(user);
      } catch (error) {
        console.log("Error while fetching user", error);
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
    <div className="MyPosts">
      <div className="container mt-4">
        <div className="row">
            <div className="col-md-7" >
            <div style={{ paddingRight: '20px' }}>
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
              {posts.map((post, index) => (
                <Post key={index} post={post} user={user} />
              ))}
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

export default MyPosts;
