import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IndianPatentCreateForm } from '../indianPatent-create-form';

// ----------------------------------------------------------------------

export function IndianPatentEditView({indianPatent}) {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Update Indian Patent Request"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Indian Patent Filing', href: paths.dashboard.indianPatentFiling.root },
                    { name: 'Update' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <IndianPatentCreateForm indianPatent={indianPatent} />
        </DashboardContent>
    );
}