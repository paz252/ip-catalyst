import { CONFIG } from 'src/global-config';

import { QueryListView } from 'src/sections/query/view';

// ----------------------------------------------------------------------

const metadata = { title: `Post list - ${CONFIG.appName}` };

export default function Page() {

  return (
    <>
      <title>{metadata.title}</title>

      <QueryListView />
    </>
  );
}