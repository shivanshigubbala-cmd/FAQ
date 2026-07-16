export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface QueryResponse {
  question: string;
  matched_question: string | null;
  answer: string | null;
  message?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export async function queryFaq(question: string): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('Failed to query FAQ');
  return res.json();
}

export async function fetchFaqs(): Promise<Record<string, string>> {
  const res = await fetch(`${API_URL}/faqs`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
}

export async function teachFaq(question: string, answer: string, apiKey: string): Promise<FaqItem> {
  const res = await fetch(`${API_URL}/faqs`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': apiKey 
    },
    body: JSON.stringify({ question, answer }),
  });
  if (res.status === 401) throw new Error('Invalid API key');
  if (!res.ok) throw new Error('Failed to teach new FAQ');
  return res.json();
}
