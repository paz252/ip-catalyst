import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { useGetPatentDetails } from 'src/actions/patent';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { PatentDetailsView } from 'src/sections/innovation-application/patent-details-view';
import { PatentDetailsSkeleton } from 'src/sections/innovation-application/patent-skeleton';

// ----------------------------------------------------------------------

export default function DetailsPage() {
  const { domain, category, id } = useParams();

  const { data, isLoading, error } = useGetPatentDetails(id);

  // if api has returned data passing it or fall back to state while loading
  const patent = data?.data;

  if (isLoading && !patent) {
    return <PatentDetailsSkeleton />;
  }

  if (error) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <EmptyContent filled title="Unable to load patent" />
      </Container>
    );
  }

  if (!patent) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <EmptyContent
          filled
          title="Patent not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.innovationApplication.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }

  const MAX_TITLE_LENGTH = 60;

  function formatTitle(str) {
    if (!str) return '';

    const cleaned = str.replace(/[^a-zA-Z0-9 ]+/g, ' ');
    const trimmed = cleaned.trim().replace(/\s+/g, ' ');

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  const patentTitle = patent?.title ?? patent?.header?.title ?? '';

  const readableTitle = formatTitle(patentTitle);

  const shortTitle =
    readableTitle.length > MAX_TITLE_LENGTH
      ? `${readableTitle.slice(0, MAX_TITLE_LENGTH)}…`
      : readableTitle;

  const metadata = {
    title: `${shortTitle} | ${category.replaceAll('-', ' ')} | ${domain.replaceAll('-', ' ')}`,
    title3: `Patent - ${shortTitle} | ${CONFIG.appName}`,
  };

  return (
    <>
      <title>{metadata.title3}</title>

      <PatentDetailsView domain={domain} category={category} patent={patent} />
    </>
  );
}
