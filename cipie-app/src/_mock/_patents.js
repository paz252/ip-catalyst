export const PATENT_SORT_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE - GRANTED', label: 'Active - Granted' },
    { value: 'INACTIVE - EXPIRED', label: 'Inactive - Expired' },
    { value: 'INACTIVE - WITHDRAWN / SURRENDERED', label: 'Inactive - Withdrawn / Surrendered' },
    { value: 'ACTIVE - APPLIED', label: 'Active - Applied' },
    { value: 'INACTIVE - NONPAYMENT', label: 'Inactive - Nonpayment' }
];

export const PATENT_DETAILS_TAB_OPTIONS_OLD = [
    { value: 'information', label: 'Information' },
    { value: 'assigneeInventors', label: 'Assignee / Inventors' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'claims', label: 'Claims' },
    // { value: 'description', label: 'Description' },

];

export const PATENT_DETAILS_TAB_OPTIONS = [
    {
        label: 'Information',
        icon: 'solar:document-text-bold',
    },
    {
        label: 'Assignee & Inventors',
        icon: 'solar:users-group-rounded-bold',
    },
    {
        label: 'Abstract',
        icon: 'solar:notebook-bold',
    },
    {
        label: 'Claims',
        icon: 'solar:shield-check-bold',
    },
];