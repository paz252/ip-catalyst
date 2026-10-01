import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {TrademarkCreateEditForm} from '../trademark-create-edit-form';

// import { ProductCreateEditForm } from '../product-create-edit-form';
// import { PriorArtCreateEditForm } from '../priorArt-create-edit-form';

// ----------------------------------------------------------------------

export function TrademarkEditView({ trademark }) {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Update your Trademark Filing Request"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Trademark', href: paths.dashboard.trademark.root },
                    { name: 'Update' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <TrademarkCreateEditForm currentTrademark={trademark} />
        </DashboardContent> 
    );
}