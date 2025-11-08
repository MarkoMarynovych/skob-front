import { MainLayout } from '~widgets/layout';
import { KurinListWidget } from '~widgets/kurin-list';
import { PageHeader } from '~shared/ui';
import { CreateKurin } from '~features/kurin/create-kurin';

export const AdminDashboardPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Admin Dashboard"
          description="System-wide overview and kurin management"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Kurins</h2>
            <CreateKurin />
          </div>
          <KurinListWidget />
        </div>
      </div>
    </MainLayout>
  );
};
