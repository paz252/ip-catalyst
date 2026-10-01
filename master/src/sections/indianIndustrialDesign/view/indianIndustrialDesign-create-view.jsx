import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IndianIndustrialDesignCreateForm } from '../indianIndustrialDesign-create-form';

// ----------------------------------------------------------------------

export function IndianIndustrialDesignCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Indian Patent Filing Request"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Indian Patent Filing', href: paths.dashboard.indianPatentFiling.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <IndianIndustrialDesignCreateForm />
        </DashboardContent>
    );
}