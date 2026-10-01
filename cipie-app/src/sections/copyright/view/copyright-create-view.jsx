import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CopyrightCreateEditForm } from '../copyright-create-edit-form';

// ----------------------------------------------------------------------

export function CopyrightCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Create a new copyright"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Copyright', href: paths.dashboard.copyright.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <CopyrightCreateEditForm />
        </DashboardContent>
    );
}