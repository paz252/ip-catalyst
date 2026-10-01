import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCopyrightFilingRequest } from 'src/actions/copyright'

import { BlankView } from 'src/sections/blank/view';
import { CopyrightEditView } from 'src/sections/copyright/view';

// ----------------------------------------------------------------------

const metadata = { title: `Trademark edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams(); // Extracts the GUID from URL

     const { copyright, loading, error } = useGetCopyrightFilingRequest(id);

    return (
        <>
            <title>{metadata.title}</title>

            <CopyrightEditView copyright={copyright} />
        </>
    );
}