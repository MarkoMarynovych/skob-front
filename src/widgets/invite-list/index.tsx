import { Card, CardBody, CardHeader, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider } from '@nextui-org/react';
import { useGetForemansInvitesQuery, InviteStatus } from '~entities/invite';
import { LoadingSpinner, ErrorMessage } from '~shared/ui';
import { IconMail, IconCalendar } from '@tabler/icons-react';

export const InviteListWidget = () => {
  const { data: invites, isLoading, error } = useGetForemansInvitesQuery();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody>
          <LoadingSpinner message="Loading invitations..." size="md" />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody>
          <ErrorMessage message="Failed to load invitations" />
        </CardBody>
      </Card>
    );
  }

  if (!invites || invites.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sent Invitations</h2>
        </CardHeader>
        <Divider />
        <CardBody className="p-8 text-center">
          <p className="text-gray-500">No invitations sent yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Invite scouts to your group using the form above
          </p>
        </CardBody>
      </Card>
    );
  }

  const getStatusColor = (status: InviteStatus) => {
    switch (status) {
      case InviteStatus.PENDING:
        return 'warning';
      case InviteStatus.ACCEPTED:
        return 'success';
      case InviteStatus.EXPIRED:
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: InviteStatus) => {
    switch (status) {
      case InviteStatus.PENDING:
        return 'Pending';
      case InviteStatus.ACCEPTED:
        return 'Accepted';
      case InviteStatus.EXPIRED:
        return 'Expired';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
        <h2 className="text-xl font-semibold">Sent Invitations</h2>
        <p className="text-sm text-gray-500">{invites.length} invitation{invites.length !== 1 ? 's' : ''} sent</p>
      </CardHeader>
      <Divider className="my-4" />
      <CardBody className="p-0">
        <div className="hidden md:block">
          <Table removeWrapper aria-label="Invitations table">
            <TableHeader>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>GROUP</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>SENT DATE</TableColumn>
              <TableColumn>EXPIRES</TableColumn>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconMail size={16} className="text-gray-400" />
                      <span className="text-sm">{invite.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{invite.groupName || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={getStatusColor(invite.status)}
                      variant="flat"
                    >
                      {getStatusLabel(invite.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{formatDate(invite.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconCalendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(invite.expiresAt)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden px-4 pb-4 space-y-3">
          {invites.map((invite) => (
            <Card key={invite.id} shadow="sm">
              <CardBody className="gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <IconMail size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{invite.email}</span>
                  </div>
                  <Chip
                    size="sm"
                    color={getStatusColor(invite.status)}
                    variant="flat"
                  >
                    {getStatusLabel(invite.status)}
                  </Chip>
                </div>

                {invite.groupName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Group:</span>
                    <span>{invite.groupName}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>Sent:</span>
                    <span>{formatDate(invite.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconCalendar size={14} />
                    <span>Expires:</span>
                    <span>{formatDate(invite.expiresAt)}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
