// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract TutorialToken is ERC721 {
    constructor() ERC721("MyCollectible", "MCO") {
    }

    function preMint() external {
      uint tokenId = 0;
      ERC721._safeMint(msg.sender, tokenId);
    }

    function mint() external {
      console.log("mint from %s", msg.sender);
      uint tokenId = 1;
      ERC721._safeMint(msg.sender, tokenId);
    }

    // function balanceOf(address owner) public view override returns (uint256) {
    //   console.log("balanceOf from %s", msg.sender);
    //   console.log("balanceOf from %s", owner);
    //   require(owner != address(0), "ERC721: address zero is not a valid owner");
    //   uint256 balance = ERC721.balanceOf(msg.sender);
    //   console.log("balanceOf %s", balance);
    //   return balance;
    // }

    function hoge() public view returns (uint256) {
      console.log("hoge from %s", msg.sender);
      // uint256 balance = ERC721.balanceOf(owner);
      // console.log("hoge %s", balance);
      // return balance;
      return 1;
    }
}