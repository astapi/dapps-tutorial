import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import TutorialTokenArtifact from "../../frontend/contracts/TutorialToken.json";
import Address from "../../frontend/contracts/contract-address.json";
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

task('setMerkleRoot', 'set preSale')
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    const app = initializeApp({
      credential: cert('path to json')
    });
    const firestore = getFirestore(app);
    const collectionRef = firestore.collection('allowList');
    const documentRefs = await collectionRef.listDocuments();
    const treeValues = [];
    for (const document of documentRefs) {
      const documentSnapshot = await document.get();
      const data = documentSnapshot.data()
      if (!data) continue;
      treeValues.push([data.address]);
    }
    const tree = StandardMerkleTree.of(treeValues, ["address"]);

    const tutorialToken = await hre.ethers.getContractAt(TutorialTokenArtifact.abi, Address.TutorialToken);

    const transaction = await tutorialToken.setMerkleRoot(tree.root);
    console.log(transaction);
  });
