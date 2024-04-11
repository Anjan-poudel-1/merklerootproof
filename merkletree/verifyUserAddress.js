const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
require("dotenv").config();
const { Web3 } = require("web3");
const MerkleABI = require("./contract/Merkle.json");

const merkleDeployedAddress = "0xf40d8B8BB9c66Eb1022C512202BdB6ED4158A776";
const { ogWhitelist, teamWhitelist } = require("./addresses");

const teamHash =
    "0xea93c74c63808af9d3919c676a03392e13eb1232d0d40251202c56cff4842d33";
const ogHash =
    "0xa518422bbe7314d8eec3c38a6cc73011cbf40591d5fcc5897ca7d143f4135ca1";

const getProof = async (account) => {
    const leafNodeTeam = teamWhitelist.map((addr) => keccak256(addr));

    const tempmerkleTreeTeam = new MerkleTree(leafNodeTeam, keccak256, {
        sortPairs: true,
    });

    const leafNodeOg = ogWhitelist.map((addr) => keccak256(addr));
    const tempmerkleTreeOg = new MerkleTree(leafNodeOg, keccak256, {
        sortPairs: true,
    });

    const roothashTeam = tempmerkleTreeTeam.getHexRoot();

    const roothashOg = tempmerkleTreeOg.getHexRoot();
    console.log("roothashOg", roothashOg);
    let leaf = keccak256(account);

    let proof = [];
    let ogProof = [];
    let teamProof = [];

    if (roothashTeam == teamHash) {
        teamProof = tempmerkleTreeTeam.getHexProof(leaf);
    }
    if (roothashOg == ogHash) {
        ogProof = tempmerkleTreeOg.getHexProof(leaf);
    }

    if (ogProof.length > 0) {
        proof = ogProof;
    } else if (teamProof.length > 0) {
        proof = teamProof;
    }

    // console.log(proof,roothashTeam,account)
    // console.log(MerkleTree.verify(proof,roothashTeam,account));

    return proof;
};

const main = async () => {
    let userAddress = "0xf40d8B8BB9c66Eb1022C512202BdB6ED4158A776";
    let proof = await getProof(userAddress);
    console.log("proof", proof);

    const web3 = new Web3(
        "https://base-sepolia.g.alchemy.com/v2/amBmHziMqh94m4lh2y2LUesajJMTBvsn"
    );
    const { address } = web3.eth.accounts.wallet.add(
        process.env.PRIVATE_KEY
    )[0];
    web3.eth.defaultBlock = "finalized";
    const contract = new web3.eth.Contract(MerkleABI, merkleDeployedAddress);

    const authority = await contract.methods
        .checkAuthority(proof, userAddress)
        .call();

    console.log("authority is ", authority);
};

main();
