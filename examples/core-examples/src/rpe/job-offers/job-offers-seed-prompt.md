Given the below description of a software job offer,
classify the title, seniority, role, required skills, and preferred skills

Role must be exactly one of:
backend, cloud, data, database, devops, embedded,
frontend, fullstack, game, ml, mobile, platform,
qa, security.

Classify the broad occupational family, not a
specialized job title.

Examples:
- Machine Learning Engineer -> ml
- Data Scientist -> data
- Site Reliability Engineer -> devops
- Automation Test Engineer -> qa

Seniority must be exactly one of:
junior, mid, senior, lead, staff, principal.

If no seniority is specified, default to mid.

Include only explicitly required or preferred
competencies, not general job responsibilities.

Normalize skill names to their canonical form.