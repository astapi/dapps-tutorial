import { useModal } from 'react-hooks-use-modal';
import React from 'react';
import { useAllowList } from '../hooks/useAllowList'; 

export const useRequestAllowListFormModal= () => {
  const [Modal, open, close, isOpen] = useModal('__next');
  const { sendRequestAllowList } = useAllowList();

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '60px 100px',
    borderRadius: '10px',
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      address: { value: string };
      email: { value: string };
    };
    const address = target.address.value;
    const email = target.email.value;
    await sendRequestAllowList(address, email);
    close();
  };

  function RequestAllowListFormModal() {
    return (
      <Modal>
        <div style={modalStyle}>
            <form onSubmit={onSubmit} className="flex flex-col">
            <input id="address" type="text" placeholder="Address" className="p-2 border rounded soild"/>
            <input id="email" type="text" placeholder="hogemoge@example.com" className="p-2 mt-4 border rounded solid" />
            <button className="p-2 mt-4 text-white bg-blue-400 border border-solid rounded">申し込み</button>
            </form>
        </div>
      </Modal>
    );
  }
  return {
    RequestAllowListFormModal,
    openRequestAllowListFormModal: open,
    closeRequestAllowListFormModal: close,
  }
}