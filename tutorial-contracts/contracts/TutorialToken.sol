// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TutorialToken is ERC721 {
    constructor() ERC721("MyCollectible", "MCO") {
    }

    function preMint() public {
      _safeMint(msg.sender, 0);
    }

    function mint() public {
      _safeMint(msg.sender, 1);
    }
}