import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetInternationalPatent } from 'src/actions/internationalPatentFiling'

 import { InternationalPatentDetailsView } from 'src/sections/internationalPatentFiling/view';

// ----------------------------------------------------------------------

const metadata = { title: `International Patent Filing | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();
   
    const { patent, patentLoading, patentError } = useGetInternationalPatent(id);
   
     return (
       <>
         <title>{metadata.title}</title>
   
         <InternationalPatentDetailsView internationalPatent={patent} loading={patentLoading} error={patentError} />
       </>
     );
}