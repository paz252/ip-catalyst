import { CONFIG } from 'src/global-config';

 import { InternationalPatentListView } from 'src/sections/internationalPatentFiling/view';

// ----------------------------------------------------------------------

const metadata = { title: `Indian Patent Filing | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <InternationalPatentListView title="Prior Art Search" /> 
        </>
    );
}