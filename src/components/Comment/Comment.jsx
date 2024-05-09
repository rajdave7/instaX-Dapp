import React from "react";
import getTimeSince from "../../Utils/getTime";
//import "./Comment.css";

const Comment = (props) => {
  const { user, comment } = props;

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
      </div>
    </div>
  );
};

export default Comment;
