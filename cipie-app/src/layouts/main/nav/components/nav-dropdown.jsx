import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const NavDropdownPaper = styled('div')(({ theme }) => ({
  ...theme.mixins.paperStyles(theme, { dropdown: true }),
  padding: theme.spacing(5, 5, 1, 4), //(5114)
  borderRadius: Number(theme.shape.borderRadius) * 2,
  // maxHeight: '80vh',
  // overflowY: 'auto',
  // borderRadius: '10px',
  ...(theme.direction === 'rtl' && {
    padding: theme.spacing(5, 4, 1, 1),
  }),
}));

// ----------------------------------------------------------------------

export const NavDropdown = styled(({ open, children, ...other }) => (
  <Fade in={open}>
    <div {...other}>
      <NavDropdownPaper>{children}</NavDropdownPaper>
    </div>
  </Fade>
))(({ theme }) => ({
  left: 0,
  right: 0,
  marginTop: 12,
  width: '100%',
  position: 'fixed',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: theme.spacing(1.5),
  zIndex: theme.zIndex.drawer * 2,
  // border: '4px solid yellow',
  maxWidth: theme.breakpoints.values.lg,
  // maxWidth: theme.breakpoints.values.xl,
  top: 'calc(var(--layout-header-desktop-height) / 2)',
}));
