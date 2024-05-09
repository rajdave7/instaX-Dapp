import React, { useState } from "react";
import getTimeSince from "../../Utils/getTime";
import { writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { InstaXContractABI, InstaXAddress } from "../../Context/constants";

const Comment = (props) => {
  const { user, comment} = props;
  // const {}
  const [isLiked, setIsLiked] = useState(false);
  const likeComment = async () => {
    try {
      console.log("Comment ID:", comment.commentId);
      console.log("Post ID:", comment.postId);
  
      // Validate comment id and post id
      const commentId = parseInt(comment.commentId);
      const postId = parseInt(comment.postId);
      if (isNaN(commentId) || isNaN(postId)) {
        console.error("Invalid comment ID or post ID");
        return;
      }
      
      // Call the smart contract function with valid integers
      await writeContract(config, {
        abi: InstaXContractABI,
        address: InstaXAddress,
        functionName: "likeUnlikeComment",
        args: [postId, commentId],
      });
      console.log("no. of likes on the comment",comment.likes);
    } catch (error) {
      console.log("Error while liking comment", error);
    }
  };
  
  
  
  return (
    <div className="comment-container">
      <div className="comment-avatar">
        <img
          src={user && `https://ipfs.io/ipfs/${user.profilePictureHash}`}
          className="rounded-circle post-avatar"
          alt="User"
        />
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <h2 className="username">{user && user.username}</h2>
          <p className="time-text">
            {comment && getTimeSince(parseInt(comment.timestamp))}
          </p>
        </div>
        <p className="comment-text">{comment && comment.content}</p>
        <div className="comment-actions">
          <button
            className={`btn btn-link`}
            onClick={likeComment}
          >
            Like
          </button>
          <span className="comment-likes">{comment && parseInt(comment.likes)} Likes</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
