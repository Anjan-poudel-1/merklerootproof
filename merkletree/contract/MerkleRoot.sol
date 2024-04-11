// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Merkle {
    enum TypeOfUser {
        TEAM,
        OG,
        PUBLIC
    }

    bytes32 public teamMerkleRoot =
        0xea93c74c63808af9d3919c676a03392e13eb1232d0d40251202c56cff4842d33;
    bytes32 public ogMerkleRoot =
        0xa518422bbe7314d8eec3c38a6cc73011cbf40591d5fcc5897ca7d143f4135ca1;

    function checkAuthority(
        bytes32[] calldata _merkleProof,
        address _user
    ) public view returns (TypeOfUser) {
        // 1- team
        // 2- whitelisted
        // 3- public

        bytes32 leaf = keccak256(abi.encodePacked(_user));

        if (MerkleProof.verify(_merkleProof, teamMerkleRoot, leaf)) {
            return TypeOfUser.TEAM;
        } else if (MerkleProof.verify(_merkleProof, ogMerkleRoot, leaf)) {
            return TypeOfUser.OG;
        } else {
            return TypeOfUser.PUBLIC;
        }
    }
}
