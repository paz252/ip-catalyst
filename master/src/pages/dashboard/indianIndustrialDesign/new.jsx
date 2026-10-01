import { CONFIG } from 'src/global-config';

import { IndianIndustrialDesignCreateView } from 'src/sections/indianIndustrialDesign/view';

// ----------------------------------------------------------------------

const metadata = { title: `Indian Industrial Design | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <IndianIndustrialDesignCreateView title="Indian Industrial Design" />
        </>
    );
}