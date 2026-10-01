import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TrademarkCreateEditForm } from '../trademark-create-edit-form';

// ----------------------------------------------------------------------

export function TrademarkCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="File new trademark"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Trademark filing', href: paths.dashboard.trademark.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <TrademarkCreateEditForm />
        </DashboardContent>
    );
}