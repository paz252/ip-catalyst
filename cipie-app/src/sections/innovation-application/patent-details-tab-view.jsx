import { useState } from 'react';
import PropTypes from 'prop-types';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { PATENT_DETAILS_TAB_OPTIONS } from 'src/_mock';
import CustomTimeline from 'src/pages/innovation-application/CustomTimeline';

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

export default function PatentDetailsTabView({ patent }) {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);

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
        {icon && <Iconify icon={icon} width={16} sx={{ color: 'primary.main' }} />}
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
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

    return (
      <Stack sx={{ p: 1 }}>
        <Row
          label="Patent / Application Number"
          icon="solar:copy-bold"
          value={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{patent?.recordNumber}</Typography>

              <Tooltip title={copied ? 'Copied' : 'Copy'}>
                <IconButton size="small" onClick={() => handleCopy(patent?.recordNumber)}>
                  <Iconify icon="solar:copy-bold" width={16} />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
        {/* <Row
          label="Legal Status"
          icon="solar:shield-check-bold"
          value={
            <Typography sx={{ color: 'success.main' }}>{patent.legalStatusCurrent}</Typography>
          }
        /> */}

        <Row
          label="Legal Status"
          icon="solar:shield-check-bold"
          value={
            <Chip
              label={patent.legalStatusCurrent}
              size="small"
              color="info"
              variant="soft"
              // sx={{ fontSize: '0.8125rem !important' }}
            />
          }
        />

        <Row
          label="Filing Date"
          icon="solar:calendar-bold"
          value={fDate(patent?.filingApplicationDate)}
        />

        <Row label="Technology Domain" icon="solar:cpu-bold" value={patent?.mainTechnologyDomain} />

        <Row
          label="TRL Level"
          icon="solar:chart-2-bold"
          value={<CustomTimeline trlLevel={patent.trlLevel} />}
        />
      </Stack>
    );
  };

  const AssigneeInventorsTab = () => {
    if (!patent) return null;

    return (
      <Stack sx={{ p: 1 }}>
        <Row label="Assignee" icon="mdi:office-building" value={patent.assignee} />

        <Row
          label="Inventors"
          icon="mdi:account-group"
          value={patent.inventors?.replaceAll(' ;', ',')}
        />
      </Stack>
    );
  };

  const AbstractTab = () => (patent ? <TextBlock content={patent.abstract} /> : null);

  const ClaimsTab = () => (patent ? <TextBlock content={patent.claims} /> : null);

  const TAB_DATA = [InformationTab, AssigneeInventorsTab, AbstractTab, ClaimsTab];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} variant="scrollable" scrollButtons="auto">
          {PATENT_DETAILS_TAB_OPTIONS.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              sx={{
                textTransform: 'none',
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
