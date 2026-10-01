import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InternationalPatentCreateForm } from '../internationalPatent-create-form';

// ----------------------------------------------------------------------

export function InternationalPatentCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Foreign Patent Filing Request"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Foreign Patent Filing Request', href: paths.dashboard.internationalPatentFiling.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <InternationalPatentCreateForm />
        </DashboardContent>
    );
}