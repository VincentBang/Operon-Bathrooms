# Operon Bathrooms Chatbot Agent Plan

This is a future strategy file only. Do not build chatbot code until Phase 1 SEO passes QA and a later chatbot task is approved.

| Chatbot role | Intent handled | Allowed answers | Forbidden answers | CTA routing | Safety boundaries | Lead handoff path | Should appear | Must not appear |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chatbot Router Agent | Identify whether the user needs estimate, quote review, request review or site measure. | Brief routing questions and safe page links. | Final pricing, legal decisions, compliance guarantees. | `/quote`, `/quote/review`, `/request-review`, `/site-measure`. | Planning guidance only. | Store structured intent only in future approved flow. | Home, quote, cost guide, services. | Admin, API, payment or private pages. |
| Chatbot Quote Risk Agent | Help users notice quote clarity risks. | Questions about inclusions, exclusions, GST, deposit, PC sums, provisional sums and site measure. | Claims that a builder is wrong, illegal or dishonest. | `/quote/review`. | Use "clarify before signing" language. | Future quote review intake. | Quote review, cost guide. | Legal dispute pages. |
| Chatbot Evidence Agent | Explain what evidence helps review. | Ask for quote PDF, photos, plans, strata notes and selections. | Public upload links without safe storage. | `/request-review`, `/site-measure`. | Do not expose files publicly. | Future secure intake. | Request review, site measure. | Public guide placeholders. |
| Chatbot Bad-Fit Filter Agent | Deflect unsuitable traffic. | Explain Operon focuses on planned renovations and quote clarity. | Cheap, DIY, emergency repair or supply-only offers. | Safer public pages or external recommendation wording. | No emergency or DIY instructions. | No lead unless fit is plausible. | FAQ, home. | Checkout, admin. |
| Chatbot Compliance Guard Agent | Keep rule prompts safe. | General prompts about licence, deposit, HBC/HBCF, waterproofing and Class 2 checks. | Legal advice or guaranteed compliance. | `/site-measure`, `/quote/review`. | Always say to confirm current requirements. | Future manual review flag. | Cost guide, apartment service. | Pages asking for legal advice. |
| Chatbot Conversion Agent | Encourage the next safe action. | CTA suggestions based on readiness. | Pressure tactics or contract commitments. | Estimate, review, request review, site measure. | No fixed-price promise. | Future lead capture. | Home, service pages. | Admin. |
| Chatbot FAQ Agent | Answer common planning questions. | Short FAQ responses with internal links. | Detailed legal, waterproofing DIY or contract advice. | Guides hub, quote, quote review. | Link to deeper pages. | None unless user asks to submit. | FAQ, guides hub. | Private pages. |
| Chatbot Handoff Agent | Prepare human follow-up context. | Summaries of user intent and evidence needed. | Private scoring, internal notes, final quote language. | Request review or site measure. | Customer-safe summary only. | Future lead record. | Lead flows. | Public static pages if no consent. |

## Pages Where Chatbot Should Appear Later

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/bathroom-renovation-cost-sydney`
- Phase 1 service pages
- FAQ and future authority guides

## Pages Where Chatbot Must Not Appear

- `/admin`
- `/api/*`
- privacy and terms unless explicitly needed
- thin placeholder pages
- any future payment or private workspace route
