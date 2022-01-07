// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TokenABC.sol";
import "./TokenXYZ.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


contract TokenSwap {
    address payable admin;
    
    uint256 ratioAX;
    bool AcheaperthenX;
    uint256 fees;
    TokenABC public tokenABC;
    TokenXYZ public tokenXYZ;

    constructor(address _tokenABC, address _tokenXYZ) {
        admin = payable(msg.sender);
        tokenABC = TokenABC(_tokenABC);
        tokenXYZ = TokenXYZ(_tokenXYZ);
        
        tokenABC.approve(address(this), tokenABC.totalSupply());
        tokenXYZ.approve(address(this), tokenABC.totalSupply());
    }

    modifier onlyAdmin() {
        payable(msg.sender) == admin;
        _;
    }

    function setRatio(uint256 _ratio) public onlyAdmin {
        ratioAX = _ratio;
    }

    function getRatio() public view onlyAdmin returns (uint256) {
        return ratioAX;
    }

    function setFees(uint256 _Fees) public onlyAdmin {
        fees = _Fees;
    }

    function getFees() public view onlyAdmin returns (uint256) {
        return fees;
    }

    
    function swapTKA(uint256 amountTKA) public returns (uint256) {
        
        require(amountTKA > 0, "amountTKA must be greater then zero");
        require(
            tokenABC.balanceOf(msg.sender) >= amountTKA,
            "sender doesn't have enough Tokens"
        );

        uint256 exchangeA = uint256(mul(amountTKA, ratioAX));
        uint256 exchangeAmount = exchangeA -
            uint256((mul(exchangeA, fees)) / 100);
        require(
            exchangeAmount > 0,
            "exchange Amount must be greater then zero"
        );

        require(
            tokenXYZ.balanceOf(address(this)) > exchangeAmount,
            "currently the exchange doesnt have enough XYZ Tokens, please retry later :=("
        );

        tokenABC.transferFrom(msg.sender, address(this), amountTKA);
        tokenXYZ.approve(address(msg.sender), exchangeAmount);
        tokenXYZ.transferFrom(
            address(this),
            address(msg.sender),
            exchangeAmount
        );
        return exchangeAmount;
    }

    function swapTKX(uint256 amountTKX) public returns (uint256) {
        
        require(amountTKX >= ratioAX, "amountTKX must be greater then ratio");
        require(
            tokenXYZ.balanceOf(msg.sender) >= amountTKX,
            "sender doesn't have enough Tokens"
        );

        uint256 exchangeA = amountTKX / (ratioAX * 18/100);
        uint256 exchangeAmount = exchangeA - ((exchangeA * fees) / 100);

        require(
            exchangeAmount > 0,
            "exchange Amount must be greater then zero"
        );

        require(
            tokenABC.balanceOf(address(this)) > exchangeAmount,
            "currently the exchange doesnt have enough XYZ Tokens, please retry later :=("
        );
        tokenXYZ.transferFrom(msg.sender, address(this), amountTKX);
        tokenABC.approve(address(msg.sender), exchangeAmount);
        tokenABC.transferFrom(
            address(this),
            address(msg.sender),
            exchangeAmount
        );
        return exchangeAmount;
    }

    
    function buyTokensABC(uint256 amount) public payable onlyAdmin {
        tokenABC.buyTokens{value: msg.value}(amount);
    }

    function buyTokensXYZ(uint256 amount) public payable onlyAdmin {
        tokenXYZ.buyTokens{value: msg.value}(amount);
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}
