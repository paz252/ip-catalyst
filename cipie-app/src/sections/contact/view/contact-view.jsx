import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { _mapContact } from 'src/_mock';

import { ContactMap } from '../contact-map';
import { ContactHero } from '../contact-hero';
import { ContactForm } from '../contact-form';
import { ContactAddress } from '../contact-address';

// ----------------------------------------------------------------------

export function ContactView() {
  return (
    <>
      <ContactHero />
      <Container component="section" sx={{ py: 10 }}>
        <Box
          sx={{
            gap: 10,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            justifyItems: 'center',
          }}
        >
          <ContactForm />
          <ContactAddress />
          {/* <ContactMap contacts={_mapContact} /> */}
        </Box>
      </Container>
    </>
  );
}
