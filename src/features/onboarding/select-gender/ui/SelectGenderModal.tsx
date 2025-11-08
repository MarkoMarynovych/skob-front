import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@nextui-org/react';
import { useState } from 'react';
import { useUpdateUserMutation } from '~entities/user/api/userApi';
import { useInitializeProbasMutation } from '~entities/proba/api/probaApi';
import { toast } from 'react-hot-toast';

interface SelectGenderModalProps {
  isOpen: boolean;
  userId: string;
  email: string;
}

export const SelectGenderModal = ({ isOpen, userId, email }: SelectGenderModalProps) => {
  const [updateUser] = useUpdateUserMutation();
  const [initializeProbas] = useInitializeProbasMutation();
  const [isLoading, setIsLoading] = useState(false);

  console.log('[SelectGenderModal] Rendered with:', { isOpen, userId, email });

  const handleGenderSelect = async (sex: 'MALE' | 'FEMALE') => {
    console.log('[SelectGenderModal] Gender selected:', sex);
    setIsLoading(true);
    try {
      console.log('[SelectGenderModal] Calling updateUser with:', { email, sex });
      const updateResult = await updateUser({ email, data: { sex } }).unwrap();
      console.log('[SelectGenderModal] updateUser success:', updateResult);

      console.log('[SelectGenderModal] Calling initializeProbas with userId:', userId);
      const initResult = await initializeProbas(userId).unwrap();
      console.log('[SelectGenderModal] initializeProbas success:', initResult);

      toast.success('Ваш профіль налаштовано! Завантаження даних...');
    } catch (error) {
      console.error('[SelectGenderModal] Error:', error);
      toast.error('Виникла помилка. Спробуйте ще раз.');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false}
      hideCloseButton={true}
      size="md"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Ласкаво просимо!</h2>
        </ModalHeader>
        <ModalBody className="py-6">
          <p className="text-center mb-6 text-gray-600">
            Для початку роботи, будь ласка, виберіть вашу стать:
          </p>
          <div className="flex flex-col gap-3">
            <Button
              color="primary"
              size="lg"
              className="font-semibold"
              isLoading={isLoading}
              onPress={() => handleGenderSelect('MALE')}
            >
              Я хлопець
            </Button>
            <Button
              color="secondary"
              size="lg"
              className="font-semibold"
              isLoading={isLoading}
              onPress={() => handleGenderSelect('FEMALE')}
            >
              Я дівчина
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
