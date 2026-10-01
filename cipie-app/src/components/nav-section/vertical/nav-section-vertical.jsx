import { useNavigate } from 'react-router';
import { useBoolean } from 'minimal-shared/hooks';
import { mergeClasses } from 'minimal-shared/utils';

import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { NavList } from './nav-list';
import { Nav, NavUl, NavLi, NavSubheader } from '../components';
import { navSectionClasses, navSectionCssVars } from '../styles';

// ----------------------------------------------------------------------

export function NavSectionVertical({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}) {
  // console.log('data in nav vertical', data);
  const theme = useTheme();

  const cssVars = { ...navSectionCssVars.vertical(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.vertical, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            // className="hello2"
            key={group.subheader ?? group.items[0].title}
            subheader={group.subheader}
            items={group.items}
            subheaderPath={group?.path}
            render={render}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Nav>
  );
}

// ----------------------------------------------------------------------

function Group({
  items,
  render,
  subheader,
  subheaderPath,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}) {
  const groupOpen = useBoolean(true);
  const navigate = useNavigate();
  // console.log('subheader path', subheaderPath);

  const handleNavigate = (e) => {
    e.stopPropagation();
    if (subheaderPath) {
      navigate(subheaderPath);
    }
  };

  const renderContent = () => (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {items.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );

  return (
    <NavLi>
      {subheader ? (
        <>
          <NavSubheader
            // className="hello3"
            data-title={subheader}
            open={groupOpen.value}
            onClick={groupOpen.onToggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: subheaderPath ? 'pointer' : 'default',
              ...slotProps?.subheader,
            }}
          >
            <span onClick={handleNavigate}>{subheader}</span>
            {/* <Iconify
              icon={groupOpen.value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            /> */}
          </NavSubheader>

          <Collapse in={groupOpen.value}>{renderContent()}</Collapse>
        </>
      ) : (
        renderContent()
      )}
    </NavLi>
  );
}
