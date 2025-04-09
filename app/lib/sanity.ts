import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: 'ulzdyd69',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-02-06',
  token: process.env.SANITY_SECRET_TOKEN
})
