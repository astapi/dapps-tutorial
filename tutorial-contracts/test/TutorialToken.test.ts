import { assert, expect } from "chai";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

describe("TutorialTOken contract", function () {
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const TutorialToken = await ethers.getContractFactory("TutorialToken");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    const hardhatToken = await TutorialToken.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { TutorialToken, hardhatToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner",async () => {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
  });

  describe("setMerkleRoot", async () => {
    it("Should set the merkle root", async () => {
      const { hardhatToken } = await loadFixture(deployTokenFixture);
      const values = [['0x1111111111111111111111111111111111111111']];
      const tree = StandardMerkleTree.of(values, ["address"]);
      await hardhatToken.setMerkleRoot(tree.root);
    });

    it('owner以外からのリクエストはエラー', async () => {
      const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture);
      const values = [['0x1111111111111111111111111111111111111111']];
      const tree = StandardMerkleTree.of(values, ["address"]);
      try {
        await hardhatToken.connect(addr1).setMerkleRoot(tree.root);
        assert.fail("Expected an error but did not get one");
      } catch (e: any) {
        assert.include(e.message, 'Ownable: caller is not the owner');
      }
    })
  });

  describe("preMint", async () => {
    it ('preSaleがactiveでない場合はmintできない', async () => {
      const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture);
      const values = [[addr1.address]];
      const tree = StandardMerkleTree.of(values, ["address"]);
      await hardhatToken.setMerkleRoot(tree.root);
      try {
        await hardhatToken.connect(addr1).preMint(tree.getProof([addr1.address]));
        assert.fail("mintできたらだめ");
      } catch (e: any) {
        assert.include(e.message, 'preSale is not active');
      }
    });
    it('allowListに設定されている場合はmintできる', async () => {
      const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture);
      const values = [[addr1.address]];
      const tree = StandardMerkleTree.of(values, ["address"]);
      await hardhatToken.setMerkleRoot(tree.root);
      await hardhatToken.setPreSale(true);

      await hardhatToken.connect(addr1).preMint(tree.getProof([addr1.address]));
      // tokenのbalanceが1になっていること
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
    });
    it ('allowListに設定されていない場合はmintできない', async () => {
      const { hardhatToken, addr1, addr2 } = await loadFixture(deployTokenFixture);
      const values = [[addr1.address]];
      const tree = StandardMerkleTree.of(values, ["address"]);
      await hardhatToken.setMerkleRoot(tree.root);
      await hardhatToken.setPreSale(true);
      try {
        // addr2はtreeに含まれていないのでgetProofできないから[]を渡す
        await hardhatToken.connect(addr2).preMint([]);
      } catch (e: any) {
        assert.include(e.message, 'Invalid proof');
      }
    });
  });

  describe("mint", async () => {
    it ('publicSaleがactiveでない場合はmintできない', async () => {
      const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture);
      const values = [[addr1.address]];
      const tree = StandardMerkleTree.of(values, ["address"]);
      await hardhatToken.setMerkleRoot(tree.root);
      try {
        await hardhatToken.connect(addr1).mint();
        assert.fail("mintできたらだめ");
      } catch (e: any) {
        assert.include(e.message, 'publicSale is not active');
      }
    });
    it('mintできること', async () => {
      const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture);
      await hardhatToken.setPublicSale(true);
      await hardhatToken.connect(addr1).mint();
      // tokenのbalanceが1になっていること
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
    });
  });
});