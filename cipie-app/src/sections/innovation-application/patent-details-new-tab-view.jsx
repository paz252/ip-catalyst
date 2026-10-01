import { useState } from 'react';
import PropTypes from 'prop-types';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { IconButton, ListItemText, Stack, Tooltip, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { PATENT_DETAILS_TAB_OPTIONS } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function PatentDetailsNewTabView({ patent }) {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);

  const informationItems = [
    {
      label: 'Patent / Application Number',
      value: patent?.recordNumber,
      icon: <Iconify icon="solar:file-text-bold" sx={{ width: 15 }} />,
    },

    patent?.legalStatusCurrent != null && {
      label: 'Legal Status',
      value: patent.legalStatusCurrent,
      icon: <Iconify icon="solar:shield-check-bold" sx={{ width: 15 }} />,
    },

    {
      label: 'Filing Date',
      value: fDate(patent?.filingApplicationDate),
      icon: <Iconify icon="solar:calendar-bold" sx={{ width: 15 }} />,
    },

    {
      label: 'Main Domain',
      value: patent?.mainTechnologyDomain,
      icon: <Iconify icon="solar:cpu-bold" sx={{ width: 16 }} />,
    },

    {
      label: 'Sub Domain',
      value: patent?.techSubDomain,
      icon: <Iconify icon="solar:widget-bold" sx={{ width: 14 }} />,
    },

    patent?.userType != null && {
      label: 'User Role',
      value: patent.userType,
      icon: <Iconify icon="boxicons:user-filled" sx={{ width: 15 }} />,
    },
    // patent?.trlLevel != null && {
    //   label: 'TRL Level',
    //   value: <CustomTimeline trlLevel={patent.trlLevel} />,
    //   icon: <Iconify icon="solar:chart-2-bold" sx={{ width: 15 }} />,
    // },
  ].filter(Boolean);

  const renderInformation = () => (
    <Box
      sx={{
        gap: 4,
        display: 'grid',
        // gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        gridTemplateColumns: '1fr',
      }}
    >
      {informationItems.map((item) => (
        <Box key={item.label} sx={{ gap: 1.5, display: 'flex' }}>
          {item.icon}
          {/* <ListItemText
            primary={item.label}
            secondary={item.value}
            slotProps={{
              primary: {
                sx: { typography: 'body2', color: 'text.secondary' },
              },
              secondary: {
                sx: { mt: 0.5, color: 'text.primary', typography: 'subtitle2' },
              },
            }}
          /> */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {item.label}
            </Typography>

            {item.label === 'Patent / Application Number' ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2" sx={{ mt: 0.5, color: 'text.primary' }}>
                  {item.value}
                </Typography>

                <Tooltip title={copied ? 'Copied' : 'Copy'}>
                  <IconButton size="small" onClick={() => handleCopy(item.value)}>
                    <Iconify icon="solar:copy-bold" width={16} />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Typography variant="subtitle2" sx={{ mt: 0.5, color: 'text.primary' }}>
                {item.value}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );

  const renderAssigneeInventors = () => (
    <Box
      sx={{
        gap: 4,
        display: 'grid',
        direction: 'column',
        gridTemplateColumns: '1fr',
      }}
    >
      {[
        {
          label: 'Assignee',
          value: patent?.assignee,
          icon: <Iconify icon="mdi:office-building" sx={{ width: 16 }} />,
        },
        {
          label: 'Inventors',
          value: patent?.inventors?.replaceAll(' ;', ','),
          icon: <Iconify icon="mdi:account-group" sx={{ width: 16 }} />,
        },
      ].map((item) => (
        <Box key={item.label} sx={{ gap: 1.5, display: 'flex' }}>
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            slotProps={{
              primary: {
                sx: { typography: 'body2', color: 'text.secondary' },
              },
              secondary: {
                sx: { mt: 0.5, color: 'text.primary', typography: 'subtitle2' },
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );

  const handleCopy = async (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // prevent scroll jump
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);

      // console.log('Copied!');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const Row = ({ label, value, icon }) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' },
        gap: 1.5,
        py: 1.5,
        px: 2,
        borderRadius: 2,
        // alignItems: 'center',
        alignItems: 'start',

        '&:nth-of-type(odd)': {
          bgcolor: 'grey.50',
        },
      }}
    >
      {/* Label with Icon */}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* {icon && <Iconify icon={icon} width={16} sx={{ color: 'text.secondary' }} />} */}
        {icon && <Iconify icon={icon} sx={{ color: '#c94e4e' }} />}
        {/* color: '#c94e4e' */}
        <Typography
          variant="body2"
          sx={{
            // textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
      </Stack>

      {/* Value */}
      <Box /*sx={{ fontSize: '0.8125rem' }}*/>{value}</Box>
    </Box>
  );

  const TextBlock = ({ content }) => (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'grey.50',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          textAlign: 'justify',
          whiteSpace: 'pre-line',
          lineHeight: 1.7,
        }}
      >
        {content}
      </Typography>
    </Box>
  );

  // ================= TABS =================

  const InformationTab = () => {
    if (!patent) return null;

    return renderInformation();
  };

  const AssigneeInventorsTab = () => {
    if (!patent) return null;
    return renderAssigneeInventors();
  };

  const AbstractTab = () => (patent ? <TextBlock content={patent.abstract} /> : null);

  const ClaimsTab = () => (patent ? <TextBlock content={patent.claims} /> : null);

  const TAB_DATA = [InformationTab, AssigneeInventorsTab, AbstractTab, ClaimsTab];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {/* <Tabs value={tabValue} onChange={handleChange} variant="scrollable" scrollButtons="auto" > */}
        <Tabs
          value={tabValue}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              // backgroundColor: '#df5839', // your brand color
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {PATENT_DETAILS_TAB_OPTIONS.map((tab, index) => (
            <Tab
              key={index}
              // icon={<Iconify icon={tab.icon} width={16} />}
              iconPosition="start"
              label={tab.label}
              sx={{
                textTransform: 'none',
                fontSize: '0.975rem',
                fontWeight: 600,
              }}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {TAB_DATA.map((TabComponent, index) => (
        <CustomTabPanel key={index} value={tabValue} index={index}>
          <TabComponent />
        </CustomTabPanel>
      ))}
    </Box>
  );
}
