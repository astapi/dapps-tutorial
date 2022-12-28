// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

contract TutorialToken is ERC721Enumerable, Ownable {
  uint256 private _tokenId;
  bytes32 private merkleRoot;
  bool private preSale;
  bool private publicSale;

  constructor() ERC721("MyCollectible", "MCO") {
    _tokenId = 1;
    preSale = false;
    publicSale = false;
  }

  function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
    console.logBytes32( _merkleRoot);
    merkleRoot = _merkleRoot;
  }

  function setPreSale(bool _preSale) external onlyOwner {
    console.log("setPreSale %s", _preSale);
    preSale = _preSale;
  }

  function setPublicSale(bool _publicSale) external onlyOwner {
    console.log("setPublicSale %s", _publicSale);
    publicSale = _publicSale;
  }

  function preMint(bytes32[] calldata proof) external returns (uint256) {
    require(preSale, "preSale is not active.");
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender))));
    require(MerkleProof.verify(proof, merkleRoot, leaf), "MerkleDistributor: Invalid proof.");
    uint256 nextTokenId = _tokenId++;
    console.log("next tokenId %s", nextTokenId);
    ERC721._safeMint(msg.sender, nextTokenId);
    return nextTokenId;
  }

  function mint() external returns (uint256) {
    require(publicSale, "publicSale is not active.");
    console.log("mint from %s", msg.sender);
    uint256 nextTokenId = _tokenId++;
    console.log("next tokenId %s", nextTokenId);
    ERC721._safeMint(msg.sender, nextTokenId);
    return nextTokenId;
  }
}