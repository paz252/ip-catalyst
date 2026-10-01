import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCopyrightFilingRequest } from 'src/actions/copyright'

import { CopyrightDetailsView } from 'src/sections/copyright/view';

// ----------------------------------------------------------------------

const metadata = { title: `Copyright Details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams(); // Extracts the GUID from URL

    const { copyright, copyrightLoading, copyrightError } = useGetCopyrightFilingRequest(id);
    return (
        <>
            <title>{metadata.title}</title>

            <CopyrightDetailsView title="Copyright Details" copyright={copyright}
                loading={copyrightLoading}
                error={copyrightError} />
        </>
    );
}