import { Card, CardBody } from '@nextui-org/react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <Card>
      <CardBody className="flex flex-col items-center justify-center py-12 px-6">
        {icon && (
          <div className="text-gray-400 mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 text-center mb-4">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </CardBody>
    </Card>
  );
};
