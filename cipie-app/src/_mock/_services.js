import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const STARTUP_IPFS_TABS_DETAILS = [
  { label: 'About', value: 'about' },
  { label: 'Eligibility', value: 'eligibility' },
  { label: 'Terms & Conditions', value: 'terms-condition' },
  { label: 'Apply Under IPFS Program', value: 'application' },
];

export const IPFS_TABS_DETAILS = [
  { label: 'About', value: 'about' },
  { label: 'Eligibility', value: 'eligibility' },
  { label: 'Terms & Conditions', value: 'terms-condition' },
  { label: 'Apply Under IPFS Program', value: 'application' },
];

export const STARTUP_TAB_CONTENT = {
  ABOUT_CONTENT: `
<h5>International Patent Filing Support (IPFS)</h5>

<p>This program focuses on enabling Indian Startups and MSMEs innovators to secure foreign patent protection for their inventions. It provides comprehensive patent filing support in the form of services, with total expenditure limited to ₹20 lakh per invention. Each invention is eligible for filing patents in multiple international jurisdictions through recognized routes such as the Paris Convention, Patent Cooperation Treaty (PCT) and Direct Filing. </p>
<p>The International Patent Filing Support (IPFS) program for Startups and MSMEs shall be provided to eligible applicants under the following categories:
</p>

<div>
<h6>1. Direct Filing </h6>
<p>Startups/MSMEs may directly file a patent application in a foreign country without prior filing in India, subject to obtaining prior permission (Foreign Filing License) from the Indian Patent Office, as required under the Indian Patents Act. This route is useful when immediate protection is required in a specific foreign jurisdiction.</p>
</div>

<div>
<h6>2. Paris Convention Route </h6>
<p>Under the Paris Convention for the Protection of Industrial Property (1883), Startups/MSMEs that have first filed a patent application in India may file corresponding patent applications in member countries within 12 months from the priority filing date. This route allows the Startups/MSMEs to claim priority from the earliest filed Indian application. 
</p>
<p>Startups/MSMEs should ensure sufficient time (preferably more than 3 months before the deadline) to complete documentation and filing procedures.</p>
</div>

<div>
<h6>3. Patent Cooperation Treaty (PCT) Route
</h6>
<p>The Patent Cooperation Treaty (PCT) enables Startups/MSMEs to file a single international patent application to seek protection in more than 150 countries. It provides an extended timeline of 30/31 months from the priority date for entering national phase applications in respective countries, along with international search, publication and preliminary examination.
</p>
<p>If Startups/MSMEs have already filed an Indian patent application and intend to file a PCT application then they get 12 month time period.  They should ensure sufficient time (preferably more than 3 months before the deadline) to complete documentation and filing procedures.</p>
</div>

<div>
<h6>4. PCT Filled Application with Positive ISR </h6>
<p>Startups/MSMEs that have already filed a PCT application and received a positive International Search Report (ISR) indicating patentability of the invention may seek support under IPFS program for national phase entry in PCT participating countries jurisdictions. 
</p>
<p>Applicants should ensure sufficient time (preferably more than 3 months before the deadline) to complete documentation and filing procedures.</p>
</div>
`,

  ELIGIBILITY_CONTENT: `
<ul>
  <li>Startups must be recognized by DPIIT, Government of India with shareholding by Indian promoters in the startup should be at least 51% at the time of application. 
</li>
  <li>MSMEs must have valid Udyam (UAM) Registration with shareholding by Indian promoters in the startup should be at least 51% at the time of application. 
</li>
  <li>The invention must be in the ICT domain.</li>
  <li>The patent application must be filed in the name of enterprise. </li>
  <li>The applicant must not have received or claim in the future, similar financial support / reimbursement for the same invention from any Central or State Government scheme.</li>
</li>
 </ul>`,

  TERMS_CONDITION_CONTENT: `
<ul>
  <li>It provides comprehensive patent filing support in the form of services, with total expenditure limited to ₹20 lakh per invention.</li>
  <li>Support covers patent filing and prosecution costs up to patent application grant, excluding maintenance fees.</li> 
  <li>Applications may be filed in multiple international jurisdictions.</li>
  <li>A maximum of 5 applications per financial year per organization may be considered, subject to Expert Committee approval.</li>
  <li>Support is provided only after recommendation by the Expert Committee.</li>
  <li>Applying under the scheme does not guarantee approval.</li>
  <li>Patent ownership remains with the enterprise.</li>
  <li>Modification after patent filing will not be permitted.</li>
  <li>Any maintenance fees (if applicable before grant) shall be borne by the applicant.</li>
  <li>IP Catalyst reserves the right to revoke or cancel any application at any stage, without prior notice.</li>
</ul>
`,

  APPLICATION_CONTENT: `
<p><strong>Step 1: Registration</strong></p>
<ul>
  <li>Visit the CIPIE Portal</li>
  <li>Complete user registration</li>
</ul>

<p><strong>Step 2: Scheme Selection</strong></p>
<ul>
  <li>Select International Patent Filing Support (IPFS)</li>
</ul>

<p><strong>Step 3: Document Submission</strong></p>
<ul>
  <li>Submit required supporting documents</li>
  <li>Upload Invention Disclosure Form (IDF)</li>
</ul>

<p><strong>Step 4: Initial Review & Patentability Search</strong></p>
<ul>
  <li>CIPIE patent engineer reviews alignment with Electronics & ICT</li>
  <li>Patentability search conducted for novelty and inventiveness</li>
</ul>

<p><strong>Step 5: Expert Committee Meeting</strong></p>
<ul>
  <li>Applications presented before the Expert Committee</li>
  <li>Applicants may be invited for presentation, if required</li>
  <li>Committee recommends applications and identifies internal/empanelled attorney</li>
  <li>Minutes of Meeting (MoM) are recorded</li>
</ul>

<p><strong>Step 6: Approval Notification</strong></p>
<ul>
  <li>Approval letter issued to the applicant</li>
</ul>

<p><strong>Step 7: Patent Filing</strong></p>
<ul>
  <li>Application forwarded to the recommended attorney</li>
  <li>Filing executed through CIPIE</li>
</ul>

<p><strong>Step 8: Financial Processing</strong></p>
<ul>
  <li>Attorney raises invoice to C-DAC / CIPIE</li>
  <li>Payment released by C-DAC Finance based on Expert Committee MoM</li>
  <li>Amount debited under IPFS budget head</li>
</ul>
`,
};

export const STARTUP_TERMS_CONDITION_OPTIONS = [
  { label: 'Up to 5 applications per financial year', value: 'option1' },
  { label: 'A maximum of 25 applications during the scheme duration', value: 'option2' },
];

export const MEITY_TAB_CONTENT = {
  ABOUT_CONTENT: `
<h5>International Patent Filing Support (IPFS)</h5>
<p>
  This program focuses on enabling Indian MeitY: Societies / Autonomous bodies 
  and MeitY grantee institute (project specific only) innovators to 
  secure foreign patent protection for their inventions. 
  It provides comprehensive patent filing support in the form of services,
   with total expenditure limited to ₹20 lakh per invention. The per invention 
   for filing patents in multiple international jurisdictions through recognized routes such as the Paris Convention, 
   Patent Cooperation Treaty (PCT) and Direct Filing.
</p>
<p>
  <strong>Modes of Filing Patent Applications in Foreign Countries (for MeitY: Societies / Autonomous bodies and MeitY grantee institute)</strong>
</p>
<p>
  Since there is no worldwide patent, protection must be sought in each country
  separately. MeitY R&D organizations can use the following routes for filing
  patent applications abroad:
</p>
<div>
  <p>
    <strong>1. Direct Filing </strong>
  </p>
  <p>
    MeitY: Societies / Autonomous bodies and MeitY grantee institute may directly file
    a patent application in a foreign country without first filing in India,
    subject to obtaining prior permission (Foreign Filing License) from the
    Indian Patent Office, as required under the Indian Patents Act. This route
    is useful when immediate protection is required in a specific foreign
    jurisdiction.
  </p>
</div>
<div>
  <p>
    <strong>
      2. Paris Convention Route
    </strong>
  </p>
  <p>
    Under the Paris Convention for the Protection of Industrial Property (1883),
    MeitY: Societies / Autonomous bodies and MeitY grantee institute can file
    patent applications in member countries within 12 months from the date of
    the first (priority) filing. This route allows claiming priority from the
    earliest filed application.
  </p>
</div>

<div>
  <p>
    <strong>
      3. Patent Cooperation Treaty (PCT) Route 
    </strong>
  </p>
  <p>
    The Patent Cooperation Treaty (PCT) enables MeitY: Societies / Autonomous
    bodies and MeitY grantee institute to file a single international patent
    application to seek protection in more than 150 countries. It provides an
    extended timeline of 30/31 months from the priority date for entering
    national phase applications in respective countries, along with
    international search, publication and preliminary examination.
  </p>
</div>

`,

  ELIGIBILITY_CONTENT: `
<ul>
  <li>For MeitY R&D societies / Autonomous bodies: support will be given to all IP generated by the organization.</li>
  <li>MeitY Grantee Institutions: support will be given to only IP generated under MeitY funded project only.</li>
  <li>MeitY R&D societies / Autonomous bodies / Grantee Institutions: Any IP generated collaboratively the IPFS support will be provided as per the MoU signed by the organizations.</li>
  </ul>
`,
  TERMS_CONDITION_CONTENT: `
<ul>
  <li>International Patent Applications may be filed in multiple countries allowed under IPFS program.</li> 
  <li>Maximum patent filing support in the form of services, with total expenditure limited to ₹20 lakh per invention.</li> 
  <li>Expenditure beyond ₹20 lakh may be approved on a case to case basis.</li> 
</ul>
`,

  APPLICATION_CONTENT: `
<p><strong>Step 1: Registration</strong></p>
<ul>
  <li>Register on the CIPIE Portal</li>
</ul>

<p><strong>Step 2: Document Submission</strong></p>
<ul>
  <li>Submit supporting documents and Invention Disclosure Form</li>
</ul>

<p><strong>Step 3: Initial Review & Patentability Search</strong></p>
<ul>
  <li>Technical and patentability evaluation by CIPIE</li>
</ul>

<p><strong>Step 4: Expert Committee Recommendation</strong></p>
<ul>
  <li>Evaluation by Expert Committee Recommendation</li>
</ul>

<p><strong>Step 5: Patent Filing</strong></p>
<ul>
  <li>Application forwarded to the recommended attorney</li>
  <li>Filing executed through CIPIE</li>
</ul>

<p><strong>Step 6: Financial Disbursement</strong></p>
<ul>
  <li>C-DAC Finance verifies bills and releases funds accordingly</li>
</ul>
`,
};

export const IP_FACILITATION_SUPPORT = [
  {
    label: 'Patents',
    value: 'patent',
    description:
      'Patents provide exclusive legal rights to innovators for their novel inventions, enabling them to prevent others from making, using, or commercializing the invention without authorization. This protection encourages research, technological advancement, and commercialization of new solutions.',
  },
  {
    label: 'Trademarks',
    value: 'trademark',
    description:
      'Trademarks protect brand identity, including names, logos, symbols, or taglines that distinguish goods or services in the marketplace. They help organizations build trust, recognition, and reputation while preventing unauthorized use by others.',
  },
  {
    label: 'Industrial Designs',
    value: 'industrial',
    description:
      'Industrial Designs safeguard the visual and aesthetic aspects of a product, such as shape, configuration, pattern, or ornamentation. This protection enhances the market appeal and competitiveness of products by securing their unique appearance.',
  },
  {
    label: 'Copyrights',
    value: 'copyright',
    description:
      'Copyrights protect original creative works, including literary content, artistic creations, software, databases, and multimedia outputs. They grant creators the right to control reproduction, distribution, and usage of their work.',
  },
  {
    label: 'Semiconductor Integrated Circuits Layout Design (SICLD) ',
    value: 'sicld',
    description:
      'SICLD protection applies to the unique layout designs (topographies) of semiconductor integrated circuits. It enables innovators and R&D organizations to secure their chip design innovations and prevent unauthorized replication or commercial exploitation.',
  },
];

export const IP_FACILITATION_TAB_CONTENT = {
  ABOUT_CONTENT: `
<p>IP Facilitation (Domestic IPR Support) for MeitY: Societies / Autonomous Bodies and Grantee Institutions</p>

<p>The IP Facilitation component is designed to support the filing, prosecution and maintenance (renewal)
 of domestic intellectual property generated by MeitY: Societies / Autonomous Bodies
and Grantee Institutions (project specific only). The objective is to strengthen the domestic IP ecosystem
 by enabling institutions to systematically protect their innovations and convert them into valuable intellectual assets.</p>
`,

  ELIGIBILITY_CONTENT: `
<ul>
  <li>For MeitY R&D societies / Autonomous bodies: support will be given to all IP generated by the organization.</li>
  <li>MeitY Grantee Institutions: support will be given to only IP generated under MeitY funded project only.</li>
  <li>MeitY R&D societies / Autonomous bodies/ Grantee Institutions: Any IP generated collaboratively the IP Facilitation support will be provided as per the MoU signed by the organization.</li>
</ul>
`,
  TERMS_CONDITION_CONTENT: `
<ul>
  <li>Maintenance of granted patents under IP Facilitation program shall be maintained up to 5 years after grant. Beyond this period, patents will be maintained only if there is demonstrated commercial potential or active commercialization efforts. Strategic decisions regarding discontinuation or repurposing of non-commercialized patents will optimize resources and enhance cost efficiency.</li>
</ul>
`,

  PATENT_FILING: `
  <ul>
                    <li>Details of the invention</li>
                    <li>Results of the prior art search confirming patentability</li>
                    <li>No Objection Certificate (NoC) from the concerned organization</li>
                    <li>Patent Form 1 (Indian Patent Office)</li>
                    <li>Request for Patent Facilitation (Internal Form)</li>
                    <li>Approval from Meity / Funding Agency</li>
                  </ul >
  `,
  COPYRIGHT_FILING: `
  < ul >
  <li>Details of the copyright work</li>
  <li>No Objection Certificate (NoC)</li>
  <li>Copyright Form 1 (Indian Patent Office)</li>
  <li>Approval from MeitY / Funding Agency</li>
</ul >
  `,

  TRADEMARK_FILING: `
  < ul >
  <li>Details of the trademark</li>
  <li>No Objection Certificate (NoC)</li>
  <li>Trademark Form 1 (Indian Patent Office)</li>
  <li>Approval from MeitY / Funding Agency</li>
</ul >
  `,

  DESIGN_FILING: `
  < ul >
  <li>Details of the design</li>
  <li>No Objection Certificate (NoC)</li>
  <li>Design Form 1 (Indian Patent Office)</li>
  <li>Approval from MeitY / Funding Agency</li>
</ul >
  `,

  SICLDR_FILING: `
  < ul >
  <li>Application for registration of layout-design</li>
  <li>No Objection Certificate (NoC)</li>
  <li>Approval from MeitY / Funding Agency</li>
</ul >
  `,
};

export const IP_FACILITATION_TABS_DETAILS = [
  { label: 'About', value: 'about' },
  { label: 'Eligibility', value: 'eligibility' },
  // { label: 'Terms & Conditions', value: 'terms-condition' },
  { label: 'Apply Under IP Facilitation', value: 'application' },
];
