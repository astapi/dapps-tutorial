import { db } from '../lib/firebase';
import { doc, setDoc } from "firebase/firestore"; 

type useAllowListType = () => {
  sendRequestAllowList: (address: string, mailaddress: string) => Promise<void>;
}

export const useAllowList: useAllowListType = () => {
  async function sendRequestAllowList(address: string, mailaddress: string): Promise<void> {
    await setDoc(doc(db, "allowList", address), {
      address,
      mailaddress,
    });
  }

  return {
    sendRequestAllowList,
  }
};
