import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetEvent } from 'src/actions/event';

import { EventDetailsView } from 'src/sections/event/view';

// ----------------------------------------------------------------------

const metadata = { title: `Post details - ${CONFIG.appName}` };

export default function Page() {
  const params = useParams();
 const { id = '' } = useParams();

 const { event, postLoading, postError } = useGetEvent(id);

  // const { latestPosts } = useGetLatestPosts(title);

  return (
    <>
      <title>{metadata.title}</title>

      <EventDetailsView
        post={event}
        // latestPosts={latestPosts}
        loading={postLoading}
        error={postError}
      />
    </>
  );
}
