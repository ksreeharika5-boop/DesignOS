import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompts';

export const runtime = 'nodejs';

function demoResult(brief: string, audience: string, platform: string) {
  const firstLine = brief.trim().split(/[.!?\n]/)[0]?.slice(0, 110) || 'Fintech checkout';
  return {
    summary: `A trust-first checkout direction for ${audience.toLowerCase()} using ${platform.toLowerCase()}. Prioritize transparent totals, a short payment path, clear recovery from failures, and a persistent cart. Brief focus: “${firstLine}”. Demo mode uses a curated plan; connect a server-side API key for brief-specific AI generation.`,
    assumptions: [
      'Customers want to understand the final amount before selecting a payment method.',
      'UPI is a high-priority payment method for this India-first checkout; card and net banking remain available.',
      'Payment authorization can fail or time out, so the checkout must preserve cart state and explain safe next steps.',
      'These are design hypotheses, not findings from user research or live payment analytics.'
    ],
    users: [
      `Primary: ${audience} completing a one-time purchase`,
      'Returning customers who want a quick, familiar payment flow',
      'Customers recovering from a declined, pending, or interrupted payment'
    ],
    journey: [
      { step: 'Review order', goal: 'Confirm item, subtotal, discount, taxes, and final payable amount before paying.', risk: 'Hidden charges or unexpected total changes can break trust.' },
      { step: 'Choose payment', goal: 'Select UPI, card, or net banking with clear descriptions and familiar labels.', risk: 'Too many choices or unclear provider handoffs slow completion.' },
      { step: 'Authorize securely', goal: 'Complete payment in the selected provider or banking app and return to checkout.', risk: 'App switching, OTP friction, or a timeout can leave status ambiguous.' },
      { step: 'Confirm or recover', goal: 'Show a definitive success state or explain how to retry without paying twice.', risk: 'Ambiguous pending states can cause duplicate attempts and support contacts.' }
    ],
    screens: [
      { name: 'Order review', purpose: 'Make the purchase and final amount easy to verify.', layout: 'Single-column mobile flow; order summary stays visible above a compact breakdown and primary Continue action.', components: ['Product and quantity row', 'Subtotal and discount', 'Tax and total', 'Edit cart link', 'Continue to payment'], states: ['Loading: preserve the previous cart snapshot', 'Empty cart: explain and offer return to shopping', 'Price changed: disclose the difference before continuing'] },
      { name: 'Payment selection', purpose: 'Let customers choose a familiar method without losing context.', layout: 'Three selectable payment rows for UPI, cards, and net banking; total remains visible near the primary action.', components: ['UPI option', 'Card option', 'Net banking option', 'Final amount', 'Security reassurance'], states: ['Default method preselected only when justified by product data', 'Unavailable method disabled with explanation', 'Keyboard focus and selected state are both visible'] },
      { name: 'Payment authorization handoff', purpose: 'Set expectations while the payment provider or bank authorizes the transaction.', layout: 'Focused progress state with amount, method, and a concise instruction; avoid implying success before confirmation.', components: ['Progress indicator', 'Payment method summary', 'Return-to-checkout guidance', 'Support link'], states: ['Pending: explain that status is being checked', 'Timeout: retain order and offer safe status check', 'Back navigation: preserve cart and chosen method'] },
      { name: 'Payment result and recovery', purpose: 'Make success definitive and make failures recoverable.', layout: 'Success receipt or clear failure panel with one recommended next step and secondary alternatives.', components: ['Status icon and heading', 'Order reference', 'Amount and method', 'Retry payment', 'Change method', 'Help link'], states: ['Success: show order reference and next step', 'Failed: say no payment was completed only when confirmed', 'Pending: warn against retrying until status is verified'] }
    ],
    designTokens: {
      colors: ['Ink: #18251F', 'Canvas: #F7F8F5', 'Primary: #245A43', 'Accent: #D9F36A', 'Success: #1F7A4D', 'Error: #B42318', 'Border: #DDE3DC'],
      typeScale: ['Display 32/38', 'Heading 22/28', 'Body 14/21', 'Label 12/16', 'Caption 11/15'],
      spacing: ['4px micro', '8px compact', '12px control gap', '16px standard', '24px section', '32px major']
    },
    accessibility: [
      'Use explicit labels for payment methods and expose selected state programmatically.',
      'Maintain visible keyboard focus and logical keyboard order through payment and coupon controls.',
      'Do not use color alone to distinguish success, pending, or failed states.',
      'Announce asynchronous payment status updates to assistive technology without moving focus unexpectedly.',
      'Keep error messages specific, actionable, and associated with the affected control; target WCAG AA contrast.'
    ],
    validationPlan: [
      'Usability-test the checkout with 5–8 target customers and observe whether they can explain the final amount before paying.',
      'Measure checkout completion rate, payment-method selection, authorization success, and recovery completion by method.',
      'Run scenarios for declined payment, delayed callback, duplicate click, network loss, app-switch return, and pending status.',
      'Test keyboard-only completion, screen-reader announcements, mobile viewport layouts, and 200% zoom.',
      'Compare against a baseline only after instrumenting real traffic; do not present prototype results as production conversion gains.'
    ],
    implementationNotes: [
      'Treat the browser prototype as a simulation only; do not collect real card, bank, or UPI credentials.',
      'Use the payment provider as the source of truth for payment status and make retries idempotent.',
      'Persist a server-side order/payment attempt identifier before handing off to a provider.',
      'Keep totals calculated on the server in production; never trust client-calculated discounts or amounts.',
      'Instrument step transitions and failure reasons with privacy-conscious event names before running experiments.'
    ]
  };
}

function validPlan(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const plan = value as Record<string, unknown>;
  return typeof plan.summary === 'string'
    && Array.isArray(plan.assumptions)
    && Array.isArray(plan.users)
    && Array.isArray(plan.journey)
    && Array.isArray(plan.screens)
    && !!plan.designTokens && typeof plan.designTokens === 'object'
    && Array.isArray(plan.accessibility)
    && Array.isArray(plan.validationPlan)
    && Array.isArray(plan.implementationNotes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const brief = String(body?.brief ?? '').trim();
    const audience = String(body?.audience ?? 'Fintech customers').trim().slice(0, 120) || 'Fintech customers';
    const platform = String(body?.platform ?? 'Responsive web').trim().slice(0, 80) || 'Responsive web';
    if (brief.length < 12) return NextResponse.json({ error: 'Add a little more detail to the checkout brief (at least 12 characters).' }, { status: 400 });
    if (brief.length > 5000) return NextResponse.json({ error: 'Keep the brief under 5,000 characters.' }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ mode: 'demo', result: demoResult(brief, audience, platform) });

    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify({ brief, audience, platform, productType: 'India-first fintech checkout', instruction: 'Create a concrete, accessible checkout redesign plan. Return only JSON matching the schema.' }) }
        ]
      }),
      signal: AbortSignal.timeout(45000)
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('Model provider error:', response.status, detail.slice(0, 300));
      return NextResponse.json({ error: 'AI generation failed. Check the server-side API key, model access, and usage limits.' }, { status: 502 });
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: 'The model returned an empty response. Please retry.' }, { status: 502 });
    let result: unknown;
    try { result = JSON.parse(content); } catch { return NextResponse.json({ error: 'The AI response was not valid JSON. Please retry.' }, { status: 502 }); }
    if (!validPlan(result)) return NextResponse.json({ error: 'The AI response did not match the expected design-plan structure. Please retry.' }, { status: 502 });
    return NextResponse.json({ mode: 'live', result });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    if (error instanceof Error && error.name === 'TimeoutError') return NextResponse.json({ error: 'AI generation took too long. Please retry.' }, { status: 504 });
    console.error('DesignOS generation error:', error);
    return NextResponse.json({ error: 'Could not generate the design plan. Please try again.' }, { status: 500 });
  }
}
