const MAX_TOKENS_CAP = 4000;
const ALLOWED_MODEL = 'gpt-4o-mini';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { system, user, max: rawMax = 1500 } = req.body || {};

    if (!user || typeof user !== 'string' || user.length > 10000) {
      return res.status(400).json({ error: 'Invalid or missing user input' });
    }

    const max = Math.min(Number(rawMax) || 1500, MAX_TOKENS_CAP);
    const schema = {
      type: 'object',
      additionalProperties: false,
      required: [
        'primary_match',
        'closest_matches',
        'described_competencies',
        'core_skills',
        'foundation_skills',
        'gap_areas',
        'interview_questions',
        'manager_insight',
        'top_skill_summary',
      ],
      properties: {
        primary_match: {
          type: 'object',
          additionalProperties: false,
          required: ['onet_code', 'onet_title', 'match_confidence', 'description', 'bright_outlook', 'zone', 'zone_label'],
          properties: {
            onet_code: { type: 'string' },
            onet_title: { type: 'string' },
            match_confidence: { type: 'integer', minimum: 0, maximum: 100 },
            description: { type: 'string' },
            bright_outlook: { type: 'boolean' },
            zone: { type: 'integer', minimum: 1, maximum: 5 },
            zone_label: { type: 'string' },
          },
        },
        closest_matches: {
          type: 'array',
          minItems: 1,
          maxItems: 3,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['code', 'title', 'match_confidence', 'why_match', 'bright_outlook', 'zone', 'zone_label'],
            properties: {
              code: { type: 'string' },
              title: { type: 'string' },
              match_confidence: { type: 'integer', minimum: 0, maximum: 100 },
              why_match: { type: 'string' },
              bright_outlook: { type: 'boolean' },
              zone: { type: 'integer', minimum: 1, maximum: 5 },
              zone_label: { type: 'string' },
            },
          },
        },
        described_competencies: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'description', 'category', 'alignment', 'evidence', 'development_suggestion', 'tags'],
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              category: { type: 'string' },
              alignment: { type: 'string', enum: ['strong', 'partial', 'gap'] },
              evidence: { type: 'string' },
              development_suggestion: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        core_skills: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'importance', 'level', 'category'],
            properties: {
              name: { type: 'string' },
              importance: { type: 'number' },
              level: { type: 'number' },
              category: { type: 'string' },
            },
          },
        },
        foundation_skills: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'importance', 'level', 'category'],
            properties: {
              name: { type: 'string' },
              importance: { type: 'number' },
              level: { type: 'number' },
              category: { type: 'string' },
            },
          },
        },
        gap_areas: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'severity', 'reason', 'evidence_from_description', 'development_actions', 'related_skills'],
            properties: {
              name: { type: 'string' },
              severity: { type: 'string', enum: ['critical', 'moderate', 'low'] },
              reason: { type: 'string' },
              evidence_from_description: { type: 'string' },
              development_actions: { type: 'array', items: { type: 'string' } },
              related_skills: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        interview_questions: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['question', 'targets_skill', 'question_focus', 'why_it_matters'],
            properties: {
              question: { type: 'string' },
              targets_skill: { type: 'string' },
              question_focus: { type: 'string', enum: ['strength', 'gap'] },
              why_it_matters: { type: 'string' },
            },
          },
        },
        manager_insight: { type: 'string' },
        top_skill_summary: { type: 'string' },
      },
    };

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: ALLOWED_MODEL,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: String(system || '').slice(0, 8000) }] },
          { role: 'user', content: [{ type: 'input_text', text: String(user).slice(0, 10000) }] },
        ],
        max_output_tokens: max,
        text: {
          format: {
            type: 'json_schema',
            name: 'job_description_gap_analysis',
            schema,
            strict: true,
          },
        },
      }),
    });

    const data = await r.json();
    const outputText =
      data.output_text ||
      data.output?.flatMap(item => item.content || []).find(item => item.type === 'output_text')?.text ||
      '';

    res.status(r.status).json({
      ...data,
      output_text: outputText,
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
