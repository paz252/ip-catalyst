import { QueryDetailsCard } from "./query-details";
import { PriorArtDetailsCard } from "./prior-art-details";
import { TrademarkDetailsCard } from "./trademark-details";
import { CopyrightDetailsCard } from "./copyright-details";
import { IndianPatentDetailsCard } from "./indian-patent-details";
import { InternationalPatentDetailsCard } from "./international-patent-details";

export function ServiceDetailsCard({ application }) {

  const renderCard = () => {
    switch (application?.serviceCode) {
      case 'PRIOR_ART':
        return <PriorArtDetailsCard application={application} />;

      case 'TRADEMARK':
        return <TrademarkDetailsCard application={application} />;

      case 'COPYRIGHT':
        return <CopyrightDetailsCard application={application} />;

      case 'INDIAN_PATENT_FILING':
        return <IndianPatentDetailsCard application={application} />;

      case 'INTERNATIONAL_PATENT_FILING':
        return <InternationalPatentDetailsCard application={application} />;

      case 'USER_QUERY':
        return <QueryDetailsCard application={application} />;

      default:
        return null;
    }

  };

  return (
    <div
    // style={{
    //   maxHeight: '500px',
    //   overflowY: 'auto',
    // }}
    >
      {renderCard()}
    </div>
  );
}