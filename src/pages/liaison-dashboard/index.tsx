import { useSelector } from 'react-redux';
import { Card, CardBody, Chip } from '@nextui-org/react';
import { RootState } from '~app/store';
import { MainLayout } from '~widgets/layout';
import { ForemanListWidget } from '~widgets/foreman-list';
import { PageHeader } from '~shared/ui';
import { InviteForeman } from '~features/kurin/invite-foreman';
import { IconBuildingCommunity, IconAlertCircle } from '@tabler/icons-react';

export const LiaisonDashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.session);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Liaison Dashboard"
          description="Manage and monitor all foremen under your supervision"
        />

        {user?.kurin ? (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconBuildingCommunity size={32} className="text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">My Kurin</p>
                    <h3 className="text-xl font-bold">{user.kurin.name}</h3>
                  </div>
                </div>
                <InviteForeman kurinId={user.kurin.id} kurinName={user.kurin.name} />
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card className="border-2 border-warning">
            <CardBody>
              <div className="flex items-start gap-3">
                <IconAlertCircle size={24} className="text-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-warning mb-1">
                    No Kurin Assigned
                  </h3>
                  <p className="text-sm text-gray-600">
                    You have not been assigned to a Kurin yet. Please contact your administrator
                    to be assigned to a Kurin before you can invite and manage Foremen.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Foremen</h2>
          <ForemanListWidget />
        </div>
      </div>
    </MainLayout>
  );
};
