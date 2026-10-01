import { CONFIG } from 'src/global-config';
import { ApplicationListView } from 'src/admin/sections/application/view';

// ----------------------------------------------------------------------

const metadata = { title: `Application list | Dashboard - ${CONFIG.appName}` };

export default function ApplicationList() {
  return (
    <>
      <title>{metadata.title}</title>

      <ApplicationListView />
    </>
  );
}
