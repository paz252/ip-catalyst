import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetIndianPatent } from 'src/actions/indianPatentFiling'

import { IndianPatentDetailsView } from 'src/sections/indianPatentFiling/view';

// ----------------------------------------------------------------------

const metadata = { title: `Indian Patent Filing | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();
   
    const { patent, loading, error } = useGetIndianPatent(id);
   
     return (
       <>
         <title>{metadata.title}</title>
   
         <IndianPatentDetailsView indianPatent={patent} loading={loading} error={error} /> 
       </>
     );
}