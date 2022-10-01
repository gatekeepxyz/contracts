// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/access/AccessControl.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.7/contracts/token/ERC20/ERC20.sol";

contract GatekeepBrink is Ownable, AccessControl  {
    address public gatekeepGuard = 0xb265251f1084397bdBb434b932a6070220F3784A;
    address public userAddress;
    address public safeAddress;
    address public brinkAddress;

    bytes32 public constant GUARD_ROLE = keccak256("GUARD_ROLE");

    constructor() {
        _grantRole(GUARD_ROLE, gatekeepGuard);
        _grantRole(GUARD_ROLE, msg.sender);
        userAddress = msg.sender;
        safeAddress = msg.sender;
        brinkAddress = address(this);
    }

    receive() external payable {}

    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function setUserAddress(address userAddress_ ) external onlyOwner {
        // Set wallet address to be actively monitored.
        userAddress = userAddress_;
    }

    function setSafeAddress(address safeAddress_ ) external onlyOwner {
        // Set address ( cold wallet recommended ) that will act as a vault. Assets will be transferred here.
        safeAddress = safeAddress_;
    }

    function viewUserAddress() external view returns(address) {
        return userAddress;
    }

    function viewSafeAddress() external view returns(address) {
        return safeAddress;
    }

    function intercept721(uint256 _tokenId, address _contractAddress) external onlyRole(GUARD_ROLE) {
        // Intercept ERC721 asset transfer
        ERC721(_contractAddress).safeTransferFrom(userAddress, safeAddress, _tokenId);
    }

    function intercept1155(uint256 _tokenId, address _contractAddress) external onlyRole(GUARD_ROLE) {
        // Intercept ERC1155 asset transfer
        ERC1155 token1155 = ERC1155(_contractAddress);

        bytes memory data = "\x01\x02\x03";
        
        uint256 totalBalance1155 = token1155.balanceOf(userAddress, _tokenId);

        token1155.safeTransferFrom(userAddress, safeAddress, _tokenId, totalBalance1155, data);
    }

    function intercept20(address _contractAddress) external onlyRole(GUARD_ROLE) {
        // Intercept ERC20 asset transfer
        ERC20 token20 = ERC20(_contractAddress);

        uint256 totalBalance20 = token20.balanceOf(userAddress);

        token20.transferFrom(userAddress, safeAddress, totalBalance20);
    }
}