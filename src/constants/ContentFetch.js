import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios from "axios";
import { ethers } from "ethers";
import { contractABI, blockPagerAddress } from "../utils/constants";

// Enable relative time plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

export const formatNumViews = (numViews) => {
  if (numViews >= 1000000) {
    return `${(numViews / 1000000).toFixed(1)}m`;
  } else if (numViews >= 1000) {
    return `${(numViews / 1000).toFixed(1)}k`;
  } else {
    return numViews;
  }
};

// Create a new instance of ethers.providers.JsonRpcProvider with the Infura/alchemy URL

export const provider = new ethers.providers.JsonRpcProvider(
  import.meta.env.VITE_ALCHEMY_MUMBAI_URL

  // import.meta.env.VITE_LOCALHOST_URL
);

// Create a new instance of ethers.Contract using the provider

export const provideContract = new ethers.Contract(
  blockPagerAddress,
  contractABI,
  provider
);

let walletAddress = "";

export const getCurrentWalletConnected = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        walletAddress = accounts[0];
      } else {
        walletAddress = "";

        // console.log("Connect to MetaMask using the Connect button");
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    // console.log("Please install MetaMask!");
  }
};

export const addWalletListener = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", (accounts) => {
      walletAddress = accounts[0];
    });
  } else {
    walletAddress = "";
    // console.log("Please install MetaMask!");
  }
};

export const getWalletAddress = () => {
  return walletAddress;
};

export const connectToMetamask = async () => {
  await getCurrentWalletConnected(); // Check if wallet is connected and update the walletAddress variable

  if (window.ethereum && walletAddress) {
    const signerProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = signerProvider.getSigner();
    const signContract = new ethers.Contract(
      blockPagerAddress,
      contractABI,
      signer
    );
    return signContract;
  }
  return null;
};
export const signContract = await connectToMetamask();

// Provider to functions and calls to Contract
export const getContents = async (data, setUserData) => {
  const promises = data.map(async (i) => {
    const tokenUri = await provideContract.tokenURI(i.tokenId);
    const meta = await axios.get(tokenUri);
    const price = ethers.utils.formatUnits(i.price.toString(), "ether");
    const creationDate = await provideContract.getCreationDate(i.tokenId);
    const date = dayjs.utc(
      `${creationDate.year}-${creationDate.month}-${creationDate.day} ${creationDate.hour}:${creationDate.minute}:${creationDate.second}`
    );
    // Enable relative time plugin
    dayjs.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const formattedDate = date.fromNow(true);
    const [accountCID, userWallet, userIdNum, exists] =
      await provideContract.getUserAccount({ from: i.creator });
    const response = await axios.get(accountCID);
    const userData = response.data;
    const pictureCID = await provideContract.getPicture({
      from: i.creator,
    });
    const res = await axios.get(pictureCID);
    const userPicture = res.data;
    const picture = userPicture.image;

    setUserData({
      name: userData.name,
      email: userData.email,
      link: userData.link,
      bio: userData.bio,
      picture: meta.data.picture,
    });

    const content = {
      price,
      id: i.tokenId.toNumber(),
      creator: userData.name,
      creatorEmail: userData.email,
      creatorLink: userData.link,
      creatorBio: userData.bio,
      creatorPicture: picture,
      viewer: i.viewer,
      creatorAddress: i.creator,
      numViews: formatNumViews(i.numViews.toNumber()),
      image: meta.data.image,
      description: meta.data.description,
      title: meta.data.title,
      category: meta.data.category,
      editorData: meta.data.editorData,
      date: formattedDate,
      tokenUri,
    };

    return content;
  });

  return Promise.all(promises);
};

// Signer functions and calls to contract
export const getUserContents = async (data, setUserData) => {
  const signContract = await connectToMetamask();
  if (signContract) {
    const promises = data.map(async (i) => {
      const tokenUri = await signContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      const price = ethers.utils.formatUnits(i.price.toString(), "ether");
      const creationDate = await signContract.getCreationDate(i.tokenId);
      const date = dayjs.utc(
        `${creationDate.year}-${creationDate.month}-${creationDate.day} ${creationDate.hour}:${creationDate.minute}:${creationDate.second}`
      );
      // Enable relative time plugin
      dayjs.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);
      const formattedDate = date.fromNow(true);
      const [accountCID, userWallet, userIdNum, exists] =
        await signContract.getUserAccount({ from: i.creator });
      const response = await axios.get(accountCID);
      const userData = response.data;

      setUserData({
        name: userData.name,
      });

      const content = {
        price,
        id: i.tokenId.toNumber(),
        creator: userData.name,
        creatorAddress: i.creator,
        viewer: i.viewer,
        numViews: formatNumViews(i.numViews.toNumber()),
        image: meta.data.image,
        description: meta.data.description,
        numReads: i.numReads.toNumber(),
        numTransfers: i.numTransfers.toNumber(),
        title: meta.data.title,
        category: meta.data.category,
        editorData: meta.data.editorData,
        date: formattedDate,
        tokenUri,
      };

      return content;
    });

    return Promise.all(promises);
  }
};


export const getUserProfile = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [accountCID, userWallet, userIdNum, exists] =
        await signContract.getUserAccount();

      if (!exists) {
        resolve();
        return;
      }

      const response = await axios.get(accountCID);
      const userProfile = response.data;

      const profile = {
        name: userProfile.name,
        email: userProfile.email,
        link: userProfile.link,
        bio: userProfile.bio,
        userWallet: userWallet,
        userIdNum: userIdNum.toNumber(),
      };

      resolve(profile);
    } catch (error) {
      reject(error);
    }
  });
};

export const getUserPicture = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pictureCID = await signContract.getPicture();
      const response = await axios.get(pictureCID);

      const userPicture = response.data;
      const picture = userPicture.image;

      resolve(picture);
    } catch (error) {
      reject(error);
    }
  });
};

export const getUserStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [accountCID, userWallet, userIdNum, exists] =
        await signContract.getUserAccount();

      if (!exists) {
        resolve();
        return;
      }

      const [numPublicItems, totalViews, totalEarnings] =
        await signContract.getUserStats(userWallet);

      const stats = {
        numPublicItems: numPublicItems.toNumber(),
        totalViews: totalViews.toNumber(),
        totalEarnings: ethers.utils.formatUnits(
          totalEarnings.toString(),
          "ether"
        ),
      };

      resolve(stats);
    } catch (error) {
      reject(error);
    }
  });
};

