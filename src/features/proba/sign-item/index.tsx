import { Checkbox } from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { RootState } from '~app/store';
import { useSignProbaItemMutation } from '~entities/proba';
import toast from 'react-hot-toast';

interface SignProbaItemProps {
  userId: string;
  itemId: string;
  isCompleted: boolean;
  disabled?: boolean;
}

export const SignProbaItem = ({
  userId,
  itemId,
  isCompleted,
  disabled = false,
}: SignProbaItemProps) => {
  const [signProbaItem, { isLoading }] = useSignProbaItemMutation();
  const currentUser = useSelector((state: RootState) => state.session.user);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    if (!currentUser?.id) {
      toast.error('You must be logged in to sign items');
      return;
    }

    try {
      await signProbaItem({
        userId,
        itemId,
        foremanId: currentUser.id,
        status: !isCompleted,
      }).unwrap();

      toast.success(
        isCompleted ? 'Item unmarked successfully' : 'Item signed successfully'
      );
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to update item')
        : 'Failed to update item';
      toast.error(errorMessage);
    }
  };

  return (
    <Checkbox
      isSelected={isCompleted}
      isDisabled={disabled || isLoading}
      onChange={handleToggle}
      size="md"
      className="px-0"
    />
  );
};
