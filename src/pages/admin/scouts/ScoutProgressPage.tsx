import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Spinner, Card, CardBody, Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';
import { IconArrowLeft, IconChevronRight } from '@tabler/icons-react';
import { RootState } from '~app/store';
import { MainLayout } from '~widgets/layout';
import { ProbaProgressWidget } from '~widgets/proba-progress';
import { ErrorMessage } from '~shared/ui';
import { UserRole } from '~entities/user/model/types';

interface ScoutProgressPageProps {
  basePath?: string;
}

export const ScoutProgressPage = ({ basePath }: ScoutProgressPageProps) => {
  const { scoutId, groupId, foremanId, kurinId } = useParams<{ scoutId: string; groupId: string; foremanId: string; kurinId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.session);
  const location = window.location.pathname;
  const resolvedBasePath = basePath || (location.includes('/liaison/') ? '/liaison' : '/admin');

  if (!scoutId) {
    return (
      <MainLayout>
        <ErrorMessage message="Scout ID is missing" />
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const isReadOnly = user.role === UserRole.ADMIN || user.role === UserRole.LIAISON;

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
          {kurinId && foremanId && (
            <BreadcrumbItem>
              <Link to={`${resolvedBasePath}/kurins/${kurinId}/foremen/${foremanId}`}>
                Foreman
              </Link>
            </BreadcrumbItem>
          )}
          {kurinId && foremanId && groupId && (
            <BreadcrumbItem>
              <Link to={`${resolvedBasePath}/kurins/${kurinId}/foremen/${foremanId}/groups/${groupId}`}>
                Group
              </Link>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>Scout Progress</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => navigate(-1)}
            aria-label="Go back"
          >
            <IconArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scout Progress</h1>
            <p className="mt-2 text-gray-600">
              {isReadOnly
                ? 'View this scout\'s proba progress (read-only)'
                : 'Manage and track this scout\'s proba progress'}
            </p>
          </div>
        </div>

        {isReadOnly && (
          <Card className="bg-warning-50 border border-warning-200">
            <CardBody>
              <p className="text-sm text-warning-800">
                This is a read-only view. As an {user.role.toLowerCase()}, you can view progress but cannot make changes.
              </p>
            </CardBody>
          </Card>
        )}

        <ProbaProgressWidget
          userId={scoutId}
          userRole={isReadOnly ? UserRole.SCOUT : user.role}
          isViewingOwnProgress={false}
        />
      </div>
    </MainLayout>
  );
};
