import { CONFIG } from 'src/global-config';

import { ResourceListView } from 'src/sections/resources/view';

// ----------------------------------------------------------------------

const metadata = { title: `Resource list - ${CONFIG.appName}` };

export default function Page() {

  return (
    <>
      <title>{metadata.title}</title>

      <ResourceListView />
    </>
  );
}