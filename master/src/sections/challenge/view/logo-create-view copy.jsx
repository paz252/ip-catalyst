import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { InternationalPatentCreateForm } from '../internationalPatent-create-form';

// ----------------------------------------------------------------------

export function LogoCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Logo Challenge"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Logo Challenge', href: paths.dashboard.challenge.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* <InternationalPatentCreateForm /> */}
    </DashboardContent>
  );
}
