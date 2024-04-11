const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { ogWhitelist, teamWhitelist } = require("./addresses");
const fs = require("fs");
const path = require("path");

const generateMerkleRootHash = () => {
    // For team addresses
    let teamHash = getRootHash(teamWhitelist);
    let ogHash = getRootHash(ogWhitelist);

    console.log(`Team Merkle Root: 0x${teamHash}`);
    console.log(`OG Merkle Root: 0x${ogHash}`);

    const jsonData = JSON.stringify({
        teamHash: `0x${teamHash}`,
        ogHash: `0x${ogHash}`,
    });

    // Write JSON string to file
    fs.writeFileSync(path.join(__dirname, "merkleRoots.json"), jsonData);
};

const getRootHash = (addresses) => {
    const leaves = addresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getRoot().toString("hex");
    return rootHash;
};

generateMerkleRootHash();
