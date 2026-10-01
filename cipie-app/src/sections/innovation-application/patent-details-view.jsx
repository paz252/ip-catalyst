import { PatentLegacyDetailsView } from './patent-legacy-details-view';
import { PatentHostingDetailsView } from './patent-hosting-details-view';

export function PatentDetailsView({ domain, category, patent }) {
  // console.log(patent.isNew);
  if (patent.isNew) {
    return <PatentHostingDetailsView domain={domain} category={category} patent={patent} />;
  }

  return <PatentLegacyDetailsView domain={domain} category={category} patent={patent} />;
}
