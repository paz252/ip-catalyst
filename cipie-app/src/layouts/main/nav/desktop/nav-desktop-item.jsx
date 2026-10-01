import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { createNavItem, navItemStyles, navSectionClasses } from 'src/components/nav-section';

// ----------------------------------------------------------------------

export function NavItem({
  title,
  path,
  /********/
  open,
  active,
  /********/
  subItem,
  hasChild,
  className,
  externalLink,
  //Chaitali: Custom prop to customize the css for main heading
  itemType,
  ...other
}) {
  // console.log('NavItem path:', path, typeof path);
  const navItem = createNavItem({ path, hasChild, externalLink });

  const ownerState = { open, active, variant: !subItem ? 'rootItem' : 'subItem', itemType };

  return (
    <ItemRoot
      id="homeicon"
      disableRipple
      aria-label={title}
      {...ownerState}
      {...navItem.baseProps}
      className={mergeClasses([navSectionClasses.item.root, className], {
        [navSectionClasses.state.open]: open,
        [navSectionClasses.state.active]: active,
      })}
      {...other}
    >
      {/* <ItemTitle id="homeicon2" {...ownerState}>
        {' '}
        {title}
      </ItemTitle> */}
      <ItemTitle
        id="homeicon2"
        {...ownerState}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title === 'Home' ? (
          <Box
            component="img"
            src={`${CONFIG.assetsDir}/assets/images/home/icons/home-icon.svg`}
            alt="Home"
            sx={{
              width: 25,
              height: 25,

              // animation: 'float 2s ease-in-out infinite',

              // '@keyframes float': {
              //   '0%, 100%': {
              //     transform: 'translateY(0px)',
              //   },
              //   '50%': {
              //     transform: 'translateY(-2px)',
              //   },
              // },
            }}
          />
        ) : (
          title
        )}
      </ItemTitle>

      {hasChild && <ItemArrow {...ownerState} icon="eva:arrow-ios-downward-fill" />}
    </ItemRoot>
  );
}

// ----------------------------------------------------------------------

const shouldForwardProp = (prop) => !['open', 'active', 'variant', 'sx', 'itemType'].includes(prop);

/**
 * @slot root
 */
const ItemRoot = styled(ButtonBase, { shouldForwardProp })(({ active, open, theme, itemType }) => {
  const dotTransitions = {
    in: { opacity: 0, scale: 0 },
    out: { opacity: 1, scale: 1 },
  };

  const dotStyles = {
    ...dotTransitions.in,
    width: 6,
    height: 6,
    left: -12,
    content: '""',
    borderRadius: '50%',
    position: 'absolute',
    backgroundColor: varAlpha(theme.vars.palette.text.disabledChannel, 0.64),
    transition: theme.transitions.create(['opacity', 'scale'], {
      duration: theme.transitions.duration.shorter,
    }),
    ...(active && { ...dotTransitions.out, backgroundColor: theme.vars.palette.primary.main }),
  };

  const rootItemStyles = {
    ...(open && { '&::before': { ...dotTransitions.out } }),
    ...(active && { color: theme.vars.palette.primary.main }),
  };

  const subItemStyles = {
    color: theme.vars.palette.text.secondary,
    '&:hover': { color: theme.vars.palette.text.primary },
    ...(active && { color: theme.vars.palette.text.primary }),
  };

  return {
    transition: theme.transitions.create(['color'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&::before': dotStyles,
    '&:hover::before': { ...dotTransitions.out },
    variants: [
      { props: { variant: 'rootItem' }, style: rootItemStyles },
      { props: { variant: 'subItem' }, style: subItemStyles },
    ],
  };
});

/**
 * @slot title
 */

const ItemTitle = styled('span', {
  shouldForwardProp: (prop) => !['open', 'active', 'variant', 'sx', 'itemType'].includes(prop),
})(({ theme }) => ({
  ...navItemStyles.title(theme),
  ...theme.typography.body2,

  // default (unchanged)
  fontWeight: theme.typography.fontWeightMedium,

  variants: [
    // existing logic (unchanged)
    {
      props: { variant: 'subItem' },
      style: {
        fontSize: theme.typography.pxToRem(13),
      },
    },
    {
      props: { active: true },
      style: {
        fontWeight: theme.typography.fontWeightSemiBold,
      },
    },

    // subheader customization
    {
      props: { itemType: 'subheader' },
      style: {
        fontSize: theme.typography.pxToRem(11),
        fontWeight: theme.typography.fontWeightBold,

        overflow: 'unset',
        display: 'unset',
        textOverflow: 'unset',
      },
    },

    // optional: active + subheader logic
    {
      props: { itemType: 'subheader', active: true },
      style: {
        fontWeight: theme.typography.fontWeightBold,
      },
    },
  ],
}));

// const ItemTitle = styled('span', { shouldForwardProp })(({ theme, variant, active, itemType }) => ({
//   ...navItemStyles.title(theme),
//   ...theme.typography.body2,

//   // ✅ Default fontWeight
//   fontWeight:
//     itemType === 'subheader'
//       ? active
//         ? theme.typography.fontWeightBold
//         : theme.typography.fontWeightMedium
//       : theme.typography.fontWeightMedium,

//   // ✅ Default fontSize
//   fontSize: itemType === 'subheader' ? theme.typography.pxToRem(11) : undefined,

//   // ✅ KEEP original variants (unchanged)
//   variants: [
//     {
//       props: { variant: 'subItem' },
//       style: {
//         fontSize: theme.typography.pxToRem(13),
//       },
//     },
//     {
//       props: { active: true },
//       style: {
//         fontWeight: theme.typography.fontWeightBold,
//       },
//     },
//   ],
// }));

// const ItemTitle = styled('span', { shouldForwardProp })(({ theme }) => ({
//   ...navItemStyles.title(theme),
//   ...theme.typography.body2,
//   fontWeight: theme.typography.fontWeightMedium,
//   variants: [
//     {
//       props: { variant: 'subItem' },
//       style: {
//         fontSize: theme.typography.pxToRem(13),
//       },
//     },
//     {
//       props: { active: true },
//       style: {
//         fontWeight: theme.typography.fontWeightBold,
//       },
//     },
//   ],
// }));

// const ItemTitle = styled('span', { shouldForwardProp })(({ theme, variant, active, itemType }) => ({
//   ...navItemStyles.title(theme),
//   ...theme.typography.body2,
//   // fontWeight: theme.typography.fontWeightBold,

//   ...(itemType === 'subheader' && {
//     overflow: 'unset',
//     display: 'unset',
//     textOverflow: 'unset',
//   }),

//   fontWeight:
//     itemType === 'subheader'
//       ? active
//         ? theme.typography.fontWeightBold
//         : theme.typography.fontWeightMedium
//       : theme.typography.fontWeightMedium,

//   fontSize: itemType === 'subheader' ? theme.typography.pxToRem(11) : theme.typography.pxToRem(13),

//   ...(active && {
//     fontWeight: theme.typography.fontWeightBold,
//   }),
// }));

/**
 * @slot arrow
 */
const ItemArrow = styled(Iconify, { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.arrow(theme),
}));
