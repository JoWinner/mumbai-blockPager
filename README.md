# ✨ Features

- Utility-first CSS with [Tailwind CSS](https://tailwindcss.com)
- Built on Ethereum-Polygon Blockchain
- Hardhat for the smart contract
- Uses EthersJs for the web3 interaction
- Web3 Modal for Wallet Connections
- Wallet for SignUp and SignIn
- Openzeppelin Incorporation
- Infura IPFS Storage
- Editor Js for WYSIWYG
- Private Data/Content/Information Creation for Private Purposes
- Public Data/Content/Information Creation for Publishing and Monetizing
- Read Private Content over
- Send/Transfer and Receive Private Content(Transfer once)
- Burn Private Content
- Auto-Burn Private Content after Max-reads
- Read Published Content after paying
- Read Published for already paid users and the creator

# 💀 Set Up

### 1) Vite React App

1. **Iniitialize and Build**

   - Initialize the whole project to install all the necessary packages in the root folder or `/block_pager`
     ...run `npm init`

### 2) ENV Setup
  _Create a .env file at the root and add all the credentials_

1. **Environment Variables**
   - All the .env needed
     _Start every .env variable name with VITE, check VITE React documentation_

# Infura ipfs credentials

_Create node on infura.io, create a project and copy your credentials dashboard_

- IPFS_PROJECT_ID = xxxxxx
- IPFS_API_ENDPOINT = xxxxxx
- IPFS_API_KEY = xxxxxx

# Infura Networks credentials

_Copy your credentials dashboard for networks_

- NETWORK_API_KEY = xxxxxx
- MAINNET_URL = xxxxxx
- MUMBAI_URL = xxxxxx

**You can also choose alchemy for your nodes but make sure you replace all the network varialbles with whatever you are using**

# Alchemy credentials

_Create a new project on Alchemy, and copy your credentials dashboard_

- ALCHEMY_NETWORK_KEY = xxxxxx
- ALCHEMY_MUMBAI_URL = xxxxxx
- ALCHEMY_MAINNET_URL = xxxxxx

# Localhost Environment Variables
_Add the localhost network details in the .env. This is purposely for hardhat node_
- VITE_LOCALHOST_URL = http://localhost:8545

# Metamask [accounts] Key

**In this project, metamask was used for the testing, compiling and deployment of the contract. But whatever wallet you are using copy the accounts key for deployment**

- DEPLOYER_KEY = xxxxxx

2. **Wallet Connection**
   - Set up your metamask wallet on the testnet and the localhost
   - Add Mumbai testnet
   - Add Local host with the chain ID

### 3) Run Project
_Go to `src/utils/ContentFetch.js` and set the provider RPC variable to the preferred network(This instantiates the contract & Connects the dApp to the network)_ 

# (Note that `/block_pager` is the path to run every command)

1. **Compile Contract**

   - Compile the smart contract but before compiling you can clean "cache" and "artifacts folder" _(Look up directory in the cache folder)_
     ...run `npx hardhat clean` to clean cache which and empty the "artifacts folder" and the "cache folder"

   ...run `npx hardhat compile` to compile contract.
   This creates new files including the "ABI" in the `artifacts/contracts/BlockPager.sol`

- After a new ABI has been created from compiling, go to: `artifacts/contracts/BlockPager.sol` directory and copy everything inside the "BlockPager.json"
- Go to directory `src/utils/BlockPager.json` and paste
  **Or can simply copy and paste the "BlockPager.json" file and paste it in the `src/utils/BlockPager.json`**
  # Do this every time you compile the contract
- Do the same thing for the "BokkyPooBahsDateTimeLibrary.json" file but once for this file is enough.

2. **Run Test Node**

   - Start the local node to test with hardhat
     ...run `npx hardhat node`
     This starts testing network and generates wallets addresses and keys with some eth for testing purposes

   - Open another terminal
     ...run `npx hardhat run scripts/deploy.js --network localhost`
     On successful deployment, an address is generated _This is the contract address for your dApp_
     **This address is saved immediately in `address.js` a which is at the root directory**

   - Copy and paste this at the variable "blockPagerAddress =XXXX " in directory `src/utils/constants.js`.

   - Now start the dApp
     ...run `npm run dev`
     _Metamask will immediately open when visiting the site_
     _Without metamask installed, you will be prompted to install it_

### 4) Use-test dApp

1. **Routes**

- The `/` root or home route doesn't have any contents so blank white pages will be rendered

- Go to `/user-dashboard`, set up user profile and create and publish at least 3 pagers. The pages will render nicely.

- The Admin panel is on `/admin`
- Only contract owner can access this page. It is authenticated and authorize with ethers.js by connected wallet address comparison

  # - Admin can see all the stats of the dApp

  Includes - number of published pagers - number of private pager

  # - Admin can change fees

  # - Admin can withdraw fees paid by content creators

  # - Admin can withdraw commissions received by content viewers

  # - Admin can set a new admin

  # 🔥 Admin is the boss

### 5) Editor (WYSIWYG)

**Editorjs is used for the creation of WYSIWYG documents** 
- Blocks and other plugins can be added to upgrade the editor tools
- Check for documentation _(https://editorjs.io/)_


### 6) Main Deployment

**The main differences between the local deployment and the main deployment is the setting of the .env variables**

- 1. Make sure you have the network variable set in place in the "hardhat.config.js" file (from the root /hardhat.config.js), whether `MUMBAI` or `MAINNET`
  _(change `defaultNetWork` and `chainId` to your network. `npx hardhat node` is for local node environment run/testing)_
- 2. The Deployment wallet network must be on the same network
- 3. Get some eth available in the wallet (Polygon is cheapest)
     ...run `npx hardhat run scripts/deploy.js --network mumbai`
     to deploy on polygon mumbai testnet
     ...run `npx hardhat run scripts/deploy.js --network matic`
     to deploy on polygon mainnet
     _DON'T FORGET TO DOUBLE-CHECK THE ADDRESS GENERATED AFTER THE DEPLOYMENT IS IN PLACE AT `src/utils/constants.js`_
     npx hardhat node --network mumbai

# ⚡ Please Don't forget not to stress today, you WON!!!
