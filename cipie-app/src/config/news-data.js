import { kebabCase } from 'es-toolkit';

export const NEWS_DATA = [
    {
        newsView: 1,
        slug: 'battery-electrode-fabrication',
        title: 'A Method for Fabrication of Battery Electrodes',
        description: ['The present disclosure relates to an electrode and a method for its fabrication. The method for fabrication of electrodes of the present disclosure is simple to perform, 5 economic and eco-friendly.',],
        patentNo: 'IN582161',
        applicationNo: '202211033784',
        date: '2 Mar 2026',
        patentStatus: 'Granted',
        domain: 'mat',
        category: 'materials-metallurgy',
        applicant: ['Ministry of Electronics and Information Technology and Centre for Materials for Electronics Technology'],
        // slug: kebabCase('A Method for Fabrication of Battery Electrodes-202211033784'),
        isNew: false,
    },
    {
        newsView: 1,
        slug: 'fft-scheduling-register-tree',
        title: 'A Data Scheduling Register Tree for Radix-2 FFT Architecture',
        description: ['The present invention discloses a data scheduling register tree structure for radix-2 FFT architecture. The operation method of the proposed invention, there is no need for the Random Access Memory (RAM) to store the data; instead, shift registers with some multiplexers are enough to perform the memory operation with less hardware. There are three steps in the FFT computation, such as input storage, data processing and output retrieval. The data processing step is further configured in four different operations. The number of operation mainly depends upon the size of the FFT, which is equal to log₂N modes. During each operation, the DSRT changes its structure and these structures are basically MDC (Multi-path Delay Commutator) structures. ',],
        patentNo: 'IN581062',
        applicationNo: '202041007125',
        date: '19 Feb 2026',
        patentStatus: 'Granted',
        domain: 'other',
        category: 'none',
        applicant: ['National Institute of Technology Tiruchirappalli'],
        // slug: kebabCase('A Data Scheduling Register Tree for Radix-2 FFT Architecture-202211033784'),
        isNew: false,

    },
    {
        newsView: 1,
        slug: 'composite-preparation',
        title: 'C-MET Pune Granted Indian Patent for "COMPOSITE AND A PROCESS FOR ITS PREPARATION"',
        description: ['The present disclosure relates to a composite and a process for its preparation. The composite of the present disclosure is in the form of powder that can be used in the preparation of filament/spool. The composite of the present disclosure is 3D printable. The process for the preparation of the composite is simple, facile, and efficient; and requires low capital cost and labour.'],
        patentNo: 'IN602399',
        applicationNo: 'IN202311002881',
        date: '14 Sep 2026',
        patentStatus: 'Granted',
        applicant: ['The Secretary, Ministry Of Electronics And Information Technology, Govt. Of India.', 'The Director General, Centre For Materials For Electronics Technology (C-MET).'],
        isNew: true,
    },
    {
        newsView: 2,
        slug: 'virtual-ip-facilitation-cells',
        title: 'Two Virtual IP Facilitation Cells Launched to Strengthen IP Support for Innovators and Startups',
        description: [
            'The Centre for Intellectual Property & Innovation Exchange, CIP-IE, C-DAC Pune, under the Ministry of Electronics & Information Technology (MeitY), has launched two Virtual IP Facilitation Cells in New Delhi on 10th August 2026, in collaboration with I-Hub Foundation for Cobotics, (IIT Delhi) and MeitY Startup Hub (MSH).',

            'The launch programme was led by Ms. Sunita Verma, GC (R&D–Electronics), MeitY, with the participation of senior representatives from government, academia, industry and the national Intellectual Property (IP) ecosystem.',

            'The Virtual IP Facilitation Cells have been established to provide accessible, structured and technology enabled IP support to innovators, startups, researchers, incubators and emerging enterprises. The Cells will facilitate IP awareness, preliminary guidance on IP protection and registration, technology assessment, and linkages with appropriate IP professionals, institutions and other ecosystem stakeholders.',

            'The initiative aims to strengthen access to IP support and enable innovators and startups to better understand, protect and leverage their intellectual property, thereby contributing to a stronger and more innovation-driven IP ecosystem in the country.'
        ],
        gallery: [
            {
                image: 'virtual-ip-facilitation-1.jpg',
                title: 'Virtual IP Facilitation Cells launched in collaboration with IIT Delhi (IHFC)',
                description:
                    'The first Virtual IP Facilitation Cell was launched at I-Hub Foundation for Cobotics, IIT Delhi.',
            },
            {
                image: 'virtual-ip-facilitation-2.jpg',
                title: 'Virtual IP Facilitation Cells launched in collaboration with MeitY Startup Hub (MSH)',
                description:
                    'The second Virtual IP Facilitation Cell was launched in collaboration with MeitY Startup Hub.',
            },
        ],
        date: '10 Aug 2026',
        isNew: false,
    },
    {
        newsView: 3,
        slug: 'trademark-applications-hpc-tutor-onama-c-chakshu-chreme',
        title: 'Trademark Applications Filed for HPC TUTOR, Onama, C-Chakshu and CHReME under Various Classes',
        description: [
            'Under the IP Catalyst, MeitY IP Facilitation Programme, trademark applications have been filed for HPC TUTOR, Onama, C-Chakshu and CHReME. The table below provides details of the trademarks filed under various classes, along with their application numbers and filing dates.',
            'The applications cover teaching apparatus and instruments, data processing equipment and computers under Class 9; education and training under Class 41; and scientific and technological services, research and design, industrial analysis and research, and design and development of computer hardware and software under Class 42.',
            'Trademark Applications Filed for GeoSevak under Various Classes'
        ],
        pdf: 'cdac-hpc.pdf',
        date: '19 Aug 2026',
        isNew: false,
        trademarkTable: [
            {
                trademark: 'HPC TUTOR',
                applicationNo: '7937186 / 7937187 / 7937188',
                class: '9, 41, 42',
                date: '18 Aug 2026',
            },
            {
                trademark: 'Onama',
                applicationNo: '7937192 / 7938764',
                class: '9, 42',
                date: '18 – 19 Aug 2026',
            },
            {
                trademark: 'GeoSevak',
                applicationNo: '7938767 / 7938768',
                class: '9, 42',
                date: '19 Aug 2026',
            },
            {
                trademark: 'GeoSevak',
                applicationNo: '7938771 / 7938772',
                class: '9, 42',
                date: '19 Aug 2026',
            },
        ],
    },
    {
        newsView: 3,
        slug: 'trademark-applications-geosevak',
        title: 'Trademark Applications Filed for GeoSevak under Various Classes',
        description: [
            'Under the IP Catalyst, MeitY IP Facilitation Programme, trademark applications have been filed for GeoSevak, a Geospatial Transaction System, under various classes. The table below provides details of the trademark applications, including their application numbers, classes and filing date.',
            'The trademark applications cover software and technology services related to geospatial data creation, management, visualization, analysis and dissemination; Geographic Information Systems (GIS); AI-based satellite imagery analysis; field-based GIS applications; geospatial platforms; cloud computing; high-performance computing services; and web-based mapping applications.',
        ],
        pdf: 'GeoSevak.pdf',

        date: '21 Aug 2026',
        isNew: true,
        trademarkTable: [
            {
                trademark: 'GeoSevak',
                applicationNo: '7945875',
                class: 9,
                date: '21 Aug 2026',
            },
            {
                trademark: 'GeoSevak',
                applicationNo: '7945878',
                class: 9,
                date: '21 Aug 2026',
            },
            {
                trademark: 'GeoSevak',
                applicationNo: '7945876',
                class: 42,
                date: '21 Aug 2026',
            },
            {
                trademark: 'GeoSevak',
                applicationNo: '7945877',
                class: 42,
                date: '21 Aug 2026',
            },
        ],
    },
];

export const EVENTS_DATA = [
    {
        title: 'From Patent to Product: Accelerating IP Commercialization in Electronics & IT',
        date: '12 May 2026',
        link: 'https://ict-ipr.in/event/patenttoproduct.html',
        isNew: false,
    },
    {
        title: 'Training on Technology Innovation and Intellectual Property Management',
        date: '9 Dec 2024',
        isNew: false,
    },
    {
        title: 'Patent Informatics for Research and Business Planning',
        date: '26 Apr 2024',
        isNew: false,
    },
    {
        title: 'IPR: Strategies for Innovation and Protection',
        date: '21 Mar 2024',
        venue: 'IIT Tirupati',
        isNew: false,
    },
    {
        title: 'IPR Essentials: Enhancing Technology Transfer Through Strategic IP Management',
        date: '13 Mar 2024',
        venue: 'Shivajinagar, Pune',
        isNew: false,
    },
    {
        title: 'Strategies for Technology Transfer and IP Evaluation for Startups',
        date: '21 Feb 2024',
        venue: 'Maker Village, Kochi',
        isNew: false,
    },
    {
        title: 'Intellectual Property Strategies for Technology Commercialization',
        date: '30 Jan 2024',
        venue: 'Assam Startup The Nest',
        isNew: false,
    },
    {
        title: 'Idea to Market – The IPR Journey',
        date: '19 Dec 2023',
        venue: 'Punjab University',
        isNew: false,
    },
    {
        title: 'Emerging Innovation Brainwave Session on IPR',
        date: '14 Dec 2023',
        venue: 'Bhau Institute',
        isNew: false,
    },
    {
        title: 'Unleashing Innovation: The Role of IPR in Taking Ideas to Market',
        date: '30 Nov 2023',
        venue: 'IIIT Naya Raipur',
        // venue: 'International Institute of Information Technology Naya Raipur',
        isNew: false,
    },
];

export const UPCOMING_EVENTS_DATA = [
    {
        title: 'From Research & IP to Market-Ready Products by Bharat 6G Alliance',
        description: 'This session will provide insights into how research outcomes, indigenous technologies, and intellectual property can be transformed into market-ready products through technology commercialization, IP facilitation, licensing, and collaborative ecosystem support.',
        date: '21 May 2026',
        location: 'Virtual',
        image: 'event-21-may.jpg',
        link: 'https://www.youtube.com/live/3i9-WAMQZxM ',
        isNew: false,
    },
    {
        title: 'From Patent to Product: Accelerating IP Commercialization in Electronics & IT',
        description: 'The one-day national conference on “From Patent to Product: Accelerating IP Commercialization in Electronics & IT” is being organized as a key initiative under IP Catalyst, a program of the Ministry of Electronics and Information Technology (MeitY), Government of India',
        date: '12 May 2026',
        location: 'Delhi',
        image: '1.jpeg',
        link: 'https://ict-ipr.in/event/patenttoproduct.html',
        isNew: false,
    },
    // {
    //     title: 'Awareness Session on Intellectual Property Rights',
    //     description: 'C-DAC actively conducts awareness sessions, workshops, and webinars on (IPR) to foster innovation and safeguard intellectual assets, particularly in the Electronics and Information Technology sectors',
    //     date: '21 April 2026',
    //     location: 'Thiruvananthapuram',
    //     image: '3.png',
    //     link: 'https://www.youtube.com/watch?v=Zc3usqmgkPY',
    //     isNew: false,
    // },
    // {
    //     title: 'Training on Technology Innovation and Intellectual Property Management',
    //     description: 'The Ministry of Electronics and Information Technology (MeitY) has taken initiatives to promote intellectual property rights (IPR) awareness and protection among startups, and micro, small, and medium enterprises (MSMEs) are crucial for fostering innovation and economic growth.',
    //     date: '9 Dec 2024',
    //     location: 'IIT - Tirupati',
    //     image: '2.webp',
    //     link: '/events/7c74f070-8796-458c-9452-fde851c1b863',
    //     isNew: false,
    // },
]