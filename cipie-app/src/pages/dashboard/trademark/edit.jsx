import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetTrademark } from 'src/actions/trademark'

import { TrademarkEditView } from 'src/sections/trademark/view';

// ----------------------------------------------------------------------

const metadata = { title: `Trademark edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams(); // Extracts the GUID from URL

    const { trademark, trademarkLoading, trademarkError  } = useGetTrademark(id);

    return (
        <>
            <title>{metadata.title}</title>

            <TrademarkEditView trademark={trademark} />
        </>
    );
}
