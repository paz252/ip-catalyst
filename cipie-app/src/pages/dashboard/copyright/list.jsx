import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';
import { CopyrightListView } from 'src/sections/copyright/view';

// ----------------------------------------------------------------------

const metadata = { title: `Copyright List | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            {/* <BlankView title="Trademark List" /> */}
            <CopyrightListView title="Copyright List" /> 
        </>
    );
}