import { CONFIG } from 'src/global-config';

import { IPHostingDetailsEmptyView } from 'src/sections/patentHosting/view/patent-hosting-details-empty-view';

// ----------------------------------------------------------------------

const metadata = { title: `Intellectual Property Hosting | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <IPHostingDetailsEmptyView />
    </>
  );
}
