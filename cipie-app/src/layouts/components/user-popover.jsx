import { m } from 'framer-motion';
import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CustomPopover } from 'src/components/custom-popover';
import { varTap, varHover, transitionTap } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';

import { SignOutButton } from './sign-out-button';

export function UserPopover({ sx, ...other }) {
    const { open, anchorEl, onClose, onOpen } = usePopover();
    const { user } = useAuthContext();

    const getInitial = (email) => email?.charAt(0).toUpperCase();

    const renderMenuList = () => (
        <CustomPopover open={open} anchorEl={anchorEl} onClose={onClose}>
            <MenuList
                sx={(theme) => ({
                    width: {
                        xs: 140,   // 📱 mobile
                        sm: 160,
                        md: 180,
                    },
                    // minHeight: 'auto',
                    py: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                })}
            >

                {/* Optional: show email */}
                <MenuItem disabled
                    sx={{
                        minHeight: { xs: 32, sm: 20 },   // 📱 smaller on mobile
                         px: { xs: 1.5, sm: 2 },
                        fontSize: { xs: 13, sm: 14 },
                    }}>
                    {user?.email}
                </MenuItem>

                <Divider />

                <MenuItem
                    component={RouterLink}
                    href={paths.dashboard.root}
                    onClick={onClose}
                    sx={{
                        minHeight: { xs: 32, sm: 20 },   // 📱 smaller on mobile
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.5, sm: 1 },
                        fontSize: { xs: 13, sm: 14 },
                    }}
                >
                    Dashboard
                </MenuItem>

                <MenuItem disableRipple sx={{ p: 0 }}>
                    <SignOutButton
                        onClose={onClose}
                        size="medium"   // 👈 override large
                        sx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            minHeight: { xs: 32, sm: 20 },
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 0.5, sm: 1 },
                            fontSize: { xs: 13, sm: 14 },
                        }}
                    />
                </MenuItem>

            </MenuList>
        </CustomPopover>
    );

    return (
        <>
            <IconButton
                component={m.button}
                whileTap={varTap(0.96)}
                whileHover={varHover(1.04)}
                transition={transitionTap()}
                onClick={onOpen}
                sx={[
                    (theme) => ({
                        p: 0,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        transition: 'all 0.2s ease',

                        '&:hover': {
                            bgcolor: theme.vars.palette.action.hover,
                        },

                        '&:hover .user-avatar': {
                            bgcolor: theme.vars.palette.primary.main,
                            color: theme.vars.palette.primary.contrastText,
                        },
                    }),
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                {...other}
            >
                <Avatar
                    className="user-avatar"
                    sx={(theme) => ({
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        fontWeight: 600,
                        bgcolor: theme.vars.palette.primary.soft,   // ✅ soft color
                        color: theme.vars.palette.primary.main,
                        transition: 'all 0.2s ease',
                    })}
                >
                    {getInitial(user?.email)}
                </Avatar>
            </IconButton>

            {renderMenuList()}
        </>
    );
}