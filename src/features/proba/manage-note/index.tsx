import { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
  Card,
  CardBody,
} from '@nextui-org/react';
import { useUpdateProbaNoteMutation, ProbaNote } from '~entities/proba';
import toast from 'react-hot-toast';
import { IconNote } from '@tabler/icons-react';

interface ManageProbaNoteProps {
  progressId: string;
  notes?: ProbaNote[];
}

export const ManageProbaNote = ({
  progressId,
  notes = [],
}: ManageProbaNoteProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [noteText, setNoteText] = useState('');
  const [updateNote, { isLoading }] = useUpdateProbaNoteMutation();

  const handleSave = async () => {
    if (!noteText.trim()) {
      toast.error('Note text cannot be empty');
      return;
    }

    try {
      await updateNote({
        progressId,
        content: noteText.trim(),
      }).unwrap();

      toast.success('Note saved successfully');
      setNoteText('');
      onClose();
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to save note')
        : 'Failed to save note';
      toast.error(errorMessage);
    }
  };

  const handleOpen = () => {
    setNoteText('');
    onOpen();
  };

  const hasNotes = notes && notes.length > 0;

  return (
    <>
      <div className="relative">
        <Button
          isIconOnly
          size="sm"
          variant={hasNotes ? 'flat' : 'light'}
          color={hasNotes ? 'primary' : 'default'}
          onPress={handleOpen}
          aria-label="Manage note"
        >
          <IconNote size={18} />
        </Button>
        {hasNotes && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Manage Proba Notes
              </ModalHeader>
              <ModalBody>
                {hasNotes && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">Previous Notes:</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notes.map((note) => (
                        <Card key={note.id} className="bg-blue-50 border-l-4 border-blue-500">
                          <CardBody className="py-2 px-3">
                            <p className="text-sm">{note.content}</p>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                              <span>By: {note.createdBy.name}</span>
                              <span>•</span>
                              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                <Textarea
                  label="Add New Note"
                  placeholder="Enter your note for this proba item..."
                  value={noteText}
                  onValueChange={setNoteText}
                  minRows={4}
                  maxRows={8}
                  isDisabled={isLoading}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseModal}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isLoading}
                  isDisabled={!noteText.trim()}
                >
                  Save Note
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
