import {expect, assert} from "chai";
import { AddressLike, ContractTransactionResponse, Typed} from "ethers";
import {ethers} from "hardhat";
import {address} from "hardhat/internal/core/config/config-validation";
import {TokenA, TokenB, TokenSwap} from "../typechain-types";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";


describe("Token Swap", async () => {
    let signers: HardhatEthersSigner[] | { address: Typed | AddressLike; }[];
    let tokenA: TokenA & { deploymentTransaction(): ContractTransactionResponse; };
    let tokenB: TokenB & { deploymentTransaction(): ContractTransactionResponse; };
    let tokenSwapAddr;
    let tokenSwap: TokenSwap & { deploymentTransaction(): ContractTransactionResponse; };
    let ONE_MILLION_TOKENS = BigInt(1000000e18);
    let THOUSAND_TOKENS = BigInt(1000e18);
    let HUNDRED_TOKENS = BigInt(100e18);

    describe("Deployment test", async () => {
        it('should deploy', async () => {
            const [owner, accountA, accountB] = await ethers.getSigners();
            signers = [owner, accountA, accountB];

            const TokenA = await ethers.getContractFactory("TokenA");
            tokenA = await TokenA.deploy("DollarTK", "DTK", signers[0].address, ONE_MILLION_TOKENS);
            await tokenA.waitForDeployment();

            const TokenB = await ethers.getContractFactory("TokenB");
            tokenB = await TokenB.deploy("NairaTK", "NTK", signers[0].address, ONE_MILLION_TOKENS);
            await tokenB.waitForDeployment();

            const TokenSwap = await ethers.getContractFactory("TokenSwap");
            tokenSwap = await TokenSwap.deploy(tokenA.target, tokenB.target, BigInt(1));
            await tokenSwap.waitForDeployment();

            tokenSwapAddr = tokenSwap.target;

            console.log(`Token A address: ${tokenA.target}`);
            console.log(`Token B address: ${tokenB.target}`);
            console.log(`Token Swap address: ${tokenSwapAddr}`);
            typeof expect(tokenSwapAddr).to.be.properAddress;
        });
    });

    describe("Deployer's balance test", async () => {
        describe("Token A", async () => {
            it('should return deployer\'s balance of TokenA', async () => {
                const deployerBal = (await tokenA.balanceOf(signers[0].address)).toString();

                console.log(`Deployer\'s TokenA balance: ${deployerBal}`)
                expect(deployerBal === `${ONE_MILLION_TOKENS}`);
            });
        });

        describe("Token B", async () => {
            it('should return deployer\'s balance of TokenB', async () => {
                const deployerBal = (await tokenB.balanceOf(signers[0].address)).toString();

                console.log(`Deployer\'s TokenB balance: ${deployerBal}`)
                expect(deployerBal === `${ONE_MILLION_TOKENS}`);
            });
        });
    });

    describe("Contract's balance test", async () => {
        it("should return contract's balance of Token A", async () => {
            const tokenSwapBal = await tokenSwap.checkContractBalance();
            const [tokenSwapBalA, tokenSwapBalB] = tokenSwapBal;

            console.log(`TokenA bal: ${tokenSwapBalA}`);
            console.log(`TokenB bal: ${tokenSwapBalB}`);

            expect(`${tokenSwapBalA}` === `${HUNDRED_TOKENS}` && `${tokenSwapBalB}` === `${HUNDRED_TOKENS}`);
        });
    });
});