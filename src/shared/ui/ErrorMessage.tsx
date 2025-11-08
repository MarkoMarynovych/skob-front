import { Card, CardBody } from '@nextui-org/react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => {
  return (
    <Card className={`border-danger ${className}`}>
      <CardBody>
        <p className="text-danger">{message}</p>
      </CardBody>
    </Card>
  );
};
