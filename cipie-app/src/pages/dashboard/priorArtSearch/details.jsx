import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPriorArt } from 'src/actions/priorArt';

import { BlankView } from 'src/sections/blank/view';
import { PriorArtDetailsView } from 'src/sections/priorArtSearch/view';

// ----------------------------------------------------------------------

const metadata = { title: `Prior Art Search Details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id } = useParams(); // Extracts the GUID from URL

  const { priorArt, loading, error } = useGetPriorArt(id);
  return (
    <>
      <title>{metadata.title}</title>

      <PriorArtDetailsView
        title="Prior Art Search Details"
        priorArt={priorArt}
        loading={loading}
        error={error}
      />
    </>
  );
}
