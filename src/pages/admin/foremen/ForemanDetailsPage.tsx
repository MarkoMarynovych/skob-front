import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Chip,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  Avatar,
} from '@nextui-org/react';
import { useGetForemanDetailsQuery } from '~entities/user/api/userApi';
import { MainLayout } from '~widgets/layout';
import { ErrorMessage } from '~shared/ui';
import {
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
  IconChevronRight,
} from '@tabler/icons-react';

interface ForemanDetailsPageProps {
  basePath?: string;
}

export const ForemanDetailsPage = ({ basePath }: ForemanDetailsPageProps) => {
  const { foremanId, kurinId } = useParams<{ foremanId: string; kurinId: string }>();
  const navigate = useNavigate();
  const location = window.location.pathname;
  const resolvedBasePath = basePath || (location.includes('/liaison/') ? '/liaison' : '/admin');

  const { data: foreman, isLoading, isError, error } = useGetForemanDetailsQuery(foremanId || '', {
    skip: !foremanId,
  });

  const handleGroupClick = (groupId: string) => {
    navigate(`${resolvedBasePath}/kurins/${kurinId}/foremen/${foremanId}/groups/${groupId}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading foreman details..." />
        </div>
      </MainLayout>
    );
  }

  if (isError || !foreman) {
    const errorMessage = error && 'data' in error
      ? (error.data as { message?: string })?.message || 'Failed to load foreman details'
      : 'Failed to load foreman details';
    return (
      <MainLayout>
        <ErrorMessage message={errorMessage} className="mt-4" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <Breadcrumbs separator={<IconChevronRight size={16} />}>
          <BreadcrumbItem>
            <Link to={resolvedBasePath === '/admin' ? '/admin-dashboard' : '/my-kurin'}>
              {resolvedBasePath === '/admin' ? 'Admin Panel' : 'My Kurin'}
            </Link>
          </BreadcrumbItem>
          {kurinId && resolvedBasePath === '/admin' && (
            <BreadcrumbItem>
              <Link to={`${resolvedBasePath}/kurins/${kurinId}`}>
                Kurin
              </Link>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>Foreman Details</BreadcrumbItem>
        </Breadcrumbs>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 w-full">
              <Avatar
                src={foreman.picture}
                name={foreman.name}
                size="lg"
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{foreman.name}</h1>
                <p className="text-sm text-gray-600">{foreman.email}</p>
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<IconUserCheck size={14} />}
                  className="mt-2"
                >
                  Foreman
                </Chip>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-primary-50 rounded-lg">
                <IconUsersGroup size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold text-primary">{foreman.groups?.length ?? 0}</p>
                <p className="text-sm text-gray-600">Groups</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-default-100 rounded-lg">
                <IconUsers size={24} className="text-default-600 mb-2" />
                <p className="text-2xl font-bold text-default-700">
                  {foreman.groups?.reduce((total, g) => total + (g.scoutCount ?? 0), 0) ?? 0}
                </p>
                <p className="text-sm text-gray-600">Scouts</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-success-50 rounded-lg">
                <IconUsers size={24} className="text-success mb-2" />
                <p className="text-2xl font-bold text-success">
                  {foreman.groups && foreman.groups.length > 0
                    ? (foreman.groups.reduce((sum, g) => sum + (g.averageProgress ?? 0), 0) / foreman.groups.length).toFixed(1)
                    : '0.0'}%
                </p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Groups</h2>
          {foreman.groups && foreman.groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foreman.groups.map((group) => (
                <Card
                  key={group.id}
                  isPressable
                  onPress={() => handleGroupClick(group.id)}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex flex-col flex-1">
                      <p className="text-lg font-semibold">{group.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IconUsers size={18} />
                        <span>Scouts:</span>
                      </div>
                      <Chip size="sm" variant="flat" color="primary">
                        {group.scoutCount || group.scouts?.length || 0}
                      </Chip>
                    </div>
                    {group.averageProgress !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Progress:</span>
                        <Chip size="sm" variant="flat" color="success">
                          {group.averageProgress.toFixed(1)}%
                        </Chip>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-gray-600">
                  No groups managed by this foreman yet.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
