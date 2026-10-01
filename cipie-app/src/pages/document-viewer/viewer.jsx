import { useSearchParams } from 'react-router';

import { CONFIG } from 'src/global-config';

import { DocumentViewer } from './document-viewer';
// ----------------------------------------------------------------------

export default function Page() {
  const [searchParams] = useSearchParams();

  const documentUrl = searchParams.get('url');

  const documentName = documentUrl
    ? decodeURIComponent(documentUrl.split('/').pop().split('?')[0])
    : 'Document';

  const metadata = { title: `${documentName} | Document - ${CONFIG.appName}` };

  return (
    <>
      <title>{metadata.title}</title>

      <DocumentViewer documentUrl={documentUrl} documentName={documentName} />
    </>
  );
}
