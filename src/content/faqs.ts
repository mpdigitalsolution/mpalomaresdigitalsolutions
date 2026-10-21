import type { Faq } from './schema'

/** The questions people ask before they write. Pages pick the ones that answer their own objection. */
export const faqs = {
  whatYouBuild: {
    question: 'What do you actually build?',
    answer: 'I engineer full-funnel Google Ads search campaigns, conversion-optimized GoHighLevel funnels, and autonomous n8n automation pipelines. Every build bridges traffic directly to sub-60-second CRM follow-ups with bulletproof GTM conversion tracking.',
  },
  startSpeed: {
    question: 'How fast can you start?',
    answer: 'Typically within 2 to 4 business days once project scope and access are aligned. Based in Manila (GMT+8), I maintain consistent daily work overlap with clients across US, UK, and Australian time zones.',
  },
  needStack: {
    question: 'Do I need a specific platform?',
    answer: 'Not necessarily. My core drivers are Google Ads, GoHighLevel, and n8n, but I frequently integrate with Twilio, Slack, Telegram, Supabase, Stripe, and custom webhooks. If your existing tools aren\'t a good fit, I will advise you honestly on the leanest, most reliable architecture.',
  },
  pricing: {
    question: 'How much do you charge?',
    answer: 'Engagements are structured either as fixed-price project sprints (for complete funnel and pipeline builds) or monthly performance retainers (for ongoing Google Ads management and optimization). Every quote is transparent with zero hidden fees.',
  },
  afterWrite: {
    question: 'What happens after I write?',
    answer: 'I personally review every inquiry and reply within one business day. If we are a strong fit, we will schedule a brief 15-minute discovery call or exchange a targeted video audit. If I cannot help with your specific problem, I will tell you upfront and point you in the right direction.',
  },
} satisfies Record<string, Faq>

export const allFaqs: Faq[] = Object.values(faqs)
