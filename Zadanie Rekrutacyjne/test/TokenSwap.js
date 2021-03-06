const TokenSwap = artifacts.require("./TokenSwap.sol");
const TokenA = artifacts.require("./TokenABC.sol");
const TokenX = artifacts.require("./TokenXYZ.sol");

contract("TokenSwap", (accounts) => {
  it("testing the swapTKA function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenXInstance = await TokenX.deployed();

    const result = await TokenSwapInstance.tokenABC.call();
    const receipt = await TokenSwapInstance.buyTokensABC(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });
    const receipt2 = await TokenSwapInstance.buyTokensXYZ(1000, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });

    const ratio = await TokenSwapInstance.setRatio(3);
    const fees = await TokenSwapInstance.setFees(30);

    
    const tokensBought = await TokenAInstance.buyTokens(10, {
      from: accounts[0],
      value: 1000 * 1000 + 2000,
    });

    
    const approve = await TokenAInstance.approve(TokenSwapInstance.address, 5);

    let allowanceValue = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValue, 5);

    const exchangeAmount = await TokenSwapInstance.swapTKA(5, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValueAfter, 0);

    const balanceOfX = await TokenXInstance.balanceOf(
      TokenSwapInstance.address
    );
    console.log("smart contract balance of token X: " + balanceOfX);
    assert.equal(balanceOfX, 989);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    console.log("smart contract balance of token A: " + balanceOfA);
    assert.equal(balanceOfA, 1005);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKX = await TokenXInstance.balanceOf.call(accounts[0]);
    console.log(balanceTKA);
    assert.equal(balanceTKA, 5);
    assert.equal(balanceTKX, 11);
  });

  it("testing the swapTKX function", async () => {
    const TokenSwapInstance = await TokenSwap.deployed();
    const TokenAInstance = await TokenA.deployed();
    const TokenXInstance = await TokenX.deployed();

    const ratio = await TokenSwapInstance.setRatio(3);

    const checkPre = await TokenXInstance.balanceOf.call(accounts[0]);
    assert.equal(checkPre, 11);
    
    const approve = await TokenXInstance.approve(TokenSwapInstance.address, 10);

    let allowanceValue = await TokenXInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValue, 10);

    const exchangeAmount = await TokenSwapInstance.swapTKX(10, {
      from: accounts[0],
    });

    let allowanceValueAfter = await TokenAInstance.allowance(
      accounts[0],
      TokenSwapInstance.address
    );
    assert.equal(allowanceValueAfter, 0);

    const balanceOfX = await TokenXInstance.balanceOf(
      TokenSwapInstance.address
    );
    console.log("balance of token X" + balanceOfX);
    assert.equal(balanceOfX, 999);

    const balanceOfA = await TokenAInstance.balanceOf(
      TokenSwapInstance.address
    );

    console.log("balance of token A" + balanceOfA);
    assert.equal(balanceOfA, 1002);

    const balanceTKA = await TokenAInstance.balanceOf.call(accounts[0]);
    const balanceTKX = await TokenXInstance.balanceOf.call(accounts[0]);
    console.log("balanceTKA::", balanceTKA);
    assert.equal(balanceTKA, 3);
    assert.equal(balanceTKX, 1);
  });
});
