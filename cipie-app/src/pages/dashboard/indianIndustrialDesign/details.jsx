import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetIndustrialDesign } from 'src/actions/indianIndustrialDesign';

import { BlankView } from 'src/sections/blank/view';
import { IndianIndustrialDesignDetailsView } from 'src/sections/indianIndustrialDesign/view';

// ----------------------------------------------------------------------

const metadata = { title: `Indian Industrial Design Details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams(); // Extracts the GUID from URL

    const { priorArt, loading, error } = useGetIndustrialDesign(id);
    return (
        <>
            <title>{metadata.title}</title>

            <IndianIndustrialDesignDetailsView title="Industrial Design Details" priorArt={priorArt}
                loading={loading}
                error={error} />
        </>
    );
}