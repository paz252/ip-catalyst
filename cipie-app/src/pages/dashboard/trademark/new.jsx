import { CONFIG } from 'src/global-config';

import { TrademarkCreateView } from 'src/sections/trademark/view';

// ----------------------------------------------------------------------

const metadata = { title: `Trademark | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <TrademarkCreateView title="Trademark" />
        </>
    );
}