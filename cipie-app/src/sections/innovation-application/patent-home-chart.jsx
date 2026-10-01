import { Container } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PatentChartHeader } from './patent-chart-header';
import { PatentSubDomainsChart } from './patents-subdomains-chart';

export function PatentHomeChart({ header, series, description, subDomains, domain }) {
  // console.log(domain);
  return (
    <>
      <Container
        maxWidth={false}
        sx={[
          (theme) => ({
            px: { md: 5 },
            py: 3,
            mt: 3,
            // mb: 5,
            // borderBottom: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
      >
        <PatentChartHeader header={header} description={description} domain={domain} />
      </Container>

      <Container
        maxWidth={false}
        sx={[
          (theme) => ({
            px: { md: 5 },
            py: 1,
            // mb: 5,
            borderBottom: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
      >
        <CustomBreadcrumbs links={[{ name: 'Home', href: '/' }, { name: header.title }]} />
      </Container>

      <PatentSubDomainsChart
        // title="Expenses categories"
        chart={{
          series,
          icons: <Iconify icon="solar:circle-fill" />,
          // icons: [
          //   <Iconify icon="solar:gamepad-bold" />,
          //   <Iconify icon="solar:electric-refueling-bold" />,
          //   <Iconify icon="custom:fast-food-fill" />,
          //   <Iconify icon="solar:tea-cup-bold" />,
          //   <Iconify icon="solar:smartphone-2-bold" />,
          //   <Iconify icon="solar:medical-kit-bold" />,
          //   <Iconify icon="solar:dumbbell-large-minimalistic-bold" />,
          //   <Iconify icon="solar:cart-3-bold" />,
          // ],
        }}
        subDomains={subDomains}
        domain={domain}
      />

      {/* <AppCurrentDownload
        title="Current download"
        subheader="Downloaded by operating system"
        chart={{
          series,
        }}
      /> */}
    </>
  );
}
