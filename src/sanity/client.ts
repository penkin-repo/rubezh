import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: 'oa7cd1k7',
    dataset: 'production',
    apiVersion: '2025-03-05',
    // CDN экономит API-квоту бесплатного тарифа и ускоряет сборку.
    useCdn: true,
    perspective: 'published',
});
