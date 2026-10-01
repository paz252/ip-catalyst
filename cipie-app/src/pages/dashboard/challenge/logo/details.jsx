import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetLogoDetails } from 'src/actions/challenge';

import { LogoDetailsView } from 'src/sections/challenge/view';

// ----------------------------------------------------------------------

const metadata = { title: `Logo Challenge | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { logoDetails, logoDetailsLoading, logoDetailsError } = useGetLogoDetails(id);

  return (
    <>
      <title>{metadata.title}</title>
      <LogoDetailsView data={logoDetails} loading={logoDetailsLoading} error={logoDetailsError} />
    </>
  );
}
