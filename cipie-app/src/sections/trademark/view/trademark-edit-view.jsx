import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { ProductCreateEditForm } from '../product-create-edit-form';
// import { PriorArtCreateEditForm } from '../priorArt-create-edit-form';

// ----------------------------------------------------------------------

export function TrademarkEditView({ priorArt }) {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Create a new prior art search"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Prior Art Search', href: paths.dashboard.priorArtSearch.root },
                    { name: 'Update' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            {/* <PriorArtCreateEditForm currentPriorArt={priorArt} /> */}
        </DashboardContent> 
    );
}