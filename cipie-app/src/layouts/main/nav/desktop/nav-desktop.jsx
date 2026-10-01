import { Nav, NavUl } from '../components';
import { NavList } from './nav-desktop-list';

// ----------------------------------------------------------------------

export function NavDesktop({ data, sx, ...other }) {
  // console.log(`Data=>`, data);
  return (
    <Nav
      sx={[
        () => ({
          /* Put styles */
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <NavUl
        sx={{
          gap: 3, //5
          // gap: {
          //   xs: 3,
          //   sm: 3,
          //   md: '10px',
          //   lg: 3.5,
          //   xl: 8,
          // },

          // gap: {
          //   xs: 3,
          //   sm: 3,
          //   md: 3,
          //   lg: 3,
          //   xl: 3,
          // },
          // ml: {
          //   xs: 0,
          //   sm: 0,
          //   md: 1,
          // },
          height: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {data.map((list) => (
          <NavList key={list.title} data={list} />
        ))}
      </NavUl>
    </Nav>
  );
}
