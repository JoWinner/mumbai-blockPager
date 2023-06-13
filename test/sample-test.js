const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("BlockPager contract", function () {
  let blockPager;
  let owner;
  let receiver;

  before(async function () {
    // Get signers from ethers provider
    [owner, receiver] = await ethers.getSigners();

    // Deploy BlockPager contract
    const BlockPager = await ethers.getContractFactory("BlockPager");
    blockPager = await BlockPager.deploy();
    await blockPager.deployed();

     await blockPager.createContent("tokenURI", {
       value: await blockPager.getFee(),
     });
   });

   describe("getOwnedContent", function () {
     it("returns the content of the owner", async function () {
       const contents = await blockPager.getOwnedContents();

       expect(contents).to.be.an("array").that.has.lengthOf(1);
       expect(contents[0]).to.be.an.instanceOf(Content);
       expect(contents[0].creator).to.equal(owner.address);
       expect(contents[0].numTransfers).to.equal(0);
       expect(contents[0].numReads).to.equal(0);
     });

     it("does not return the content of another user", async function () {
       const otherUser = await ethers.getSigner();

       await blockPager.connect(otherUser).createContent("tokenURI", {
         value: await blockPager.getFee(),
       });

       const contents = await blockPager.getOwnedContents();

       expect(contents).to.be.an("array").that.has.lengthOf(1);
       expect(contents[0]).to.be.an.instanceOf(Content);
       expect(contents[0].creator).to.equal(owner.address);
       expect(contents[0].numTransfers).to.equal(0);
       expect(contents[0].numReads).to.equal(0);
     });

     it("returns the correct number of contents for the owner", async function () {
       await blockPager.createContent("tokenURI2", {
         value: await blockPager.getFee(),
       });

       const contents = await blockPager.getOwnedContents();

       expect(contents).to.be.an("array").that.has.lengthOf(2);
     });

     it("returns empty array for user without contents", async function () {
       const contents = await blockPager.connect(receiver).getOwnedContents();

       expect(contents).to.be.an("array").that.is.empty;
     });
   });
 });

