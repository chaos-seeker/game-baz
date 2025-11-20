import { Modal } from '@/components/modal';
import { useModal } from '@/hooks/modal';
import { TGuessPicture } from '@/types/guess-picture';
import { ReactNode } from 'react';

interface IModalItemProps {
  modalKey: string;
  item?: TGuessPicture;
  mode: 'edit' | 'add';
  btn?: ReactNode;
}

export const ModalItem = (props: IModalItemProps) => {
  const modal = useModal(props.modalKey);
  const handleBtnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.show();
  };

  return (
    <>
      {props.btn && <div onClick={handleBtnClick}>{props.btn}</div>}
      <Modal
        isOpen={modal.isShow}
        onClose={modal.hide}
        className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px]"
        title={props.mode === 'edit' ? 'ویرایش' : 'افزودن'}
      >
        <p>hello world!</p>
      </Modal>
    </>
  );
};
