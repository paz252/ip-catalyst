import { CONFIG } from 'src/global-config';

import { PatentHostingListView } from 'src/sections/patentHosting/view/patent-hosting-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Patent Hosting | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <PatentHostingListView title="Patent Hosting List" />
    </>
  );
}

// export default function Page() {
//   return <div>Patent Hosting List</div>;
// }
