import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';
import { PriorArtListView } from 'src/sections/priorArtSearch/view/priorArt-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Prior Art Search List | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <PriorArtListView title="Prior Art Search List" />
        </>
    );
}