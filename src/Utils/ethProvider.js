const provider = window.ethereum;
const { ethers } = require("ethers");
const ethprovider = new ethers.BrowserProvider(window.ethereum);
const [signer, setSigner] = useState();
export const getTimeStamp = async () => {
  const _provider = new ethers.JsonRpcProvider(
    "https://polygon-amoy-bor-rpc.publicnode.com"
  );
  let b_number = await _provider.getBlockNumber();
  let b_lock = await _provider.getBlock(b_number);
  return b_lock.timestamp;
};

export const onConnect = async (connected) => {
  const _chainId = await provider.request({ method: "eth_chainId" });
  if (_chainId.toString() !== "0x13882") {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13882",
                chainName: "Amoy",
                rpcUrls: ["https://polygon-amoy-bor-rpc.publicnode.com"],
              },
            ],
          });
        } catch (addError) {
          console.log(addError);
        }
      }
    }
  }
  if (!connected) {
    const res = await provider.request({ method: "eth_requestAccounts" });
    if (res) {
      return { res: res[0], conn: true };
    } else {
      return { res: "", conn: false };
    }
  }
};
