import { useParams } from 'react-router';

import { Skeleton } from '@mui/material';

import { useGetIPHostingDetails } from 'src/actions/patent-hosting';

import { IPHostingDetailsEmptyView, IPHostingDetailsView } from './view';

export function IPHostingDetailsPage() {
  const { id } = useParams();

  const { ipHosting, ipHostingLoading } = useGetIPHostingDetails(id);

  if (ipHostingLoading) {
    return <Skeleton />;
  }

  const hasData = ipHosting?.title || ipHosting?.shortDescription || ipHosting?.bannerUrl;

  if (!hasData) {
    return <IPHostingDetailsEmptyView />;
  }

  return <IPHostingDetailsView />;
}
