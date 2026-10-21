import { site } from './site'

export type LegalSection = { heading: string; paragraphs: string[] }

export type LegalDoc = {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

/** What this site actually stores and loads. Keep in sync with src/lib/storage.ts and src/lib/analytics.ts. */
export const privacyPolicy: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'October 2026',
  intro: `This Privacy Policy outlines how MPalomares Digital Solutions ("we", "us", or "our"), operated by ${site.name}, collects, manages, and safeguards your information when you visit ${site.url.replace('https://', '')} or communicate with us regarding our consulting, Google Ads, and automation services.`,
  sections: [
    {
      heading: 'Information We Collect',
      paragraphs: [
        `Direct Communications: When you reach out via our contact form, direct email (${site.email}), or social channels (LinkedIn, GitHub, X, Facebook), we collect your name, email address, company name, and project specifications necessary to respond to your inquiry and evaluate potential engagements.`,
        'Server & Hosting Telemetry: Our website is hosted on Vercel\'s global edge network. Like standard web servers, Vercel automatically processes technical request headers, including your IP address, browser type, operating system, referring URL, and request timestamps strictly for infrastructure security, rate limiting, and DDoS mitigation.',
      ],
    },
    {
      heading: 'Browser Storage & Preferences',
      paragraphs: [
        'Zero Invasive Tracking: This portfolio does not deploy cross-site tracking cookies, behavioral tracking pixels, or third-party ad retargeting scripts.',
        'Local Storage Usage: We use your browser\'s local storage (localStorage) exclusively to preserve your chosen interface preferences—such as dark/light theme mode and sidebar collapse state—ensuring a seamless viewing experience across visits.',
      ],
    },
    {
      heading: 'Client & Telemetry Confidentiality',
      paragraphs: [
        'Strict Data Segregation: In the course of consulting engagements, client credentials, ad account data (Google Ads), CRM records (GoHighLevel), and automation workflows (n8n) are managed under strict confidentiality.',
        'We never sell, rent, monetize, or publicly disclose client lead records, proprietary audience lists, or conversion telemetry. All case studies featured on this website are shared either under authorized agreement or with identifiable company information anonymized.',
      ],
    },
    {
      heading: 'Data Retention & Deletion',
      paragraphs: [
        'We retain inquiry communications and project consultation records only for as long as necessary to conduct business, fulfill contractual obligations, or comply with applicable legal requirements.',
        `You may request a complete copy or permanent deletion of any personal correspondence or contact records we hold by submitting a request to ${site.email}. We will process verified requests within two business days.`,
      ],
    },
    {
      heading: 'Third-Party Links & Demos',
      paragraphs: [
        'This website includes interactive demonstration environments (such as Chrome extension sandboxes and CRM architecture blueprints) that execute entirely client-side in your browser.',
        'Links to external third-party platforms—including GitHub, LinkedIn, Google Ads, Meta, and Vercel—are governed by their respective privacy terms. We encourage visitors to review the privacy notices of any external site they visit.',
      ],
    },
    {
      heading: 'Your Privacy Rights',
      paragraphs: [
        `Depending on your location, you may have rights under applicable privacy legislation (such as the EU GDPR, California CCPA, or the Philippine Data Privacy Act of 2012 / RA 10173) to access, correct, restrict, or request the deletion of your personal information. To exercise any of these rights, please contact ${site.email}.`,
      ],
    },
    {
      heading: 'Policy Revisions',
      paragraphs: [
        'We may update this policy periodically to reflect changes in our service offerings, technical architecture, or legal obligations. Any updates will be posted directly to this page with an updated revision date.',
      ],
    },
  ],
}

export const termsOfService: LegalDoc = {
  title: 'Terms of Service',
  updated: 'October 2026',
  intro: `These Terms of Service govern your access to and use of this portfolio website, operated by ${site.name} trading as ${site.brand}. By accessing, browsing, or utilizing any interactive features on this site, you acknowledge and agree to these terms.`,
  sections: [
    {
      heading: 'Permitted Use & Interactive Sandboxes',
      paragraphs: [
        'This website serves as a professional showcase of automation pipelines, Google Ads performance telemetry, GoHighLevel funnels, and browser extensions engineered by Marlon Palomares.',
        'You are granted a limited, revocable, non-exclusive license to view the site and interact with public demos (such as the MGEMS Extension Suite and CRM architecture simulators) for evaluation and business inquiry purposes. You agree not to engage in malicious scraping, reverse engineering, automated abuse, or attempts to compromise server security.',
      ],
    },
    {
      heading: 'Consulting Inquiries & Engagements',
      paragraphs: [
        'Non-Binding Information: Information, estimated metrics, and case studies presented on this website are provided for illustrative portfolio purposes and do not constitute a formal, binding commercial contract or guaranteed performance commitment.',
        'Client Agreements: Professional engagements (including Google Ads management, GoHighLevel setup, or n8n automation development) commence exclusively upon mutual execution of a formal written proposal, scope of work (SOW), or service contract detailing deliverables, timelines, and payment terms.',
      ],
    },
    {
      heading: 'Intellectual Property',
      paragraphs: [
        `All original content, custom software code, UI design layouts, and proprietary browser extensions (including MGEMS Keyword Manager and MGEMS Optimizer Pro) featured on this website are the intellectual property of ${site.name} and ${site.brand}, protected under copyright and intellectual property laws.`,
        'Third-Party Trademarks: Names, logos, and trademarks of third-party platforms (such as Google Ads, GoHighLevel, n8n, OpenAI, Claude, DeepSeek, and Stripe) belong to their respective registered owners and are referenced solely for technical identification and descriptive purposes.',
      ],
    },
    {
      heading: 'Disclaimer of Warranties',
      paragraphs: [
        'This website, its interactive demos, and all published materials are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including fitness for a particular purpose or non-infringement.',
        'Historical Performance: Case study metrics (such as CTR turnaround figures, CPC rates, or conversion volumes) reflect specific historical client campaigns and conditions. They do not constitute an explicit or implied guarantee of identical outcomes for future campaigns.',
      ],
    },
    {
      heading: 'Limitation of Liability',
      paragraphs: [
        `To the maximum extent permitted by applicable law, neither ${site.name} nor ${site.brand} shall be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of, or inability to use, this website or its external resource links.`,
      ],
    },
    {
      heading: 'External Resources & Links',
      paragraphs: [
        'This site contains links to third-party repositories, tools, and social platforms for your convenience. We have no control over external platforms and accept no responsibility for their content, availability, or operational practices.',
      ],
    },
    {
      heading: 'Governing Law',
      paragraphs: [
        'These Terms of Service and any matters arising from your use of this portfolio website shall be governed by and interpreted in accordance with the laws of the Republic of the Philippines, without regard to conflict of law principles.',
      ],
    },
    {
      heading: 'Contact & Inquiries',
      paragraphs: [
        `For legal inquiries, contract verifications, or questions concerning these Terms of Service, please reach out directly to ${site.name} at ${site.email}.`,
      ],
    },
  ],
}
