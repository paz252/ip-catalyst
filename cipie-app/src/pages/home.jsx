import { HomeView, HomePage } from 'src/sections/home/view';

// ----------------------------------------------------------------------

// const metadata = {
//   title: 'Minimals UI: The starting point for your next project',
//   description:
//     'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
// };

const metadata = {
  title: 'Home | IP Catalyst',
  description:
    'MeitY’s National Platform for Intellectual Property Commercialization in Electronics and IT innovations',
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {/* <HomeView /> */}
      <HomePage />
    </>
  );
}
