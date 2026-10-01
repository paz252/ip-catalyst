import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';
import { useGetPatentDomainsCount } from 'src/actions/patent';

import { PatentHomeChart } from 'src/sections/innovation-application/patent-home-chart';
import { PatentHomeChartError } from 'src/sections/innovation-application/patent-home-chart-error';
import { PatentHomeChartSkeleton } from 'src/sections/innovation-application/patent-home-chart-skeleton';

// ----------------------------------------------------------------------

const metadata = { title: ` Patent Overview | IP Catalyst - ${CONFIG.appName}` };

export default function PatentChartViewPage() {
  const { domain } = useParams();

  const { domains, total, domainsLoading, domainsError } = useGetPatentDomainsCount();

  const DOMAIN_MAP = {
    ict: {
      label: 'Information & Communication Technology',
      icon: 'material-symbols:laptop-mac-outline',
    },
    mech: {
      label: 'Mechanical & Industrial Engineering',
      icon: 'weui:setting-filled',
    },
    mat: {
      label: 'Materials, Chemical & Nano Sciences',
      icon: 'iconoir:test-tube-solid',
    },
    med: {
      label: 'Medical & Life Sciences',
      icon: 'boxicons:medical-kit-filled',
    },
    elec: {
      label: 'Electrical & Electronics Engineering',
      icon: 'material-symbols-light:electric-bolt',
    },
    opt: {
      label: 'Measurement & Optical Technologies',
      icon: 'boxicons:microscope-filled',
    },
    other: {
      label: 'Other Technologies',
      icon: 'glyphs:microscope-bold',
    },
    // 'all-technologies': {
    //   label: 'All Technologies',
    //   icon: 'solar:chart-2-bold',
    // },
  };

  // create lookup
  const DOMAIN_LOOKUP = Object.values(DOMAIN_MAP).reduce((acc, item) => {
    // console.log(acc);
    acc[item.label.toLowerCase()] = item;
    return acc;
  }, {});

  // selected domain
  const selectedDomain = domains.find(
    (d) => d.mainTechnologyDomain.toLowerCase() === DOMAIN_MAP[domain]?.label?.toLowerCase()
  );

  // console.log(domain, selectedDomain);

  // chart data
  const series = domain
    ? selectedDomain?.subDomains?.map((sub) => ({
        label: sub.techSubDomain,
        value: sub.count,
        icon: 'solar:dot-bold',
      })) || []
    : domains.map((d) => ({
        label: d.mainTechnologyDomain,
        value: d.total,
        icon: DOMAIN_LOOKUP[d.mainTechnologyDomain.toLowerCase()]?.icon || 'solar:box-bold',
      }));

  // console.log(series);

  // header data (for PatentHomeChart)
  const header =
    domain && selectedDomain
      ? {
          title: selectedDomain.mainTechnologyDomain,
          total: selectedDomain.total,
          icon:
            DOMAIN_LOOKUP[selectedDomain.mainTechnologyDomain.toLowerCase()]?.icon ||
            'solar:box-bold',
        }
      : {
          title: 'All Technology Domains',
          total,
          icon: 'solar:chart-2-bold',
        };

  const description = domain
    ? `This chart shows the distribution of patents within ${selectedDomain?.mainTechnologyDomain}, categorized by its subdomains.`
    : `This chart presents a total of ${total} patents distributed across major technology domains.`;

  // loading & error
  const isReady = domain ? selectedDomain : domains?.length;

  if (!isReady) return <PatentHomeChartSkeleton />;
  if (domainsError) return <PatentHomeChartError onRetry={() => window.location.reload()} />;

  return (
    <>
      <title>{metadata.title}</title>

      <PatentHomeChart
        header={header} // title, icon + total
        series={series} // chart data
        description={description}
      />
    </>
  );
}
