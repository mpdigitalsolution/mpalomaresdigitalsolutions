import type { ToolMark } from './schema'

const mark = (name: string, file: string, mono?: true): ToolMark => ({ name, logo: `/images/tools/${file}`, mono })

/**
 * Every tool logo the site can show. Pages reference these, never a raw path. The twelve marks are
 * generic placeholders (public/images/tools/tool-01.svg ... tool-12.svg): swap each name and file for a
 * real tool you use. A black one-colour logo takes a third argument, `true`, so it is inverted on dark
 * grounds and never disappears.
 */
export const tools = {
  toolA: mark('n8n', 'tool-01.svg'),
  toolB: mark('GoHighLevel', 'tool-02.svg'),
  toolC: mark('DeepSeek AI', 'tool-03.svg'),
  toolD: mark('Google Workspace', 'tool-04.svg'),
  toolE: mark('Telegram', 'tool-05.svg'),
  toolF: mark('Slack', 'tool-06.svg'),
  toolG: mark('Supabase', 'tool-07.svg'),
  toolH: mark('Meta Graph API', 'tool-08.svg'),
  toolI: mark('Twilio', 'tool-09.svg'),
  toolJ: mark('Stripe', 'tool-10.svg'),
  toolK: mark('RapidAPI', 'tool-11.svg'),
  toolL: mark('OpenAI', 'tool-12.svg'),
  toolGoogleAds: mark('Google Ads', 'tool-gads.png'),
  toolGTM: mark('Tag Manager', 'tool-gtm.png'),
  toolAnalytics: mark('GA4 Analytics', 'tool-analytics.jpg'),
} satisfies Record<string, ToolMark>

/** The daily drivers, in the order you want them shown. */
export const dailyTools: ToolMark[] = [
  tools.toolA,
  tools.toolB,
  tools.toolC,
  tools.toolD,
  tools.toolE,
  tools.toolF,
  tools.toolG,
  tools.toolH,
  tools.toolI,
  tools.toolJ,
  tools.toolK,
]
