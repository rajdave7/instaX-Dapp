import React from "react";

const UserProfileCard = ({ user, followers, following, showFollowers, showFollowing, handleToggleFollowers, handleToggleFollowing, handleUnfollow }) => {
  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-image">
          <img
            src={`https://ipfs.io/ipfs/${user && user.profilePictureHash}`}
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <h2>{user && user.username}</h2>
          <span className="username">{user && user.bio}</span>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat">
          <span>{user && parseInt(user.posts.length)}</span>
          <span>Posts</span>
        </div>
        <div className="stat" onClick={handleToggleFollowers}>
          <span>{user && parseInt(user.followers)}</span>
          <span>Followers</span>
        </div>
        <div className="stat" onClick={handleToggleFollowing}>
          <span>{user && parseInt(user.following)}</span>
          <span>Following</span>
        </div>
      </div>

      {/* Followers list */}
      {showFollowers && (
        <div className="followers">
          <h3>Followers</h3>
          <div className="followers-list d-flex flex-column">
            {followers.map((follower, index) => (
              <div
                key={index}
                className="follower d-flex justify-content-start align-items-center"
              >
                <img
                  src={`https://ipfs.io/ipfs/${follower.profilePictureHash}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "10px",
                  }}
                  alt="Follower"
                />
                <span>{follower.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Following list */}
      {showFollowing && (
        <div className="following">
          <h3>Following</h3>
          <div className="following-list d-flex flex-column">
            {following.map((followedUser, index) => (
              <div
                key={index}
                className="followed-user d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={`https://ipfs.io/ipfs/${followedUser.profilePictureHash}`}
                    style={{
                      width: "2px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                    alt="Following"
                  />
                  <span>{followedUser.username}</span>
                </div>
                <button
                  className="mx-5"
                  onClick={() => handleUnfollow(followedUser.user)}
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
