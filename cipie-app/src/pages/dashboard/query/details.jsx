import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetQuery } from 'src/actions/userQueries';

import { QueryDetailsView } from 'src/sections/query/view';

// ----------------------------------------------------------------------

const metadata = { title: `Query details - ${CONFIG.appName}` };

export default function Page() {
 const { id = '' } = useParams();

 const { query, loading, error } = useGetQuery(id);

  // const { latestPosts } = useGetLatestPosts(title);

  return (
    <>
      <title>{metadata.title}</title>

      <QueryDetailsView
        application={query}
        loading={loading}
        error={error}
      />
    </>
  );
}
