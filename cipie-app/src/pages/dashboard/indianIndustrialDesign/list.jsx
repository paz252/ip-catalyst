import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';
import { IndianIndustrialDesignListView } from 'src/sections/indianIndustrialDesign/view';

// ----------------------------------------------------------------------

const metadata = { title: `Indian Industrial Design List | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <IndianIndustrialDesignListView title="Indian Industrial Design List" />
        </>
    );
}