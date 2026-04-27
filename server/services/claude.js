const Anthropic = require('@anthropic-ai/sdk');
const { TOOLS, callTool } = require('./tools');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT_TEXT = `
You are an expert AI film distribution consultant with 15+ years of experience
in independent film distribution, festival strategy, and market sales.

You work with independent filmmakers, sales agents, distributors, and festival
programmers to build smart, realistic distribution strategies.

Your expertise covers:

FESTIVALS
- Major international festivals: Sundance, TIFF, Berlinale, Cannes, Venice, SXSW,
  Tribeca, Hot Docs, IDFA, Rotterdam, Locarno, San Sebastian, Busan, NYFF, Telluride,
  Edinburgh, BFI London, AFI Fest, Sarajevo, CPH:DOX, Sheffield DocFest, and 50+ more
- Premiere status rules and exclusivity windows
- Tier strategy: when to aim high vs. build momentum at mid-tier fests
- Submission materials: synopses, director statements, loglines, stills strategy
- Fee waiver requests and submission budgeting

PLATFORMS & STREAMING
- Prestige curated platforms: MUBI, Criterion Channel, Ovid
- Major SVOD: Netflix, Amazon, Apple TV+ (realistic acquisition criteria)
- Mid-tier: Fandor, Topic, Guidedoc, Argo, Sundance Now
- AVOD: Tubi, Plex, Pluto TV
- Self-distribution: Vimeo OTT, Seed&Spark
- Educational licensing: Kanopy, Kino Lorber Edu, Alexander Street
- Platform windowing and sequencing strategy

SALES AGENTS & MARKETS
- When a sales agent makes sense vs. when to go direct
- Key markets: AFM (November), EFM (February/Berlin), Cannes Marché (May)
- How to approach agents: timing, materials, pitch
- Contract red flags: expense caps, term length, audit rights, MG vs. advance
- Israeli, Middle Eastern, and European distribution pathways
- Key agents: Protagonist Pictures, Memento, Deckert Distribution, Films Boutique,
  Wide House, Cinephil (Israel), and others

OUTREACH MATERIALS
- Market one-pagers / sell sheets
- Sales agent cold emails
- Platform pitch synopses
- Fee waiver requests
- EPK guidance
- Director statements

PERSONA
- Direct, warm, no hype — speak like a trusted advisor not a salesperson
- Honest about long shots (most films won't get on Netflix — say so)
- Budget-aware: never recommend a market trip the filmmaker can't afford
- Match films to where they genuinely belong, not where everyone wants to be
- Use industry language naturally: window, MG, AVOD, EPK, territory, rights reversion,
  premiere status, world sales, output deal, service deal, hybrid distribution
- Format responses with clear structure: use headers, bullet points, and numbered lists
  when presenting strategy. Use bold for festival names and important terms.

WORKFLOW
When a filmmaker presents a film, ask for:
- Title, format (short/feature/doc), runtime, genre
- Country of origin, language
- Budget range: Micro <$50K / Indie $50K–500K / Mid $500K–5M / Upper Indie $5M+
- Completion status and premiere status
- Festival history (if any)
- Primary goal: audience reach / career launch / revenue / awards
- Available distribution budget

Then build a clear, prioritized strategy. Always recommend the most important
first move rather than overwhelming with options.

Use your tools to look up festival details, match platforms, generate materials,
and build deadline calendars. Always give specific, actionable recommendations.
`;

const SYSTEM_BLOCKS = [
  {
    type: "text",
    text: SYSTEM_PROMPT_TEXT,
    cache_control: { type: "ephemeral" },
  }
];

// For strategy page — streaming, no tool use, focused on pre-scored festival list
async function getStrategyRecommendation(profile, rankedFestivals, res) {
  const top20 = rankedFestivals.slice(0, 20);
  const profileText = `
FILM PROFILE:
Title: ${profile.title}
Logline: ${profile.logline}
Genres: ${(profile.genres || []).join(', ')}
Runtime: ${profile.runtime} minutes
Format: ${profile.format}
Budget Tier: ${profile.budget_tier}
Director Background: ${profile.director_background}
Country: ${profile.country}
Languages: ${(profile.languages || []).join(', ')}
Premiere Status: ${profile.premiere_status}
Awards Eligibility: ${(profile.awards_eligibility || []).join(', ')}
Submission Budget: $${profile.submission_budget}
Goals: ${(profile.goals || []).join(', ')}
Subject Tags: ${(profile.subject_tags || []).join(', ')}

PRE-SCORED FESTIVAL MATCHES (top 20 by algorithmic score):
${top20.map((r, i) => `${i+1}. ${r.festival.name} (Tier ${r.festival.tier}, Score: ${r.score}/100, Prestige: ${r.festival.prestige}) - ${r.festival.location} - ${r.festival.month}`).join('\n')}
`;

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 3000,
      system: SYSTEM_BLOCKS,
      messages: [{ role: 'user', content: `Please analyze this film and provide a comprehensive festival submission strategy:\n\n${profileText}` }],
      betas: ['prompt-caching-2024-07-31'],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  } catch (err) {
    console.error('Claude strategy error:', err);
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'AI service error. Check your API key.' })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  }
}

// For chat — full agentic loop with tool use and streaming
async function chatWithAdvisor(messages, profile, res) {
  const profileContext = profile ? `
The filmmaker's film profile:
- Title: ${profile.title || 'Untitled'}
- Genres: ${(profile.genres || []).join(', ')}
- Runtime: ${profile.runtime}min, Format: ${profile.format}
- Director: ${profile.director_background}, Country: ${profile.country}
- Goals: ${(profile.goals || []).join(', ')}
- Premiere Status: ${profile.premiere_status}
- Budget tier: ${profile.budget_tier}
- Subject tags: ${(profile.subject_tags || []).join(', ')}
` : 'No film profile saved yet.';

  const systemWithProfile = [
    ...SYSTEM_BLOCKS,
    {
      type: "text",
      text: `\nFilm context for this session:\n${profileContext}`,
    }
  ];

  const apiMessages = messages.slice(-20).map(m => ({ role: m.role, content: m.content }));

  try {
    for (let turn = 0; turn < 10; turn++) {
      let turnText = [];

      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 4096,
        system: systemWithProfile,
        tools: TOOLS,
        messages: apiMessages,
        betas: ['prompt-caching-2024-07-31'],
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          res.write(`data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`);
          turnText.push(event.delta.text);
        }
      }

      const response = await stream.finalMessage();

      // Serialize content for message history
      const assistantContent = response.content.map(block => {
        if (block.type === 'text') return { type: 'text', text: block.text };
        if (block.type === 'tool_use') return { type: 'tool_use', id: block.id, name: block.name, input: block.input };
        return block;
      });

      apiMessages.push({ role: 'assistant', content: assistantContent });

      if (response.stop_reason === 'end_turn') break;

      if (response.stop_reason === 'tool_use') {
        const toolUses = response.content.filter(b => b.type === 'tool_use');
        const toolResults = [];

        for (const tu of toolUses) {
          const label = tu.name.replace(/_/g, ' ');
          res.write(`data: ${JSON.stringify({ type: 'tool_calling', tool: tu.name, label })}\n\n`);

          const result = await callTool(tu.name, tu.input);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: tu.id,
            content: result,
          });

          res.write(`data: ${JSON.stringify({ type: 'tool_done', tool: tu.name })}\n\n`);
        }

        apiMessages.push({ role: 'user', content: toolResults });
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  } catch (err) {
    console.error('Claude chat error:', err);
    res.write(`data: ${JSON.stringify({ type: 'error', error: err.message || 'AI service error.' })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  }
}

module.exports = { getStrategyRecommendation, chatWithAdvisor };
