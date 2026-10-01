import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetBlog } from 'src/actions/resource_';

import { ResourceDetailView } from 'src/sections/resources/view';

// ----------------------------------------------------------------------

const metadata = { title: `Resource details - ${CONFIG.appName}` };

export default function Page() {
  const params = useParams();
 const { id = '' } = useParams();

 const { blog, blogLoading, blogError } = useGetBlog(id);

  // const { latestPosts } = useGetLatestPosts(title);

  return (
    <>
      <title>{metadata.title}</title>

      <ResourceDetailView
        post={blog}
        // latestPosts={latestPosts}
        loading={blogLoading}
        error={blogError}
      />
    </>
  );
}
