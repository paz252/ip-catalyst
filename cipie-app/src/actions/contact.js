import axios from 'axios';

import { endpoints } from 'src/lib/axios';

export const sendContactForm = async (payload) => {
    const res = await axios.post(
        endpoints.contact.submit,
        payload
    );

    return res.data;
};