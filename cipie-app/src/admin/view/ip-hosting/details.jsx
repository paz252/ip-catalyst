import { useParams } from 'src/routes/hooks';

import { _tours } from 'src/_mock/_tour';
import { CONFIG } from 'src/global-config';
import { useGetPatent } from 'src/admin/actions/ip-hosting';
import { IpHostingDetailsView } from 'src/admin/sections/ip-hosting/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ip Hosting details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

   const { patent, patentLoading, patentError } = useGetPatent(id);

  return (
    <>
      <title>{metadata.title}</title>

      <IpHostingDetailsView hostingData={patent} loading={patentLoading} error={patentError} ipHostingId={id}/>
    </>
  );
}