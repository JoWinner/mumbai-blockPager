// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./BokkyPooBahsDateTimeLibrary.sol";
import "hardhat/console.sol";

contract BlockPager is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 personalFee = 0.02 ether;
    uint256 featuredFee = 1 ether;
    address payable contractOwner;

    struct Content {
        uint256 tokenId;
        address payable creator;
        address payable viewer;
        uint256 numTransfers;
        uint256 numReads;
        uint256 numViews;
        uint256 price;
        bool isPublic;
        bool hasPaid;
        bool isFeatured;
        uint256 createdAt;
        uint256 maxReads;
    }

    struct UserAccount {
        string accountCID;
        address userWallet;
        uint256 userIdNum;
        bool exists;
    }

    struct UserPicture {
        string pictureCID;
    }

    uint256[] private _featuredTokenIds;
    uint256[] private _publicTokenIds;
    mapping(uint256 => Content) private _contents;

    mapping(address => uint256[]) private _privateContentsOwnedByUser;

    mapping(address => uint256[]) private _publicContentsOwnedByUser;

    mapping(address => uint256[]) private _viewerPaidContents;

    mapping(uint256 => address[]) private publicItemViewers;

    mapping(address => UserAccount) public _accounts;
    mapping(address => UserPicture) public _picture;

    uint256 public userCount;

    // set the owner of the contract
    constructor() ERC721("Pager", "PGR") {
        contractOwner = payable(msg.sender);
    }

    //Set new owner of the contract
    function setContractOwner(address newOwner) public {
        require(
            msg.sender == contractOwner,
            "Only the current owner can set a new owner"
        );
        require(newOwner != address(0), "Invalid new owner address");
        contractOwner = payable(newOwner);
    }

    // Function to get the contract owner's address
    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function createOrUpdateAccount(
        string memory newAccountCID
    ) external nonReentrant {
        require(
            bytes(newAccountCID).length > 0,
            "New account CID is required."
        );

        if (_accounts[msg.sender].exists) {
            _accounts[msg.sender].accountCID = newAccountCID;
        } else {
            _accounts[msg.sender].accountCID = newAccountCID;
            _accounts[msg.sender] = UserAccount(
                newAccountCID,
                msg.sender,
                userCount + 1,
                true
            );
            userCount++;
        }
    }

    function getUserAccount()
        external
        view
        returns (string memory, address, uint256, bool)
    {
        UserAccount storage userAccount = _accounts[msg.sender];
        require(userAccount.exists, "Account does not exist");
        return (
            userAccount.accountCID,
            userAccount.userWallet,
            userAccount.userIdNum,
            userAccount.exists
        );
    }

    function updatePicture(string memory newPictureCID) external nonReentrant {
        require(
            bytes(newPictureCID).length > 0,
            "New account CID is required."
        );
        require(_accounts[msg.sender].exists, "Account does not exist");

        _picture[msg.sender].pictureCID = newPictureCID;
    }

    function getPicture() external view returns (string memory) {
        require(_accounts[msg.sender].exists, "User account does not exist");
        return _picture[msg.sender].pictureCID;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function totalPrivateItems() public view returns (uint256) {
        uint256 privateItemCount = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (!_contents[i].isPublic) {
                privateItemCount++;
            }
        }
        return privateItemCount;
    }

    /* Updates the personal content Fee of the contract */
    function updatePersonalFee(uint _personalFee) public payable nonReentrant {
        require(contractOwner == msg.sender, "Only owner can update fee.");
        personalFee = _personalFee;
    }

    function updateFeaturedFee(uint _featuredFee) public payable nonReentrant {
        require(contractOwner == msg.sender, "Only owner can update fee.");
        featuredFee = _featuredFee;
    }

    /* Returns a tuple of all three fees */
    function getFees() public view returns (uint256, uint256) {
        return (personalFee, featuredFee);
    }

    function withdrawFunds(address payable recipient) external nonReentrant {
        require(
            msg.sender == contractOwner,
            "Only contract owner can withdraw fees"
        );
        require(address(this).balance > 0, "No funds available to withdraw");
        recipient.transfer(address(this).balance);
    }

    event PublicItemViewed(
        uint256 indexed tokenId,
        address viewer,
        uint256 price,
        bool hasPaid
    );

    event PublicItemCreated(
        uint256 indexed tokenId,
        address creator,
        address viewer,
        uint256 price,
        bool isPublic
    );

    event PersonalContentCreated(
        uint256 indexed tokenId,
        address creator,
        uint256 numTransfers,
        uint256 numReads
    );

    event FeaturedItemCreated(
        uint256 indexed tokenId,
        address creator,
        address viewer,
        uint256 price,
        bool isPublic,
        bool isFeatured
    );

    event ContentTransferred(
        address from,
        address receiver,
        uint256 indexed tokenId
    );

    event ContentRead(uint256 indexed tokenId);
    event ContentBurned(uint256 indexed tokenId);

    function getCreationDate(
        uint256 tokenId
    )
        public
        view
        returns (
            uint year,
            uint month,
            uint day,
            uint hour,
            uint minute,
            uint second
        )
    {
        require(_exists(tokenId), "Token ID does not exist");

        (year, month, day, hour, minute, second) = BokkyPooBahsDateTimeLibrary
            .timestampToDateTime(_contents[tokenId].createdAt);
    }

    function createPrivateContent(
        string memory tokenURI,  uint256 maxReads
    ) public payable nonReentrant returns (uint) {
        // require payment Personal content Fee
        require(msg.value == personalFee, "Insufficient balance");
        require(_accounts[msg.sender].exists, "Account does not exist");
        require(
            bytes(_picture[msg.sender].pictureCID).length > 0,
            "Your Profile is incomplete"
        );

  // Set default maxReads value if not provided by the user
    if (maxReads == 0) {
        maxReads = 6; // Set your desired default value here
    }

        // increment token IDs
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        // mint token and set token URI
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // update content information
        _contents[tokenId] = Content(
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            0,
            0,
            0,
            0,
            false,
            true,
            false,
            block.timestamp,
            maxReads
        );

        // update mapping
        _privateContentsOwnedByUser[msg.sender].push(tokenId);

        emit PersonalContentCreated(tokenId, msg.sender, 0, 0);

        // return token ID
        return tokenId;
    }

    function createPublicItem(
        string memory tokenURI,
        uint256 price
    ) public payable nonReentrant returns (uint) {
        require(price > 0, "price must be greater than 0 wei");
        require(_accounts[msg.sender].exists, "Account does not exist");
        require(
            bytes(_picture[msg.sender].pictureCID).length > 0,
            "Your Profile is incomplete"
        );

        // increment token IDs
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        _contents[tokenId] = Content(
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            0,
            0,
            0,
            price,
            true,
            false,
            false,
            block.timestamp,
           0
        );

        _publicTokenIds.push(tokenId);

        // update mapping
        _publicContentsOwnedByUser[msg.sender].push(tokenId);

        emit PublicItemCreated(tokenId, msg.sender, address(0), price, true);

        return tokenId;
    }

    function createFeaturedItem(
        string memory tokenURI,
        uint256 price
    ) public payable nonReentrant returns (uint) {
        require(msg.value == featuredFee, "Insufficient balance");
        require(price > 0, "price must be greater than 0 wei");
        require(_accounts[msg.sender].exists, "Account does not exist");
        require(
            bytes(_picture[msg.sender].pictureCID).length > 0,
            "Your Profile is incomplete"
        );
        // increment token IDs
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        _contents[tokenId] = Content(
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            0,
            0,
            0,
            price,
            true,
            false,
            true,
            block.timestamp,
            0
        );

        _publicTokenIds.push(tokenId);
        _featuredTokenIds.push(tokenId);

        // update mapping
        _publicContentsOwnedByUser[msg.sender].push(tokenId);

        emit FeaturedItemCreated(
            tokenId,
            msg.sender,
            address(0),
            price,
            true,
            true
        );

        return tokenId;
    }

    function getUserStats(
        address creator
    ) external view returns (uint256, uint256, uint256) {
        uint256 numPublicItems = _publicContentsOwnedByUser[creator].length;
        uint256 totalViews = 0;
        uint256 totalEarnings = 0;

        for (uint256 i = 0; i < numPublicItems; i++) {
            uint256 tokenId = _publicContentsOwnedByUser[creator][i];
            Content storage content = _contents[tokenId];
            totalViews += content.numViews;
            if (content.hasPaid) {
                totalEarnings += content.price;
            }
        }

        return (numPublicItems, totalViews, totalEarnings);
    }

    function fetchPrivateContents() public view returns (Content[] memory) {
        uint256 tokenCount = _privateContentsOwnedByUser[msg.sender].length;
        Content[] memory contents = new Content[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = _privateContentsOwnedByUser[msg.sender][i];
            contents[i] = _contents[tokenId];
        }

        return contents;
    }

    function fetchMyPublishedItems() public view returns (Content[] memory) {
        uint256 tokenCount = _publicContentsOwnedByUser[msg.sender].length;
        Content[] memory contents = new Content[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = _publicContentsOwnedByUser[msg.sender][i];
            contents[i] = _contents[tokenId];
        }

        return contents;
    }

    function fetchFeaturedItems() public view returns (Content[] memory) {
        uint256 tokenCount = _featuredTokenIds.length;
        Content[] memory contents = new Content[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = _featuredTokenIds[i];
            contents[i] = _contents[tokenId];
        }

        return contents;
    }

    function fetchAllContents() public view returns (Content[] memory) {
        uint256 tokenCount = _publicTokenIds.length;
        Content[] memory publicContents = new Content[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = _publicTokenIds[i];
            publicContents[i] = _contents[tokenId];
        }

        return publicContents;
    }

    function fetchPaidItems() public view returns (Content[] memory) {
        uint256 tokenCount = _viewerPaidContents[msg.sender].length;
        Content[] memory paidContents = new Content[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = _viewerPaidContents[msg.sender][i];
            paidContents[i] = _contents[tokenId];
        }

        return paidContents;
    }

    function viewPublicItem(uint256 tokenId) public view returns (bool) {
        Content storage content = _contents[tokenId];

        // Check if the caller is the content creator
        if (msg.sender == content.creator) {
            return true;
        }

        // Check if the caller has already viewed the content
        for (uint i = 0; i < publicItemViewers[tokenId].length; i++) {
            if (msg.sender == publicItemViewers[tokenId][i]) {
                return true;
            }
        }

        return false;
    }

    function viewPublicItemForFree(
        uint256 tokenId
    ) public nonReentrant returns (Content memory) {
        Content storage content = _contents[tokenId];
        require(content.isPublic, "Item is not public");

        // check if viewer is the creator
        if (msg.sender == content.creator) {
            return content;
        }

        for (uint i = 0; i < publicItemViewers[tokenId].length; i++) {
            if (msg.sender == publicItemViewers[tokenId][i]) {
                content.numViews++;

                return content;
            }
        }

        revert("Viewer is not authorized to view this item");
    }

    function viewPublicItemWithPayment(
        uint256 tokenId
    ) public payable nonReentrant returns (Content memory) {
        Content storage content = _contents[tokenId];
        require(content.isPublic, "Item is not public");

        require(
            msg.sender != content.creator,
            "Creator cannot pay to view their own item."
        );
        for (uint i = 0; i < publicItemViewers[tokenId].length; i++) {
            require(
                msg.sender != publicItemViewers[tokenId][i],
                "Viewer has already paid to view this item."
            );
        }
        // check that the viewer has paid the required amount
        require(msg.value == content.price, "Incorrect payment amount.");

        // Calculate the amount to be paid to the creator
        uint256 creatorPayment = (content.price * 93) / 100;

        // transfer payment to creator
        content.creator.transfer(creatorPayment);

        // update content information
        content.hasPaid = true;
        content.viewer = payable(msg.sender);
        content.numViews++;

        // update mapping
        publicItemViewers[tokenId].push(msg.sender);
        _viewerPaidContents[msg.sender].push(tokenId);
        return content;
    }

    function transferContent(
        address payable receiver,
        uint256 tokenId
    ) external nonReentrant {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only owner can transfer pager"
        );
        require(
            _contents[tokenId].numTransfers == 0,
            "Pager already been transferred(1)"
        );

        _safeTransfer(msg.sender, receiver, tokenId, "");

        // update content ownership
        uint256[] storage ownerTokens = _privateContentsOwnedByUser[msg.sender];
        for (uint256 i = 0; i < ownerTokens.length; i++) {
            if (ownerTokens[i] == tokenId) {
                ownerTokens[i] = ownerTokens[ownerTokens.length - 1];
                ownerTokens.pop();
                break;
            }
        }
        _privateContentsOwnedByUser[receiver].push(tokenId);

        _contents[tokenId].creator = receiver;
        _contents[tokenId].numTransfers += 1;

        emit ContentTransferred(msg.sender, receiver, tokenId);
    }

    function readContent(uint256 tokenId) public nonReentrant returns (Content memory) {
        Content storage content = _contents[tokenId];

        require(
            ownerOf(tokenId) == msg.sender,
            "Only owner can read this pager"
        );
        require(content.numReads < content.maxReads, "Maximum reads reached");

        content.numReads += 1;

        emit ContentRead(tokenId);

        if (content.numReads == content.maxReads) {
            uint256[] storage ownerTokens = _privateContentsOwnedByUser[
                msg.sender
            ];
            for (uint256 i = 0; i < ownerTokens.length; i++) {
                if (ownerTokens[i] == tokenId) {
                    ownerTokens[i] = ownerTokens[ownerTokens.length - 1];
                    ownerTokens.pop();
                    break;
                }
            }

            _burn(tokenId);
            delete _contents[tokenId];

            emit ContentBurned(tokenId);
        }

        return content;
    }

    function burnContent(uint256 tokenId) external nonReentrant {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only owner can burn this pager"
        );

        // remove token from owner's list
        uint256[] storage ownerTokens = _privateContentsOwnedByUser[msg.sender];
        for (uint256 i = 0; i < ownerTokens.length; i++) {
            if (ownerTokens[i] == tokenId) {
                ownerTokens[i] = ownerTokens[ownerTokens.length - 1];
                ownerTokens.pop();
                break;
            }
        }

        _burn(tokenId);
        delete _contents[tokenId];

        emit ContentBurned(tokenId);
    }
}
