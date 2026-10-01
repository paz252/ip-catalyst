import { CONFIG } from 'src/global-config';

import { IPHostingDetailsView } from 'src/sections/patentHosting/view/patent-hosting-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Intellectual Property Hosting | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <IPHostingDetailsView />
    </>
  );
}
