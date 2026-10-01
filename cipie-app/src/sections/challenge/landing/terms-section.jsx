import { useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Card,
  Container,
  Stack,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function TermsSection() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const terms = [
    {
      icon: 'solar:user-check-bold',
      title: 'Eligibility',
      points: [
        'The Challenge is open to individuals who are 18 years of age or older as on the date of submission.',
        'Employees, directors, officers, contractors, consultants, agencies, judges, organizers, and their immediate family members or relatives associated with IP Catalyst are not eligible to participate.',
      ],
    },
    {
      icon: 'solar:verified-check-bold',
      title:
        'Originality & ownership warranty: The participant confirms that the submitted logo is original, does not infringe any third-party rights, and that they have full ownership and authority to submit it',
      points: [
        'The logo is their original creation',
        'They own all rights in it',
        "It does not copy another person's logo / artwork",
        'It does not infringe copyright, trademark, design rights, personality / publicity rights or other third-party rights',
        'No stock / vector / template / AI-generated asset has been incorporated unless expressly disclosed and legally usable.',
      ],
    },
    {
      icon: 'solar:users-group-rounded-bold',
      title: 'Third party material specifically prohibited to incorporation of:',
      points: [
        'Existing trademarks',
        'Copyrighted illustrations',
        'Stock graphics',
        'Fonts with restrictive licenses',
        'Templates',
        'Photographs',
        'Icons / assets downloaded from the internet.',
      ],
    },
    {
      icon: 'solar:cpu-bold',
      title: 'AI generated content, require disclosure of:',
      points: [
        'Tool used',
        'Extent of AI assistance',
        'Source materials / prompts where relevant',
        'Self-declaration confirmation that the participant has the legal right to submit the resulting work.',
      ],
    },
    {
      icon: 'solar:document-add-bold',
      title:
        'Submission license: By accepting this term and condition for giving IP Catalyst a limited license to:',
      points: [
        'Display entries',
        'Reproduce them for judging',
        'Publish shortlisted entries',
        'Use them for challenge promotion.',
      ],
    },
    {
      icon: 'solar:medal-star-bold',
      title: 'Winner Selection',
      points: [
        'Rs. 15,000 is the single winning prize',
        'Selection is at the organizer level based on its requirements',
        'The organizer is not obligated to select / use any submission',
        'The organizer may reject all submissions if none meets its requirements.',
      ],
    },
    {
      icon: 'solar:copyright-bold',
      title: 'Copyright Assignment of Winning Logo',
      points: [
        'For the selected design payment of the Rs. 15,000 prize is consideration for assignment of the agreed intellectual property rights, but make the actual assignment conditional upon execution of a separate written Copyright Assignment / IP Assignment Agreement',
        'This is important because Section 19 requires copyright assignment to be in writing and signed and requires the assignment to identify the work and specify the rights, duration and territory',
      ],
    },
    {
      icon: 'solar:document-text-bold',
      title: 'IP Catalyst shall have all Copyright rights for the Winning Logo:',
      points: [
        'Reproduction',
        'Publication',
        'Adaptation',
        'Modification',
        'Color / monochrome variations',
        'Resizing',
        'Digitization',
        'Incorporation into websites / apps / software',
        'Print and digital advertising',
        'Merchandise',
        'Social media',
        'Packaging',
        'Presentations',
        'Signage',
        'Commercial use',
        'Sublicensing / authorizing third parties',
      ],
    },
    {
      icon: 'solar:global-bold',
      title:
        'The participant hereby assigns to IP Catalyst the Worldwide perpetual rights the copyright assignment is:',
      points: ['Worldwide', 'The full duration of copyright permitted by applicable law'],
    },
    {
      icon: 'solar:tag-bold',
      title: 'Trademark Rights',
      points: [
        'The Winner agrees to assign and transfer to IP Catalyst any trademark related rights, title, interest or goodwill that the Winner may have in the winning logo, name or design',
        'The Winner shall also execute all documents and provide all reasonable assistance required by IP Catalyst for trademark applications, prosecution, registration, assignment and transfer of the winning logo in the name of IP Catalyst',
      ],
    },
    {
      icon: 'solar:close-circle-bold',
      title: 'No Future Claim',
      points: [
        'The winner should acknowledge that, after the agreed assignment and payment, they will not claim additional license fees, royalties, commissions or other consideration for the agreed uses',
      ],
    },
    {
      icon: 'solar:document-text-bold',
      title: 'Trademark Registration Application by IP Catalyst',
      points: [
        'State that IP Catalyst may apply for registration of the winning logo as a trademark in its own name, in such classes and jurisdictions as it considers appropriate',
      ],
    },
    {
      icon: 'solar:hand-shake-bold',
      title: 'The winner should agree to sign additional documents needed for:',
      points: [
        'Copyright assignment',
        'Trademark assignment',
        'Trademark applications',
        'Declarations',
        'Affidavits',
        'Recordal of ownership',
        'Responding to IP-office requirements',
      ],
    },
    {
      icon: 'solar:forbidden-circle-bold',
      title:
        'IP Catalyst reserves the right, at its sole discretion, to disqualify any applicant or submission at any time, with or without assigning any reason, and without any liability to the applicant.',
      // points: [
      //   'It violates the rules',
      //   'It contains infringing material',
      //   'The participant supplied false information',
      //   'The participant cannot establish ownership',
      //   'The design creates unacceptable legal / IP risk',
      // ],
    },
    {
      icon: 'solar:pen-new-square-bold',
      title: 'Right to Modify the Winning Logo',
      points: [
        'IP Catalyst may modify the winning logo for branding, technical, trademark, design or commercial purposes, subject to the separate assignment / consent documentation',
      ],
    },
    {
      icon: 'mage:megaphone-a-fill',
      title: 'The winner name and display the winning logo publicly in:',
      points: [
        'Website',
        'Social media',
        'Press releases',
        'Promotional material',
        'Challenge documentation',
      ],
    },
    {
      icon: 'solar:users-group-two-rounded-bold',
      title: 'No Employment / Agency Relationship',
      points: [
        'Participation does not create an employment, partnership, agency or joint-venture relationship',
      ],
    },
    {
      icon: 'solar:gallery-bold',
      title: 'Logo Size & Format',
      points: [
        'The logo should be submitted in a high resolution, preferably in JPG and PNG versions and must remain clear and recognizable when resized for trademark, digital, print and other branding applications',
      ],
    },
    {
      icon: 'solar:checklist-minimalistic-bold',
      title: 'Selection Criteria',
      points: [
        'As part of the selection process, IP Catalyst may conduct trademark and intellectual property searches across relevant classes, including Classes 9, 16, 35, 41, 42 and 45, to assess potential conflicts, similarities or infringement risks associated with the submitted logo',
        'The selection will be based on IP Catalysts requirements',
      ],
    },
    {
      icon: 'solar:menu-dots-bold',
      title: 'Other',
      points: [
        'If any document, declaration, assignment, consent, undertaking, form or other instrument required for the transfer, assignment, registration, protection or enforcement of the intellectual property or trademark rights in the winning logo is not executed at the time of selection or payment of the prize, the Winner agrees to execute and deliver such document(s) whenever requested by IP Catalyst, including at any later date, without any additional consideration, to the extent permitted by applicable law. The Winner shall provide all reasonable cooperation necessary to give full effect to the rights and ownership of IP Catalyst in the winning logo',
      ],
    },
  ];

  return (
    <Container
      id="terms-section"
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="overline" color="primary.main" fontWeight={700}>
          TERMS & CONDITIONS
        </Typography>

        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
          Competition Rules
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 720, textAlign: 'center' }}
        >
          Please read the following terms carefully before submitting your logo design.
        </Typography>
      </Stack>

      {/* ================= TERMS ================= */}
      <Card
        sx={{
          mt: 2,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: (theme) => theme.customShadows.z12,
          overflow: 'hidden',
        }}
      >
        <Stack spacing={0}>
          {terms.map((item, index) => {
            const panel = `panel${index + 1}`;
            const isExpanded = expanded === panel;

            return (
              <Accordion
                key={item.title}
                expanded={isExpanded}
                onChange={handleChange(panel)}
                disableGutters
                elevation={0}
                sx={{
                  borderRadius: 0,
                  '&:before': {
                    display: 'none',
                  },
                  borderBottom:
                    index !== terms.length - 1 ? '1px solid rgba(145,158,171,0.12)' : 'none',
                }}
              >
                <AccordionSummary
                  // className="hello"
                  expandIcon={
                    <Iconify icon={isExpanded ? 'eva:minus-fill' : 'eva:plus-fill'} width={22} />
                  }
                  sx={{
                    px: '20px !important;',
                    minHeight: 80,

                    '& .MuiAccordionSummary-content': {
                      my: 1,
                    },

                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      width: '100%',
                      // px: 4
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'error.lighter',
                        color: 'error.main',
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                      }}
                    >
                      <Iconify icon={item.icon} width={24} />
                    </Avatar>

                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.title}
                    </Typography>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    px: { xs: 3, md: 4 },
                    pb: 3,
                    pt: 0,
                  }}
                >
                  <Box
                    sx={{
                      ml: { xs: 0, md: 8 },
                      px: { xs: 0, md: 1 },
                    }}
                  >
                    <Stack spacing={1}>
                      {/* {item?.point && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.8,
                          }}
                        >
                          {item.point}
                        </Typography>
                      )} */}
                      {item.points?.length > 0 ? (
                        <Box component="ul" sx={{ mt: 1, pl: 2.5 }}>
                          {item.points.map((point, pointIndex) => (
                            <Stack
                              key={pointIndex}
                              direction="row"
                              spacing={1}
                              alignItems="flex-start"
                              sx={{ px: { xs: 2, md: 0 } }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  color: 'error.main',
                                  fontWeight: 700,
                                  lineHeight: 1.8,
                                }}
                              >
                                •
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  lineHeight: 1.8,
                                }}
                              >
                                {point}
                              </Typography>
                            </Stack>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                          Please review this condition carefully before submitting your entry.
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      </Card>

      {/* ================= IMPORTANT NOTICE ================= */}
      <Alert
        severity="warning"
        variant="outlined"
        sx={{
          mt: 4,
          borderRadius: 3,
        }}
        icon={<Iconify icon="solar:danger-triangle-bold" />}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Important Notice
        </Typography>

        <Typography variant="body2">
          CIPIE reserves the right to disqualify any submission that violates the competition rules
          or contains inappropriate, misleading, or copyrighted content.
        </Typography>
      </Alert>
    </Container>
  );
}
