import { useBoolean } from 'minimal-shared/hooks';
import { useRef, useEffect, useCallback } from 'react';
import { isEqualPath, isActiveLink, isExternalLink } from 'minimal-shared/utils';

import { usePathname } from 'src/routes/hooks';

import { NavItem } from './nav-desktop-item';
import { Nav, NavLi, NavUl, NavDropdown } from '../components';
import { NavItemDashboard } from './nav-desktop-item-dashboard';

// ----------------------------------------------------------------------

export function NavList({ data, sx, ...other }) {
  const pathname = usePathname();
  const navItemRef = useRef(null);

  // const isActive = isActiveLink(pathname, data.path, data.deepMatch ?? !!data.children);

  const isActive =
    typeof data.path === 'string' && data.path.length > 0
      ? isActiveLink(pathname, data.path, data.deepMatch ?? !!data.children)
      : false;
  // console.log(isActive);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const openDropdown = true; // open dropdown forcefully

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      onOpen();
    }
  }, [data.children, onOpen]);

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      // slots
      path={data.path}
      title={data.title}
      // state
      open={open}
      active={isActive}
      // options
      hasChild={!!data.children}
      externalLink={isExternalLink(data.path)}
      // action
      onMouseEnter={handleOpenMenu}
      onMouseLeave={onClose}
    />
  );
  // console.log(`DATA =>`, data?.children);
  const renderDropdown = () =>
    !!data.children && (
      <NavDropdown
        open={open} //openDropdown
        onMouseEnter={handleOpenMenu}
        onMouseLeave={onClose}
      >
        <Nav>
          <NavUl
            // sx={{ gap: 3, flexDirection: 'row', flexWrap: 'wrap' }}
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: `repeat(${Math.min(data?.children?.length, 4)}, 1fr)`,
            }}
          >
            {data.children.map((list) => (
              <NavSubList
                key={list.subheader}
                subheaderPath={list?.path} // Chaitali: Added prop to Customized subheader clickable
                subheader={list.subheader}
                data={list.items}
              />
            ))}
          </NavUl>
        </Nav>
      </NavDropdown>
    );

  return (
    <NavLi sx={sx} {...other}>
      {renderNavItem()}
      {renderDropdown()}
    </NavLi>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, subheader, subheaderPath, sx, ...other }) {
  // console.log('SUBHEADER PATH:', subheaderPath, typeof subheaderPath);
  // console.log(subheaderPath);
  const pathname = usePathname();

  const isDashboard = subheader === 'Dashboard';

  return (
    <NavLi
      sx={[
        () => ({
          flexGrow: 1,
          flexBasis: 'auto',
          flexShrink: isDashboard ? 1 : 0,
          ...(isDashboard && { maxWidth: 560 }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <NavUl>
        {/* <NavLi
          sx={(theme) => ({
            mb: 0.75,
            typography: 'overline',
            fontSize: theme.typography.pxToRem(11),
          })}
        >
          {subheader}
        </NavLi> */}

        {/* Chaitali: customizing the path according to the subheaderPath prop provided */}
        <NavLi
          sx={(theme) => ({
            mb: 0.75,
            typography: 'overline',
            fontSize: theme.typography.pxToRem(11),
            cursor: subheaderPath ? 'pointer' : 'default',
          })}
        >
          {subheaderPath ? (
            <NavItem
              title={subheader}
              path={subheaderPath}
              active={isEqualPath(subheaderPath, pathname)}
              itemType="subheader"
            />
          ) : (
            subheader
          )}
        </NavLi>

        {data.map((item) =>
          isDashboard ? (
            <NavLi key={item.title} sx={{ mt: 0.75 }}>
              <NavItemDashboard path={item.path} />
            </NavLi>
          ) : (
            <NavLi key={item.title} sx={{ mt: 0.75 }}>
              <NavItem
                subItem
                title={item.title}
                path={item.path}
                active={isEqualPath(item.path, pathname)}
              />
            </NavLi>
          )
        )}
      </NavUl>
    </NavLi>
  );
}
