import { Link } from 'react-router';

// ----------------------------------------------------------------------

export function RouterLink({ href, ref, ...other }) {
  return <Link ref={ref} to={href} {...other} />;
}

// forwardRef is required for MUI Link
// export const RouterLink = forwardRef(function RouterLink(props, ref) {
//   const { href, ...other } = props;
//   return <RouterDomLink ref={ref} to={href} {...other} />;
// });


