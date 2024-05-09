import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { readContract } from "@wagmi/core";
import { config } from "../../../config";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { InstaXContractABI,InstaXAddress } from "../../Context/constants";
import { useSocialMedia } from "../../Context/SocialMediaContext";

const Navbar = () => {
  const [user, setUser] = useState(null);

  const { address } = useSocialMedia();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const data = await readContract(config, {
        abi:InstaXContractABI,
        address:InstaXAddress,
        functionName: "getUser",
        args: [address],
      });

      setUser(data);
    } catch (error) {
      console.log("Error while fetching user", error);
    }
  };

  return (
    <div className="Navbar">
      <div className="card">
        <img
          src="https://www.undp.org/sites/g/files/zskgke326/files/2023-08/undp-rbec-socialmedia-social-illustration-omer-sayed-2023-edited.jpg"
          className="banner-img"
          alt="web3-social media banner"
        />
        <div className="card-body">
          <div className="text-center">
            <img
              src={`https://ipfs.io/ipfs/${
                user && user.profilePictureHash
              }`}
              className="profile-img"
              alt="User"
            />
            <h2 className="card-title mt-3 username">
              {user && user.username}
            </h2>
            <p className="card-text">{user && user.bio}</p>
          </div>
          <hr />
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <div className="d-flex">
                  <span className="material-symbols-outlined px-2">home</span>{" "}
                  Home
                </div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <div className="d-flex">
                  <span className="material-symbols-outlined px-2">
                    person
                  </span>
                  Profile
                </div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/myposts" className="nav-link">
                <div className="d-flex">
                  <span className="material-symbols-outlined px-2">mail</span>
                  My Posts
                </div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className="nav-link">
                <div className="d-flex">
                  <span className="material-symbols-outlined px-2">search</span>
                  Explore
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
