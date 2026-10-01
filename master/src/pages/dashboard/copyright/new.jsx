import { CONFIG } from 'src/global-config';

import { CopyrightCreateView } from 'src/sections/copyright/view';

// ----------------------------------------------------------------------

const metadata = { title: `Copyright | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <CopyrightCreateView title="Copyright" />
        </>
    );
}