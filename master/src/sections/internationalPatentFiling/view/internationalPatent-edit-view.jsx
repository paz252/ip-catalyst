import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InternationalPatentCreateEditForm } from '../internationalPatent-create-edit-form';

// ----------------------------------------------------------------------

export function InternationalPatentEditView({internationalPatent, role}) {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Foreign Patent Filing Request"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Foreign Patent Filing', href: paths.dashboard.internationalPatentFiling.root },
                    { name: 'Update' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <InternationalPatentCreateEditForm internationalPatent={internationalPatent} role={role} />
        </DashboardContent>
    );
}