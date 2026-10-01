import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { ProductCreateEditForm } from '../product-create-edit-form';
import { QueryCreateForm } from '../query-create-form';

// ----------------------------------------------------------------------

export function QueryCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Create a query"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Query', href: paths.dashboard.userQuery.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <QueryCreateForm />
        </DashboardContent>
    );
}