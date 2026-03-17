import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: 'oa7cd1k7',
    dataset: 'production',
    apiVersion: '2025-03-05',
    useCdn: true,
    perspective: 'published',
});
