import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';
import { TrademarkListView } from 'src/sections/trademark/view';

// ----------------------------------------------------------------------

const metadata = { title: `Trademark List | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <TrademarkListView title="Trademark List" /> 
        </>
    );
}