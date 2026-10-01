import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

// ----------------------------------------------------------------------

export function TermsConditionDialog({ open, onClose, onAgree }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ pb: 2 }}>CIP-IE Website Terms and Conditions</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="body2">
            By accepting the CIP-IE Website Terms and Conditions, the registered User agrees and
            authorizes CIP-IE to host and list details of the User&apos;s invention in the CIP-IE IP
            Pool <strong>after the filing of the corresponding patent application</strong>, subject
            to the terms and conditions applicable to the CIP-IE IP Pool. Such hosting shall be
            undertaken only after the patent application has been filed and shall not affect the
            confidentiality of the invention prior to such filing.
          </Typography>

          <Typography variant="body2">
            By accepting the CIP-IE Website Terms and Conditions, the registered User agrees and
            authorizes CIP-IE,{' '}
            <strong>after the filing of the corresponding patent application</strong>, to use the
            User&apos;s invention and related information for legitimate artificial intelligence
            (AI), research, analysis, technology assessment, and related non-commercial purposes.
            Such use shall not constitute or be construed as a transfer, assignment, or licensing of
            any intellectual property rights in the invention to CIP-IE, and all ownership and
            intellectual property rights shall remain with the User or the respective rights holder.
          </Typography>

          <Typography variant="body2">
            CIP-IE shall ensure that all information, content, and materials hosted, processed, or
            made available through the CIP-IE platform are handled with due regard to integrity,
            ethical standards, applicable laws, and national interest. CIP-IE shall take reasonable
            measures to prevent the misuse, unauthorized disclosure, or dissemination of information
            in a manner that may adversely affect national security, public interest, or the
            reputation and integrity of the nation.
          </Typography>

          <Typography variant="body2">
            I/We confirm that all information provided during registration is true, accurate and
            complete. I/We understand that submission of false or misleading information may lead to
            rejection, suspension or termination of registration.
          </Typography>

          <Typography variant="body2">
            I/We understand that registration on the portal is non-transferable and intended only
            for the registered individual/entity.
          </Typography>

          <Typography variant="body2">
            I/We understand that registration on the portal only enables submission of requests for
            IP Catalyst program services and does not guarantee eligibility, approval or financial
            assistance.
          </Typography>

          <Typography variant="body2">
            I/We agree to provide updated and accurate information whenever required and to respond
            promptly to any communication from CIP-IE or authorized stakeholders.
          </Typography>

          <Typography variant="body2">
            I/We consent to the collection, storage and processing of submitted data for application
            processing, evaluation, monitoring and reporting under Government programs.
          </Typography>
          <Typography variant="body2">
            I/We understand that my/our information may be shared with authorized entities such as
            expert committees, empanelled agencies or government authorities as required.
          </Typography>
          <Typography variant="body2">
            I/We agree that CIP-IE shall not be liable for any issues arising due to incorrect
            information provided by me/us, technical failures, system downtime or unauthorized
            access caused by my/our actions.
          </Typography>
          <Typography variant="body2">
            I/We understand that CIP-IE reserves the right to suspend or terminate my/our
            registration without prior notice in case of misrepresentation, misuse of the portal or
            violation of applicable rules.
          </Typography>
          <Typography variant="body2">
            I/We agree and accept that CIP-IE shall not be responsible or liable for any direct,
            indirect, incidental or consequential loss or damage, including but not limited to loss
            of profits, loss of business, loss of opportunities, loss of data, or loss of
            expertise/knowledge.
          </Typography>
          <Typography variant="body2">
            I/We understand that CIP-IE may cancel my/our registration or restrict access to the
            portal and its services at any time without prior notice.
          </Typography>
          <Typography variant="body2">
            I/We undertake, promise, assure, and confirm that the services availed through this
            portal shall not be resold, reused, or shared with any person for any fee or commercial
            purpose, and shall be used strictly for self-use only.
          </Typography>
          <Typography variant="body2">
            I/We agree that CIP-IE is not responsible for any loss, direct or indirect, arising from
            the use of this portal or services.
          </Typography>

          <Typography variant="body2">
            I/We agree that these Terms & Conditions may be modified at any time by CIP-IE, and
            continued use of the portal shall constitute acceptance of such changes.
          </Typography>
          <Typography variant="body2">
            By clicking “Register”, I/we confirm that I/we have read, understood, and agreed to all
            the above Terms & Conditions.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onAgree} color="primary">
          I Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}
