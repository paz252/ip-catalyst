import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CopyrightCreateEditForm } from '../copyright-create-edit-form';

// import { ProductCreateEditForm } from '../product-create-edit-form';
// import { PriorArtCreateEditForm } from '../priorArt-create-edit-form';

// ----------------------------------------------------------------------

export function CopyrightEditView({ copyright }) {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Update your Copyright Filing Request"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Copyright', href: paths.dashboard.copyright.root },
                    { name: 'Update' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <CopyrightCreateEditForm currentCopyright={copyright} />
        </DashboardContent> 
    );
}