import { CONFIG } from 'src/global-config';

import { QueryCreateView } from 'src/sections/query/view';

// ----------------------------------------------------------------------

const metadata = { title: `User Query | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <QueryCreateView title="User Query" />
        </>
    );
}