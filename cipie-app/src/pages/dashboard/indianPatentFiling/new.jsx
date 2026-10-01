import { CONFIG } from 'src/global-config';

import { IndianPatentCreateView } from 'src/sections/indianPatentFiling/view';

// ----------------------------------------------------------------------

const metadata = { title: `Indian Patent Filing | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <IndianPatentCreateView title="Indian PAtent Filing" />
        </>
    );
}