import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {Test}from '../test';
import { CreatePriorArtSearchForm } from '../create-prior-art-search-form';

// ----------------------------------------------------------------------

export function ProductCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create new prior art"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          // { name: 'Prior Art', href: paths.dashboard.forms.root },
          {
            name: 'Create Prior Art',
            // ,href: paths.dashboard.forms.createPriorArt
          },
          {
            name: 'Test',
            // ,href: paths.dashboard.forms.createPriorArt
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Test />
      {/* <CreatePriorArtSearchForm /> */}
    </DashboardContent>
  );
}
