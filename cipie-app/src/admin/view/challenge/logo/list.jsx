import { CONFIG } from 'src/global-config';
import LogoChallengeListPage from 'src/admin/sections/challenge/logo/view/logo-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Logo Challenge List | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <LogoChallengeListPage />
    </>
  );
}
