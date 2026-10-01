import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetTrademark } from 'src/actions/trademark'

import { BlankView } from 'src/sections/blank/view';
import { TrademarkDetailsView } from 'src/sections/trademark/view';

// ----------------------------------------------------------------------

const metadata = { title: `Trademark Details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams(); // Extracts the GUID from URL

    const { trademark, loading, error } = useGetTrademark(id);
    return (
        <>
            <title>{metadata.title}</title>

            <TrademarkDetailsView title="Prior Art Search Details" trademark={trademark}
                loading={loading}
                error={error} />
        </>
    );
}