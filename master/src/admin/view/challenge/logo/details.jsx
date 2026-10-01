import { useParams } from 'src/routes/hooks';

import { _tours } from 'src/_mock/_tour';
import { CONFIG } from 'src/global-config';
import { useGetLogoDetails } from 'src/actions/challenge';
import { LogoDetailsView } from 'src/admin/sections/challenge/logo/view/logo-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Logo Challenge Details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { logoDetails, logoDetailsLoading, logoDetailsError } = useGetLogoDetails(id);

  return (
    <>
      <title>{metadata.title}</title>

      <LogoDetailsView
        logoDetails={logoDetails}
        logoDetailsLoading={logoDetailsLoading}
        logoDetailsError={logoDetailsError}
      />
    </>
  );
}
