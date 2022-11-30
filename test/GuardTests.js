let chai = require("chai");
let { solidity } = require("ethereum-waffle");
const { ethers } = require("hardhat");

const expect = chai.expect;

chai.use(solidity);

describe("Guard Tests", () => {
  let Guard, deployerAddress, owner, unauthorizedAddress, unauthorizedSigner;

  before("deploy instance", async () => {
    let Contract = await ethers.getContractFactory("GatekeepGuard");

    Guard = await Contract.deploy();

    await Guard.deployed();

    [owner, unauthorizedSigner] = await ethers.getSigners();

    [deployerAddress, unauthorizedAddress] = await ethers.provider.listAccounts();
  });

  it("the owner should be the deployer of the contract", async function () {
    chai.assert.equal(await Guard.owner(), deployerAddress);
  });

  it("trigger721Intercept should revert if called by unauthorized user", async function () {
    await expect(Guard.connect(unauthorizedSigner).trigger721Intercept('0xb39edb8f9ca3c14e1e7978823e981e3fbe03b235', 2022, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d')).to.be.reverted;
  });

  it("trigger1155Intercept should revert if called by unauthorized user", async function () {
    await expect(Guard.connect(unauthorizedSigner).trigger1155Intercept('0xb39edb8f9ca3c14e1e7978823e981e3fbe03b235', 2022, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d')).to.be.reverted;
  });

  it("intercept20 should revert if called by unauthorized user", async function () {
    await expect(Guard.connect(unauthorizedSigner).trigger20Intercept('0xb39edb8f9ca3c14e1e7978823e981e3fbe03b235', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')).to.be.reverted;
  });
});