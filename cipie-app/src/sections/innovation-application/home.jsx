import { Iconify } from 'src/components/iconify';

import { AppCurrentDownload } from 'src/sections/overview/app/app-current-download';
import { PatentSubDomainsChart } from 'src/sections/innovation-application/patents-subdomains-chart';

function home() {
  // console.log(PATENT_DOMAINS_COUNT);
  return (
    <>
      <PatentSubDomainsChart
        title="Expenses categories"
        chart={{
          series: [
            { label: 'Information & Communication Technology', value: 57 },
            { label: 'Mechanical & Industrial Engineering', value: 18 },
            { label: 'Materials, Chemical & Nano Sciences', value: 29 },
            { label: 'Medical & Life Sciences', value: 25 },
            { label: 'Electrical & Electronics Engineering', value: 19 },
            { label: 'Measurement & Optical Technologies', value: 21 },
            { label: 'Other Technologies', value: 12 },
          ],
          icons: [
            <Iconify icon="solar:gamepad-bold" />,
            <Iconify icon="solar:electric-refueling-bold" />,
            <Iconify icon="custom:fast-food-fill" />,
            <Iconify icon="solar:tea-cup-bold" />,
            <Iconify icon="solar:smartphone-2-bold" />,
            <Iconify icon="solar:medical-kit-bold" />,
            <Iconify icon="solar:dumbbell-large-minimalistic-bold" />,
            <Iconify icon="solar:cart-3-bold" />,
            <Iconify icon="solar:airplane-bold" />,
          ],
        }}
      />

      <AppCurrentDownload
        title="Current download"
        subheader="Downloaded by operating system"
        chart={{
          series: [
            { label: 'Mac', value: 12244 },
            { label: 'Mac2', value: 12244 },
            { label: 'Window', value: 53345 },
            { label: 'iOS', value: 44313 },
            { label: 'Android', value: 78343 },
            { label: 'Google', value: 78345 },
          ],
        }}
      />
    </>
  );
}

export default home;
