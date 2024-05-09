import React, { useState, useEffect } from "react";
import "./CreatePost.css";

import { readContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { useSocialMedia } from "../../Context/SocialMediaContext";

const CreatePost = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [postId, setPostId] = useState(0);

  const { address } = useSocialMedia();
  console.log("create post function called......................");
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "getUser",
        args: [address],
      });
      console.log("reached get user");

      setUser(user);
    } catch (error) {
      console.log("Error while fetching user", error);
    }
  };

  console.log("text area change reached");

  const handleTextareaChange = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";

    setPostContent(event.target.value);
  };
  console.log("handle submission is below this line");
  const handleSubmission = async (event) => {
    event.preventDefault();

    try {
      const res = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "getNextPostId",
      });
      console.log("read contract called for getting next post id");
      console.log(res);
      const convertedRes = parseInt(res);
      setPostId(convertedRes);
      console.log(convertedRes);
    } catch (error) {
      console.log("Error while fetching post id", error);
    }

    try {
      console.log(postId);
      console.log(address);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const mimeType = selectedFile.type;
      const fileType = mimeType.split("/")[0];

      const metadata = JSON.stringify({
        name: "Post",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      console.log(res);

      const pinataRes = await res.json();
      const mediaHash = pinataRes.IpfsHash;

      console.log("below are pinataRes and mediaHash variables!!");
      console.log(pinataRes);
      console.log(mediaHash);

      try {
        const tx = await writeContract(config, {
          abi: SocialMediaABI,
          address: SocialMediaAddress,
          functionName: "createPost",
          args: [postContent, mediaHash, fileType],
          account: address,
        });
        console.log("post created in the smart contract");
        console.log(tx);
      } catch (error) {
        console.log("Error while creating post", error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Inside the CreatePost component, modify the return statement
return (
  <div className="CreatePost">
    <div className="card card-dark">
      <div className="card-body">
        <div className="profile-section">
          <img
            src={
              user &&
              `https://ipfs.io/ipfs/${user.profilePictureHash}`
            }
            className="rounded-circle post-avatar"
            alt="User Avatar"
          />
          <h2 className="username">{user && user.username}</h2>
        </div>
        <form onSubmit={handleSubmission} className="post-form">
          <textarea
            className="post-input"
            id="postContent"
            rows="3"
            cols="40"
            placeholder="Post your thoughts here"
            onChange={handleTextareaChange}
          ></textarea>
          <div className="upload-section">
            <input
              id="mediaUpload"
              type="file"
              accept="image/*,video/*"
              className="file-upload"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginBottom: "10px" }}
            />
            <button type="submit" className="submit-btn">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default CreatePost;
