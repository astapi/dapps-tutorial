import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import TutorialTokenArtifact from "../../frontend/contracts/TutorialToken.json";
import Address from "../../frontend/contracts/contract-address.json";

task('setPreSale', 'set preSale')
  .addParam('preSale', 'true or false')
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    const tutorialToken = await hre.ethers.getContractAt(TutorialTokenArtifact.abi, Address.TutorialToken);
    const presale = JSON.parse(args.preSale.toLowerCase());
    const transaction = await tutorialToken.setPreSale(presale);
    console.log(hre.network);
    console.log(transaction);
    console.log('preSale is set to ' + presale);
});

task('setPublicSale', 'set preSale')
  .addParam('publicSale', 'true or false')
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    const tutorialToken = await hre.ethers.getContractAt(TutorialTokenArtifact.abi, Address.TutorialToken);
    const publicSale = JSON.parse(args.publicSale.toLowerCase());
    await tutorialToken.setPublicSale(publicSale);
    console.log('publicSale is set to ' + publicSale);
});