import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetIndustrialDesign } from 'src/actions/indianIndustrialDesign';

import { BlankView } from 'src/sections/blank/view';
import { IndianIndustrialDesignEditView } from 'src/sections/indianIndustrialDesign/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams(); // Extracts the GUID from URL

    const { priorArt, loading, error } = useGetIndustrialDesign(id);

    return (
        <>
            <title>{metadata.title}</title>

            <IndianIndustrialDesignEditView priorArt={priorArt} />
        </>
    );
}