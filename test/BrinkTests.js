let chai = require("chai");
let { solidity } = require("ethereum-waffle");
const { ethers } = require("hardhat");

const expect = chai.expect;

chai.use(solidity);

describe("Brink Tests", () => {
  let Brink, deployerAddress, owner, unauthorizedAddress, unauthorizedSigner;

  before("deploy instance", async () => {
    let Contract = await ethers.getContractFactory("GatekeepBrink");

    Brink = await Contract.deploy();

    await Brink.deployed();

    [owner, unauthorizedSigner] = await ethers.getSigners();

    [deployerAddress, unauthorizedAddress] = await ethers.provider.listAccounts();
  });

  it("the owner should be the deployer of the contract", async function () {
    chai.assert.equal(await Brink.owner(), deployerAddress);
  });

  it("set user address should revert if called by anyone but owner", async function () {
    await expect(Brink.connect(unauthorizedSigner).setUserAddress(unauthorizedAddress)).to.be.reverted;
  });

  it("set safe address should revert if called by anyone but owner", async function () {
    await expect(Brink.connect(unauthorizedSigner).setSafeAddress(unauthorizedAddress)).to.be.reverted;
  });

  it("intercept721 should revert if called by unauthorized user", async function () {
    await expect(Brink.connect(unauthorizedSigner).intercept721(2022, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d')).to.be.reverted;
  });

  it("intercept1155 should revert if called by unauthorized user", async function () {
    await expect(Brink.connect(unauthorizedSigner).intercept1155(2022, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d')).to.be.reverted;
  });

  it("intercept20 should revert if called by unauthorized user", async function () {
    await expect(Brink.connect(unauthorizedSigner).intercept20('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')).to.be.reverted;
  });
});