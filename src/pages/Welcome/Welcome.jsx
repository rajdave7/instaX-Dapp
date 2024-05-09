import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useSocialMedia } from "../../Context/SocialMediaContext";
import { readContract, writeContract } from "@wagmi/core";
import { SocialMediaABI, SocialMediaAddress } from "../../Context/constants";
import { config } from "../../../config";
import smaAbi from "../../ABIs/sma.json";
import pcaAbi from "../../ABIs/pca.json";
import "./Welcome.css"; // Importing CSS file

const Welcome = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [ethereumInitialized, setEthereumInitialized] = useState(false);
  const navigate = useNavigate();
  const ethprovider = new ethers.BrowserProvider(window.ethereum);
  const [signer, setSigner] = useState();

  const { address, isConnecting } = useSocialMedia();

  const checkRegistration = async () => {
    try {
      const data = await readContract(config, {
        abi: SocialMediaABI,
        address: SocialMediaAddress,
        functionName: "isUser",
        args: [address],
      });
      setIsRegistered(data);

      if (data) {
        try {
          const data = await readContract(config, {
            abi: SocialMediaABI,
            address: SocialMediaAddress,
            functionName: "getUser",
            args: [address],
          });

          localStorage.setItem("isRegistered", true);
          navigate("https://www.google.com");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const _signer = await ethprovider.getSigner();
      setSigner(_signer);
    })();
  }, []);

  useEffect(() => {
    checkRegistration();
    initializeEthereum();
  }, []);

  const initializeEthereum = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setEthereumInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Ethereum:", error);
      }
    } else {
      console.error("MetaMask not detected.");
    }
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleSubmission = async () => {
    try {
      console.log(address);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: address,
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
      console.log("result-->");
      console.log(res);

      if (!res.ok) {
        // Handle the case where the fetch request fails
        console.error("Failed to pin file to IPFS:", res.statusText);
        return;
      }
      const pinataRes = await res.json();
      const profilePictureHash = pinataRes.IpfsHash;
      
      console.log("profile picture hash :::--> ");
      console.log(profilePictureHash);

      const writeUserData = async()=>{
        let contract = new ethers.Contract(ethers.getAddress("0xeb05c634f13678eccf24097142a1a2af785eea73"),smaAbi.abi,signer);
        const result = await contract.createUser(username,bio,profilePictureHash);
        await result.wait();
        console.log(result);
        console.log("User created by contract successfully");
      }
      try {
        const res = await writeContract(config, {
          address: SocialMediaAddress,
          abi: SocialMediaABI,
          functionName: "createUser",
          args: [username, bio, profilePictureHash],
          account: address,
        });

        localStorage.setItem("isRegistered", true);
        console.log("we need to reach here plsssssssss");
        navigate("/profile");
      } catch (error) {
        console.log("Error while creating user", error);
      }

      // localStorage.setItem("account", accounts[0]);
      // localStorage.setItem("user", JSON.stringify(createUserResData));

      // navigate("/");
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  console.log("reached return statement");
  return (
    <div className="welcome-container">
      {!isRegistered && (
        <div className="register-form">
            <w3m-button
              style={{
                backgroundColor: "black",
                borderRadius: "2rem",
                marginBottom: "1rem",
              }}
              />
          <h3>Register</h3>
          <input
            type="text"
            placeholder="Enter your desired username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Write a short bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={changeHandler}
          />
          <button onClick={handleSubmission}>
            Sign Up
          </button>
        </div>
      )}
      {error && <h3 className="error-message">{error}</h3>}
    </div>
  );
};

export default Welcome;
