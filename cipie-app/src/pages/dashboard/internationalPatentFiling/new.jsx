import { CONFIG } from 'src/global-config';

import { InternationalPatentCreateView } from 'src/sections/internationalPatentFiling/view';

// ----------------------------------------------------------------------

const metadata = { title: `International Patent Filing | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <InternationalPatentCreateView title="International Patent Filing" />
        </>
    );
}