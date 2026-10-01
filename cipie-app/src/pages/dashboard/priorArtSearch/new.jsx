import { CONFIG } from 'src/global-config';

import { PriorArtCreateView } from 'src/sections/priorArtSearch/view';

// ----------------------------------------------------------------------

const metadata = { title: `Prior Art Search | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <PriorArtCreateView title="Prior Art Search" />
        </>
    );
}