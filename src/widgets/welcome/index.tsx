import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from '@nextui-org/react';
import { UserRole } from '~entities/user/model/types';
import { IconRocket, IconTrophy, IconUsers, IconChecklist } from '@tabler/icons-react';

interface WelcomeWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole: UserRole;
}

export const WelcomeWidget = ({ isOpen, onClose, userName, userRole }: WelcomeWidgetProps) => {
  const handleGetStarted = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    onClose();
  };

  const isScout = userRole === UserRole.SCOUT;
  const isForeman = userRole === UserRole.FOREMAN;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleGetStarted}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-2 pb-2">
          <div className="flex items-center gap-3">
            <IconRocket size={32} className="text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Welcome to Plast-Proba!</h2>
              <p className="text-sm font-normal text-gray-500">Hello, {userName}</p>
            </div>
          </div>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <p className="text-gray-700">
                <span className="font-semibold">Plast-Proba</span> is your digital companion for tracking
                scout achievements and progress through various tasks and challenges.
              </p>
            </div>

            {isScout && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IconTrophy size={22} className="text-warning" />
                  As a Scout, you can:
                </h3>
                <ul className="space-y-3 ml-2">
                  <li className="flex items-start gap-3">
                    <IconChecklist size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">View Your Progress:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        See all your Probas (achievements) organized by category and track what you have completed.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconUsers size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Work with Your Foreman:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Your Foreman will review your achievements and mark them as complete when you have demonstrated mastery.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {isForeman && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IconUsers size={22} className="text-success" />
                  As a Foreman, you can:
                </h3>
                <ul className="space-y-3 ml-2">
                  <li className="flex items-start gap-3">
                    <IconUsers size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Manage Your Group:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Create groups, invite scouts, and organize your team effectively.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconChecklist size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Track Scout Progress:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Review and sign off on scout achievements, add notes, and provide guidance.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconTrophy size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Support Growth:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Help scouts achieve their goals and develop their skills through structured progression.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            <Divider />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 flex items-start gap-2">
                <IconRocket size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>
                  Ready to begin your journey? Click <span className="font-semibold">Get Started</span> below
                  to explore your dashboard!
                </span>
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            size="lg"
            onPress={handleGetStarted}
            className="w-full"
            startContent={<IconRocket size={20} />}
          >
            Get Started
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
