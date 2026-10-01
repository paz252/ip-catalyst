import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetApplication } from 'src/admin/actions/application';
import { ApplicationDetailsView } from 'src/admin/sections/application/view';

// ----------------------------------------------------------------------

const metadata = { title: `Application Details | Dashboard - ${CONFIG.appName}` };

export default function ApplicationDetails() {
     const { id = '' } = useParams();
   
    const { application, applicationLoading, applicationError } = useGetApplication(id);
  return (
    <>
      <title>{metadata.title}</title>

      <ApplicationDetailsView application={application} loading={applicationLoading} error={applicationError}/>
    </>
  );
}


