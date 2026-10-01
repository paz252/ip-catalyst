import { CONFIG } from 'src/global-config';
import { IpHostingListPage } from 'src/admin/sections/ip-hosting/view/ip-hosting-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Ip Hosting list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <IpHostingListPage />
    </>
  );
}
