// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./libs/Base64.sol";
import "../node_modules/hardhat/console.sol";

contract Marketplace is ERC721 {
    struct NFTAttributes {
        string name;
        string imageURL;
        string description;
        uint likes;
        bool isLiked;
    }

    NFTAttributes[] NFTArray;

    mapping(address => uint256[]) public useToLikedList;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("NFTCollections", "nft") {
        console.log("NFT Collections Contract");
    }

    event NewNFTMinted(address sender, uint256 tokenId, uint256 likes, bool isLiked);
    event NewLike(address sender, uint256 tokenId, uint256 likes, bool isLiked);

    function mintNFT(string memory name, string memory imageURI, string memory description) public {
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        NFTArray.push(NFTAttributes({
            name: name,
            imageURL: imageURI,
            description: description,
            likes: 0,
            isLiked: false
        }));

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newTokenId,
            msg.sender
        );

        _tokenIds.increment();

        emit NewNFTMinted(msg.sender, newTokenId, 0, false);
    }

    function like(uint256 tokenId) public {
        for (uint256 i = 0; i < useToLikedList[msg.sender].length; i++) {
            uint256 likedIndex = useToLikedList[msg.sender][i];
            require(likedIndex != tokenId, "You already liked this post");
        }

        NFTArray[tokenId].likes++;
        useToLikedList[msg.sender].push(tokenId);

        NFTAttributes[] memory response = NFTArray;
        response[tokenId].isLiked = true;

        emit NewLike(msg.sender, tokenId, response[tokenId].likes, response[tokenId].isLiked);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory){
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        NFTArray[_tokenId].name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "',
                        NFTArray[_tokenId].description,
                        '", "image": "ipfs://',
                        NFTArray[_tokenId].imageURL,
                        '"}'
                    )
                )
            )
        );
        string memory output = string (
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }

    function getAllNFTs() public view returns (NFTAttributes[] memory) {
        NFTAttributes[] memory allNFTs = NFTArray;
        return allNFTs;
    }
}