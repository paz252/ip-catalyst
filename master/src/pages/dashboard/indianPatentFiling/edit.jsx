import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetIndianPatent } from 'src/actions/indianPatentFiling';

import { IndianPatentEditView } from 'src/sections/indianPatentFiling/view/indianPatent-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Indian Patent Edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams(); // Extracts the GUID from URL

     const { patent, patentLoading, patentError } = useGetIndianPatent(id);

    return (
        <>
            <title>{metadata.title}</title>

            <IndianPatentEditView indianPatent={patent} />
        </>
    );
}