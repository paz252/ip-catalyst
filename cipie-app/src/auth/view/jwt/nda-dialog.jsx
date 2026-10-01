import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function NdaDialog({ open, onClose, onAgree }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 2 }}>Non-Disclosure Agreement (NDA)</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* <Typography variant="subtitle1" fontWeight={700}>
            NON-DISCLOSURE AGREEMENT (NDA) Between the CIP-IE Portal User and CIP-IE
          </Typography> */}

          <Typography variant="body2" color="text.secondary">
            The User understands that, upon submission of documents and information to Centre For
            Intellectual Property and Innovation Exchange (CIP-IE), the User shall be bound by this
            Non-Disclosure Agreement (NDA) with CIP-IE and the respective evaluation committee and
            may come into contact with &quot;Proprietary Information&quot; disclosing CIP-IE
            confidential information and intellectual property (including, without limitation,
            computer programs, and names and expertise and consultants, know-how, formulas,
            processes, ideas, inventions (whether patentable or not) schematics and other technical,
            business, financial, customer and product development plans, forecasts, strategies and
            information), which to the extent previously, presently, or subsequently disclosed to me
            is hereinafter referred to as &quot;Proprietary Information&quot; of CIP-IE.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            The Centre for Intellectual Property and Innovation Exchange (CIP-IE), under the
            Ministry of Electronics and Information Technology (MeitY), Government of India
            (hereinafter referred to as &quot;CIP-IE&quot;, which expression shall unless repugnant
            to the context or meaning thereof, include its successors in interests and assigns) of
            the one part.
          </Typography>

          {/* <Typography variant="body2" color="text.secondary">
            <strong>And</strong>
          </Typography> */}

          <Typography variant="body2" color="text.secondary">
            The CIP-IE website user incorporated (hereinafter referred to as &quot;User&quot; which
            expression shall, unless repugnant to the context or meaning thereof, be deemed to
            include, its representatives and permitted assigns) of the other part.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            CIP-IE shall maintain in strict confidence all documents, data, information, materials,
            and other content uploaded, submitted, or otherwise provided by the User to CIP-IE in
            connection with the services or activities covered under this Non-Disclosure Agreement
            (NDA). CIP-IE shall not disclose, share, reproduce, or make such information available
            to any third party without the prior written consent of the User, except where such
            disclosure is required by applicable law, regulation, or a competent governmental or
            judicial authority.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            CIP-IE and User shall hereinafter be referred to as such or collectively as
            &quot;Parties&quot; and individually as &quot;Party&quot;.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            For the purpose of preventing the unauthorized disclosure of Confidential Information as
            defined below. The parties agree to enter into a confidential relationship concerning
            the disclosure of certain proprietary and confidential information (&quot;Confidential
            Information&quot;).
          </Typography>

          <NdaSection title="1. Definition of Confidential Information">
            For purposes of this Agreement, &quot;Confidential Information&quot; shall include all
            information or material that has or could have commercial value or other utility in the
            business in which Disclosing Party is engaged. If Confidential Information is in written
            form, the Disclosing Party shall label or stamp the materials with the word
            &quot;Confidential&quot; or some similar warning. If Confidential Information is
            transmitted orally, the Disclosing Party shall promptly provide writing indicating that
            such oral communication constituted Confidential Information.
          </NdaSection>

          <NdaSection title="2. Exclusions from Confidential Information">
            Receiving Party&apos;s obligations under this Agreement do not extend to information
            that is: (a) publicly known at the time of disclosure or subsequently becomes publicly
            known through no fault of the Receiving Party. (b) discovered or created by the
            Receiving Party before disclosure by Disclosing Party. (c) learned by the Receiving
            Party through legitimate means other than from the Disclosing Party or Disclosing
            Party&apos;s representatives or (d) is disclosed by Receiving Party with Disclosing
            Party&apos;s prior written approval.
          </NdaSection>

          <NdaSection title="3. Obligations of Receiving Party">
            Receiving Party shall hold and maintain the Confidential Information in strictest
            confidence for the sole and exclusive benefit of the Disclosing Party. Receiving Party
            shall carefully restrict access to Confidential Information to employees, contractors
            and third parties as is reasonably required and shall require those persons to sign
            nondisclosure restrictions at least as protective as those in this Agreement. Receiving
            Party shall not, without the prior written approval of Disclosing Party, use for
            Receiving Part&apos;s benefit, publish, copy, or otherwise disclose to others, or permit
            the use by others for their benefit or to the detriment of Disclosing Party, any
            Confidential Information. Receiving Party shall return to Disclosing Party any and all
            records, notes, and other written, printed, or tangible materials in its possession
            pertaining to Confidential Information immediately if Disclosing Party requests it in
            writing.
          </NdaSection>

          <NdaSection title="4. Time Periods">
            The nondisclosure provisions of this Agreement shall survive the termination of this
            Agreement and Receiving Party&apos;s duty to hold Confidential Information in confidence
            shall remain in effect until the Confidential Information no longer qualifies as a trade
            secret or until Disclosing Party sends Receiving Party written notice releasing
            Receiving Party from this Agreement, whichever occurs first.
          </NdaSection>

          <NdaSection title="5. Relationships">
            Nothing contained in this Agreement shall be deemed to constitute either party a
            partner, joint venture or employee of the other party for any purpose.
          </NdaSection>

          <NdaSection title="6. Severability">
            If a court finds any provision of this Agreement invalid or unenforceable, the remainder
            of this Agreement shall be interpreted so as best to affect the intent of the parties.
          </NdaSection>

          <NdaSection title="7. Integration">
            This Agreement expresses the complete understanding of the parties with respect to the
            subject matter and supersedes all prior proposals, agreements, representations, and
            understandings. This Agreement may not be amended except in writing signed by both
            parties. By registering on this portal, I/We agree to comply with the NDA prescribed by
            CIP-IE.
          </NdaSection>

          <Alert severity="info" icon={<Iconify icon="solar:info-circle-bold" />}>
            By registering on this portal, I/We agree to comply with the NDA prescribed by CIP-IE.
          </Alert>

          <Typography variant="body2" color="text.secondary">
            I/We shall be responsible for maintaining the confidentiality of login credentials. Any
            activity carried out through my/our account shall be deemed to have been performed by
            me/us.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            I/We acknowledge that while reasonable efforts shall be made to maintain
            confidentiality, CIP-IE does not guarantee absolute security of data submitted through
            the portal.
          </Typography>

          <Divider />

          <Typography variant="body2" fontWeight={600}>
            By clicking &quot;Create Account&quot;, I/We confirm that I/We have read, understood,
            and agreed to all the above NDA.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onAgree} color="primary">
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function NdaSection({ title, children }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Box>
  );
}
