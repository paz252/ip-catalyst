import { m } from 'framer-motion';
import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';

import {
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
  Paper,
  Tabs, Tab
} from '@mui/material';

import { MeityHero } from '../meity';

export function MeityPageView() {
  const refs = useRef({});
  const [active, setActive] = useState('about');

  const handleScroll = (id) => {
    setActive(id);
    const el = refs.current[id];
    if (!el) return;

    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const sidebarItems = [
    { id: 'about', label: 'About', icon: 'mdi:information-outline' },
    { id: 'eligibility', label: 'Eligibility', icon: 'mdi:shield-check-outline' },
    { id: 'terms', label: 'Terms & Conditions', icon: 'mdi:gavel' },
    { id: 'applications', label: 'Applications', icon: 'mdi:file-document-outline' },
  ];

  return (
    <>
      <MeityHero />

      <Box sx={{ mx: 'auto', px: 2 }}>
        <Grid container spacing={4}>

          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Paper sx={{ borderRadius: 3, p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Sections
                </Typography>

                <List>
                  {sidebarItems.map((item) => {
                    const isActive = active === item.id;

                    return (
                      <ListItemButton
                        key={item.id}
                        onClick={() => handleScroll(item.id)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: isActive ? 'action.selected' : 'transparent',
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Icon
                            icon={item.icon}
                            width={20}
                            style={{ color: isActive ? '#1976d2' : '#888' }}
                          />
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                          />
                        </Stack>
                      </ListItemButton>
                    );
                  })}
                </List>
              </Paper>
            </Box>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={9}>

            {/* Mobile Tabs Nav */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
              <Tabs
                value={active}
                onChange={(e, val) => handleScroll(val)}
                sx={[(theme) => ({
                  boxShadow: `0px -2px 0px 0px ${theme.vars ? `rgba(${theme.vars.palette.grey['500Channel']} / 0.08)` : 'rgba(0,0,0,0.08)'} inset`,
                })]}
              >
                {sidebarItems.map((item) => (
                  <Tab
                    key={item.id}
                    label={item.label}
                    value={item.id}
                  />
                ))}
              </Tabs>
            </Box>

            <Stack spacing={6}>

              {/* ABOUT */}
              <Box ref={(el) => (refs.current.about = el)} component={m.div}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>About</Typography>

                  <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
                    The “IP Catalyst: Support for IP Management” program is operates through three integrated components: International Patent Filing Support (IPFS), IP Facilitation for domestic IP filings and Innovation Promotion Activities such as training, challenge rounds and industry meets. Together, these components create a holistic ecosystem that not only supports IP generation but also promotes its effective utilization and commercialization.
                  </Typography>

                  <Box
                    component="img"
                    src="/assets/images/about-ipfs.png"
                    sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                  />

                  <Typography sx={{ lineHeight: 1.8 }}>
                    This section outlines the eligibility criteria and applicable terms & conditions for MeitY: Societies / Autonomous Bodies and Grantee Institutions (project specific only) seeking support under the International Patent Filing Support (IPFS) component
                  </Typography>
                </Paper>
              </Box>

              {/* ELIGIBILITY */}
              <Box ref={(el) => (refs.current.eligibility = el)} component={m.div}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>Eligibility</Typography>

                  <Stack spacing={1.5}>
                    <Typography>• MeitY R&D societies / Autonomous bodies: support will be given to all IP generated by the organisation.</Typography>
                    <Typography>• Grantee Institutions: support will be given to only IP generated under MeitY funded project only.</Typography>
                    <Typography>• MeitY R&D societies / Autonomous bodies/ Grantee Institutions: Any IP generated collaboratively the IPFS support will be provided as per the MoU signed by the organisations.</Typography>
                  </Stack>
                </Paper>
              </Box>

              {/* TERMS */}
              <Box ref={(el) => (refs.current.terms = el)} component={m.div}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>Terms & Conditions</Typography>

                  <Stack spacing={1.5}>
                    <Typography>• International Patent Applications may be filed in multiple countries allowed under IPFS program.</Typography>
                    <Typography>• Maximum patent filing support in the form of services, with total expenditure limited to ₹20 lakh per invention.</Typography>
                    <Typography>• International Patent Applications under IPFS program additional expenditure beyond ₹20 lakh may be approved on a case-to-case basis from expert committee.</Typography>
                    <Typography>• Maintenance of granted patents under IPFS program shall be maintained up to 5 years after grant. Beyond this period, patents will be maintained only if there is demonstrated commercial potential or active commercialization efforts.</Typography>
                  </Stack>
                </Paper>
              </Box>

              {/* APPLICATION STEPS */}
              <Box ref={(el) => (refs.current.applications = el)} component={m.div}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>Applications</Typography>

                  <Stack spacing={3}>
                    {[
                      { title: 'Registration', desc: 'Register on the CIPIE Portal' },
                      { title: 'Document Submission', desc: 'Submit supporting documents and Invention Disclosure Form' },
                      { title: 'Initial Review & Patentability Search', desc: 'Technical and patentability evaluation by CIPIE' },
                      { title: 'Expert Committee Recommendation', desc: 'Evaluation by Expert Committee Recommendation' },
                      { title: 'Patent Filing', desc: 'Application forwarded to the recommended attorney. Filing executed through CIPIE' },
                      { title: 'Financial Disbursement', desc: 'C-DAC Finance verifies bills and releases funds accordingly' },
                    ].map((step, index) => (
                      <Stack direction="row" spacing={2} key={index}>
                        <Box
                          sx={{
                            minWidth: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                          }}
                        >
                          {index + 1}
                        </Box>

                        <Box>
                          <Typography fontWeight={600}>{step.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {step.desc}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Box>

            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
