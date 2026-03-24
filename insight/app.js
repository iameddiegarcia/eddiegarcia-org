/* ═══════════════════════════════════════════════════
   INSIGHT ENGINE — Core Application Logic
   ═══════════════════════════════════════════════════ */

// ─── Insight Data (parsed from INSIGHTS.md) ───
const INSIGHTS = {
  "Organizational Systems": {
    icon: "⚙️",
    color: "rgba(124,106,239,0.15)",
    desc: "Structure, data infrastructure, automation, and how systems shape decisions.",
    items: [
      { title: "Systems vs Structure", quote: "Most technology problems are structure and governance problems wearing a software costume.", tags: ["org-design","systems","transformation"] },
      { title: "Capability-First Design vs Structure-First Design", quote: "Structure-first reorganizes boxes on an org chart. Capability-first builds people who transcend boxes. The sequencing — structure then capability, or capability then structure — determines whether transformation sticks or just looks different on paper.", tags: ["org-design","strategy","hr-transformation"] },
      { title: "Interchangeable Managers Kill Silos by Design", quote: "Requiring leaders to be capable of running any function prevents empire-building, creates organizational resilience, and makes succession planning a feature of the architecture rather than a crisis response.", tags: ["org-design","leadership","strategy"] },
      { title: "Cross-Functional Rotation Is Architecture, Not Development", quote: "Rotating leaders across functions isn't a training program — it's a structural design choice that prevents knowledge hoarding and organizational brittleness. Build it into the operating model, not the L&D catalog.", tags: ["org-design","leadership","talent-management"] },
      { title: "Structure → Process → System", quote: "Effective transformation follows the sequence: fix structure, improve process, then implement technology.", tags: ["org-design","transformation","process-design"] },
      { title: "Fragmented Systems Create Fragmented Decisions", quote: "When systems and data are fragmented across divisions, decision-making becomes negotiation instead of analysis.", tags: ["data-governance","org-politics"] },
      { title: "Manual Reporting Is Technical Debt", quote: "Manual reporting is a sign that the organization has not treated data as infrastructure.", tags: ["data-infrastructure","analytics"] },
      { title: "Automation Should Remove Work Categories", quote: "The highest value automation eliminates entire classes of work rather than speeding up existing tasks.", tags: ["automation","productivity"] },
      { title: "Data Infrastructure Determines Strategy", quote: "Strategic analytics capability depends on clean, integrated data architecture.", tags: ["data-infrastructure","strategy"] },
      { title: "Data Pipelines Are Strategic Assets", quote: "The group controlling data access and APIs controls innovation velocity.", tags: ["data-governance","platforms"] },
      { title: "Systems Expose Organizational Weakness", quote: "Technology modernization often reveals deeper structural and governance flaws.", tags: ["systems","transformation","org-design"] },
      { title: "Poor Data Quality Creates Hidden Labor Costs", quote: "Bad data forces manual reconciliation and consumes analyst capacity.", tags: ["data-infrastructure","analytics"] },
      { title: "Analytics Must Answer Strategic Questions", quote: "Dashboards should drive decisions, not simply display operational metrics.", tags: ["analytics","strategy"] },
      { title: "System Sprawl Quantifies Transformation Debt", quote: "Mapping all active systems against the core HRIS reveals the true scope of process fragmentation — the gap between official systems and actual workflows is the transformation backlog.", tags: ["systems","hr-transformation","data-infrastructure"] },
      { title: "Knowledge Fragmentation Follows Session Fragmentation", quote: "When multiple sessions save insights to separate local files instead of a central store, the merge becomes manual labor. Knowledge architecture must account for distributed capture points or insights decay into silos.", tags: ["knowledge-management","systems-thinking","data-infrastructure"] },
    ]
  },
  "Workforce Strategy": {
    icon: "👥",
    color: "rgba(96,165,250,0.15)",
    desc: "Vacancy management, workforce planning, headcount as strategy, and staffing discipline.",
    items: [
      { title: "Vacancy Myth", quote: "A vacancy is not proof of need.", tags: ["staffing","org-design"] },
      { title: "Workforce Planning Discipline", quote: "Workforce planning is a management discipline, not an HR formality.", tags: ["workforce-planning","org-design","leadership"] },
      { title: "Workforce Planning Is Capital Allocation", quote: "Staffing decisions should be treated like financial investment decisions.", tags: ["workforce-planning","strategy"] },
      { title: "Reactive Hiring Causes Organizational Drift", quote: "Organizations that refill positions automatically lose the opportunity to redesign work.", tags: ["staffing","org-design"] },
      { title: "Vacancy Management Is a Strategic Lever", quote: "Every open position is an opportunity to restructure capability.", tags: ["staffing","strategy"] },
      { title: "Headcount Shapes Strategy", quote: "Staffing models determine organizational capacity more than most technology investments.", tags: ["workforce-planning","strategy"] },
      { title: "Shadow HR Emerges From System Failure", quote: "Decentralized HR practices often arise when centralized systems fail to meet operational needs.", tags: ["hr-transformation","systems"] },
      { title: "HR Leaders Are Workforce Architects", quote: "Modern HR leadership involves designing workforce systems, not just administering policies.", tags: ["hr-future","leadership"] },
      { title: "HR-to-Employee Ratios Expose Strategic Misalignment", quote: "A low ratio (e.g., 1:34 vs. SHRM benchmark 1:75-100) doesn't mean overstaffing — it means headcount is concentrated in operational roles while strategic capability remains hollow. The ratio reveals where investment is going, not whether there's enough of it.", tags: ["workforce-planning","hr-transformation","metrics"] },
      { title: "Temporary Workforce Concentration Signals Institutional Avoidance", quote: "When 25% of a function is temporary or substitute staff, the organization is avoiding permanent investment in that capability. It's a structural tell.", tags: ["staffing","org-design","public-sector"] },
      { title: "Priority Hire Sequencing Is Strategy", quote: "The order in which you fill gaps determines which capabilities come online first and shapes organizational trajectory for years. Sequencing is not logistics — it's strategy.", tags: ["workforce-planning","strategy","hiring"] },
      { title: "Retirement Pipelines Are Succession Deadlines", quote: "When 30%+ of a workforce reaches retirement eligibility within a decade, unfilled development pipelines become capability cliffs — retirement analysis is enterprise risk forecasting, not HR paperwork.", tags: ["workforce-planning","succession","strategy"] },
      { title: "First-Year Attrition Is an Onboarding Diagnostic", quote: "When over a quarter of separations happen within the first year, the problem isn't hiring quality — it's integration design. Early attrition is a process signal, not a people signal.", tags: ["workforce-planning","onboarding","metrics"] },
    ]
  },
  "Bureaucracy & Institutional Dynamics": {
    icon: "🏛️",
    color: "rgba(251,146,60,0.15)",
    desc: "Navigating institutional friction, risk avoidance, decision delays, and organizational politics.",
    items: [
      { title: "Local Urgency Is Not Enterprise Priority", quote: "In multi-department environments, urgency at the department level does not automatically translate to enterprise prioritization. You have to manufacture that urgency through framing, escalation, and attachment to things the enterprise already cares about.", tags: ["bureaucracy","public-sector","escalation"] },
      { title: "Institutions Optimize for Risk Avoidance", quote: "Large organizations prioritize risk mitigation over speed and innovation.", tags: ["bureaucracy","org-dynamics"] },
      { title: "Official Priorities vs Real Priorities", quote: "Institutional priority lists rarely match operational reality.", tags: ["bureaucracy","leadership"] },
      { title: "Ambiguity Protects Institutions", quote: "Vague ownership and unclear timelines reduce accountability.", tags: ["bureaucracy","accountability"] },
      { title: "Decision Avoidance Disguised as Process", quote: "Many bureaucratic delays mask an unwillingness to make decisions.", tags: ["leadership","org-dynamics"] },
      { title: "Governance Determines Innovation Speed", quote: "Approval structures and oversight processes determine how fast change can occur.", tags: ["governance","innovation"] },
      { title: "Organizational Friction Accumulates Over Time", quote: "Small inefficiencies compound until someone deliberately redesigns the system.", tags: ["operations","org-design"] },
      { title: "Operational Friction Erodes Trust", quote: "Bad systems gradually reduce employee confidence in leadership.", tags: ["operations","culture"] },
      { title: "Lack of Ownership Creates Failure Zones", quote: "Unclear responsibility leads to stalled initiatives.", tags: ["accountability","org-design"] },
      { title: "Special Projects Signal Structural Gaps", quote: "Work labeled \"special projects\" often represents areas the organization has not formally structured.", tags: ["org-design","transformation"] },
      { title: "Visibility Is The Currency Of Bureaucracies", quote: "In institutional settings, work that is not logged, categorized, assigned, or connected to a recognized initiative is functionally invisible. Recognition, protection, and leverage flow less from effort itself than from whether the work is legible inside the system. Invisibility, not lack of value, is often the real failure mode for capable people in bureaucracies.", tags: ["bureaucracy","visibility","institutional-logic"] },
      { title: "Policy Enforcement Starts Where Ambiguity Ends", quote: "Most workplace conflict around accountability is not caused by resistance alone; it is caused by soft language that leaves room for personal interpretation. Standards only become enforceable once expectations are translated into operationally clear behaviors. Leaders reduce resistance by making ambiguity expensive and clarity normal.", tags: ["bureaucracy","policy","clarity","accountability"] },
    ]
  },
  "Leadership & Influence": {
    icon: "🎯",
    color: "rgba(168,85,247,0.15)",
    desc: "Framing, authority, escalation, completed staff work, and influence strategy.",
    items: [
      { title: "Clarity as Force Multiplier", quote: "Clarity is a leadership force multiplier. Organizations stall when leaders tolerate ambiguity in structure and responsibility.", tags: ["leadership","org-design"] },
      { title: "Clarity Signals Authority", quote: "Leaders who simplify complex issues gain credibility.", tags: ["leadership","communication"] },
      { title: "Executives Need Framing, Not Detail", quote: "Senior leaders respond better to concise strategic framing than exhaustive explanation.", tags: ["leadership","communication"] },
      { title: "Defensive Communication Weakens Authority", quote: "Over-explaining signals uncertainty and invites resistance.", tags: ["leadership","influence"] },
      { title: "Inevitability Framing Increases Adoption", quote: "Ideas framed as inevitable trends gain acceptance faster.", tags: ["strategy","influence"] },
      { title: "Framing Beats Arguing", quote: "Influence increases when leaders frame problems correctly rather than argue harder.", tags: ["leadership","influence"] },
      { title: "Escalation Is a Leadership Tool", quote: "Strategic escalation clarifies priorities and forces institutional attention.", tags: ["leadership","strategy"] },
      { title: "Calm Escalation Is More Effective", quote: "Calm documentation of risk creates stronger pressure than emotional escalation.", tags: ["bureaucracy","leadership"] },
      { title: "Agreement Is Not Adoption", quote: "Getting leadership to agree with logic is different from getting them to act on it. Strong framing clears the first gate. Execution depends on institutional readiness and political will.", tags: ["leadership","influence","change-management"] },
      { title: "Completed Staff Work Multiplies Leadership Capacity", quote: "Leaders move faster when staff bring fully developed solutions rather than partial problems.", tags: ["leadership","management"] },
      { title: "High-Performance Teams Reduce Cognitive Load", quote: "Teams that prepare decisions properly allow leaders to focus on strategy.", tags: ["leadership","management"] },
      { title: "Initiative + Judgment", quote: "Initiative is valuable only when paired with judgment.", tags: ["culture","leadership"] },
      { title: "Bilingual Leadership", quote: "The most effective transformation leaders are fluent in vision and constraint.", tags: ["leadership","transformation"] },
      { title: "Clarity of Thinking Is Revealed Through Constraint Design", quote: "Designing tight instructions forces articulation of implicit standards. Better prompts don't just improve outputs — they sharpen the thinking that produced them.", tags: ["leadership","clarity","thinking"] },
      { title: "People Accept Hard Truth Better When They Feel The Fairness", quote: "A tough message lands when the standard is framed as shared responsibility, customer impact, and fairness to the team rather than as irritation with individual behavior. The emotional difference between \"you failed\" and \"this is what the work requires\" determines whether accountability feels legitimate or personal. The right tone is what allows hard expectations to survive contact with people.", tags: ["leadership","accountability","communication","framing"] },
      { title: "Reframing Is More Powerful Than Defending", quote: "When a message is likely to trigger pushback, leaders gain more by changing the frame than by piling on explanation. Positioning expectations as normal, mission-linked, and protective of service quality creates pull; over-justification invites debate on the wrong terrain. Once a leader starts defending the premise, they have already surrendered strategic ground.", tags: ["leadership","influence","framing","executive-presence"] },
    ]
  },
  "Technology & Transformation": {
    icon: "🚀",
    color: "rgba(52,211,153,0.15)",
    desc: "Change management, system implementation, digital literacy, and strategic integration.",
    items: [
      { title: "Digital Transformation Is Not an IT Project", quote: "Successful transformation requires process, policy, and behavior change.", tags: ["transformation","org-design"] },
      { title: "Communication Architecture Is Part of System Architecture", quote: "System implementations fail as often from communication breakdown as technical issues.", tags: ["systems","implementation"] },
      { title: "Training Is Implementation", quote: "A system is not implemented until users can operate it reliably.", tags: ["training","systems"] },
      { title: "Documentation Creates Institutional Memory", quote: "Written procedures convert tribal knowledge into durable infrastructure.", tags: ["knowledge-management","operations"] },
      { title: "Administrative Roles Are Becoming Technical Roles", quote: "Support staff increasingly require system literacy and analytics skills.", tags: ["future-of-work","hr-tech"] },
      { title: "Role Title Lag Creates Hiring Risk", quote: "When job titles fall behind actual role complexity, you underscope the position, attract the wrong candidates, and undervalue the work. Title modernization must track with function evolution.", tags: ["hr-transformation","org-design","hiring"] },
      { title: "Position Control Is a Strategic Choke Point", quote: "Control over position data connects budgeting, workforce planning, and analytics.", tags: ["workforce-planning","analytics"] },
      { title: "System Integrators Are Strategic Translators", quote: "Transformation leaders translate between operational needs and system capabilities.", tags: ["transformation","systems"] },
      { title: "Transformation Nodes", quote: "Hybrid analyst teams often function as internal transformation offices.", tags: ["transformation","org-design"] },
      { title: "Route Through Working Infrastructure, Not Ideal Infrastructure", quote: "When the designed delivery channel fails, reroute through an already-connected channel rather than building a new capability. The fastest solution uses what's already live.", tags: ["systems","automation","strategy"] },
      { title: "Self-Improving Tools Create Compound Returns", quote: "Tools that cache results from every interaction get faster over time. Design infrastructure that learns from its own operation — the more you use the system, the more valuable it becomes.", tags: ["systems","automation","knowledge-management"] },
      { title: "AI Becomes Strategic Only When It Produces Reusable Thinking", quote: "AI shifts from tactical to strategic when outputs are heuristics and decision principles, not one-off answers — building intellectual capital, not just completing tasks.", tags: ["technology","ai-strategy","knowledge-systems"] },
    ]
  },
  "HR Transformation": {
    icon: "🔄",
    color: "rgba(244,114,182,0.15)",
    desc: "Future of HR, AI adoption, maturity models, capability gaps, and structural redesign.",
    items: [
      { title: "HR Is Becoming a Data Intelligence Function", quote: "The future HR organization will resemble a workforce analytics team.", tags: ["hr-future","analytics"] },
      { title: "HR Professionals Are Overloaded", quote: "Many strategic tasks remain undone because HR staff are overloaded with operational work.", tags: ["hr-transformation","productivity"] },
      { title: "AI Unlocks Neglected Work", quote: "AI's greatest value is enabling work that previously could not be completed.", tags: ["ai","productivity"] },
      { title: "AI Adoption Requires Process Discipline", quote: "Organizations without standardized processes struggle to implement AI.", tags: ["ai","process-design"] },
      { title: "Augmentation Beats Replacement Narratives", quote: "AI adoption accelerates when framed as capacity expansion rather than job loss.", tags: ["ai","change-management"] },
      { title: "Structure Without Capability Is Just Rearranging Boxes", quote: "Reorganizing functions into pillars without building cross-functional capability just moves the same limitations to a new address. A reorg is not a transformation — capability development is.", tags: ["hr-transformation","org-design","strategy"] },
      { title: "Gap Analysis Requires People, Not Just Positions", quote: "Mapping actual employees (names, classifications, tenure, authority type) to proposed structures reveals real capability gaps that org charts alone obscure. An org chart is a hypothesis; employee data is the test.", tags: ["hr-transformation","workforce-planning","analytics"] },
      { title: "Model Alignment Is a Maturity Metric", quote: "Scoring organizational design against established frameworks (Bersin, SHRM, Ulrich, IPMA-HR) creates a quantifiable baseline for transformation progress. Current state 39% → Proposed 72% → Ideal 88% tells a story that executives can act on.", tags: ["hr-transformation","strategy","metrics"] },
      { title: "HRBPs Are the Central Nervous System, Not a Support Function", quote: "When HRBPs are elite generalists with deep multi-specialization experience, they become the primary delivery mechanism — not a staffing line item inside one pillar. Zero filled HRBP positions means the nervous system doesn't exist yet.", tags: ["hr-transformation","org-design","hrbp"] },
      { title: "Proposed Structures Inherit Current Weaknesses", quote: "A reorganization that moves existing people into new boxes without addressing capability gaps produces the same output from a different address. The reorg is the skeleton; capability is the muscle.", tags: ["hr-transformation","org-design"] },
      { title: "The 20/30 Problem", quote: "When only 20% of HR staff have formal training in modern capabilities and only 30% have adopted available technology, the transformation gap isn't structural — it's human. No amount of reorganization fixes an upskilling deficit.", tags: ["hr-transformation","training","change-management"] },
      { title: "Position Descriptions Are Blueprints For The Operating Model", quote: "A position description is not just an HR compliance document; it is a design artifact that reveals what work the organization thinks matters, how roles are supposed to integrate, and where capability gaps are being hidden. Reviewing PDs strategically can expose whether the org is building clerical support, operational administration, or true transformation capacity. In HR transformation, staffing problems are often misdiagnosed when the real issue is that the role architecture itself is pointing at the wrong operating model.", tags: ["hr-transformation","org-design","role-architecture"] },
    ]
  },
  "Organizational Culture": {
    icon: "🧬",
    color: "rgba(251,191,36,0.15)",
    desc: "Accountability, tribe mentality, ownership, continuous learning, and behavioral design.",
    items: [
      { title: "Tribe Not Family Is an Accountability Framework", quote: "\"Family\" implies unconditional belonging; \"tribe\" implies mutual obligation, shared standards, and earned membership. The distinction is not semantic — it drives performance expectations and tolerance for underperformance.", tags: ["culture","accountability","leadership"] },
      { title: "Culture Is Operational Behavior", quote: "Culture is reinforced through daily habits rather than slogans.", tags: ["culture","org-design"] },
      { title: "Engineered Culture", quote: "Culture can be designed through explicit principles and expectations.", tags: ["culture","org-design"] },
      { title: "Ownership Drives Performance", quote: "Teams that treat work as their own produce better outcomes.", tags: ["culture","leadership"] },
      { title: "Accountability Requires Consequences", quote: "Values only matter when they influence evaluation and reward systems.", tags: ["culture","accountability"] },
      { title: "Collaboration Expands Problem-Solving Capacity", quote: "Complex problems require cross-functional perspectives.", tags: ["culture","org-design"] },
      { title: "Continuous Learning Is a Strategic Advantage", quote: "Organizations that adapt faster outperform rigid structures.", tags: ["culture","strategy"] },
    ]
  },
  "Process & Operational Design": {
    icon: "📐",
    color: "rgba(45,212,191,0.15)",
    desc: "Process discipline, accessibility, fairness-by-design, cognitive load, and operational dignity.",
    items: [
      { title: "Process Design Determines Productivity", quote: "Poorly designed processes impose invisible productivity taxes.", tags: ["process-design","operations"] },
      { title: "Accessibility Is Governance", quote: "Inaccessible workflows represent compliance and design failures.", tags: ["compliance","design"] },
      { title: "Improvised Fairness Is Unfair", quote: "Without written protocols for edge cases — tech disruptions, panel interruptions, process exceptions — well-intentioned improvisation creates uneven treatment. Fairness requires systems, not goodwill.", tags: ["process-design","compliance","hr-transformation"] },
      { title: "Operational Dignity Matters", quote: "Employees judge leadership credibility by the quality of operational systems.", tags: ["operations","culture"] },
      { title: "Systems Should Reduce Cognitive Load", quote: "Good processes simplify work rather than complicate it.", tags: ["process-design","systems"] },
      { title: "Systems Drift Toward Overproduction Without Constraints", quote: "Analytical systems produce more outputs by default — quality requires artificial scarcity enforced through explicit count limits and exclusion criteria.", tags: ["process-design","signal-vs-noise","constraints"] },
      { title: "Evaluation Criteria Must Be Embedded, Not Implied", quote: "Stating evaluation gates explicitly (e.g., \"Would this change a future decision?\") turns subjective quality judgment into a repeatable filter. Implicit standards don't hold.", tags: ["process-design","frameworks","decision-filters"] },
      { title: "Acknowledgment Prevents More Escalation Than Resolution Speed", quote: "Customers usually tolerate delay better than silence. A simple acknowledgment, ETA, and categorization discipline often protects trust more effectively than trying to solve everything immediately. Many service problems are actually communication design problems, not throughput problems.", tags: ["process-design","customer-service","communication-systems"] },
      { title: "Hybrid Work Fails At The Point Of Experience, Not Policy", quote: "Telecommuting becomes fragile when the lived experience for coworkers and customers is materially worse than being in person. The real standard for remote work is not permission to be remote; it is whether the interaction quality, responsiveness, and visibility remain comparable to onsite work. This shifts hybrid management from ideology into a design test based on experience quality.", tags: ["process-design","hybrid-work","service-quality"] },
    ]
  },
  "Strategy & Institutional Change": {
    icon: "♟️",
    color: "rgba(129,140,248,0.15)",
    desc: "Risk framing, political strategy, parallel tracks, and designing around slowness.",
    items: [
      { title: "Risk Framing Moves Institutions", quote: "Organizations respond faster to risk exposure than operational inconvenience.", tags: ["strategy","communication"] },
      { title: "Transformation Requires Political Strategy", quote: "Technical solutions must include plans for navigating institutional power structures.", tags: ["transformation","strategy"] },
      { title: "Parallel Tracks Enable Change", quote: "Innovation and compliance must move together in public-sector environments.", tags: ["public-sector","strategy"] },
      { title: "Design Around Institutional Slowness", quote: "When enterprise systems consistently lag, build fallback architectures rather than waiting for resolution. Dependency on slow systems without a Plan B transfers risk to your own deliverables.", tags: ["strategy","public-sector","systems"] },
      { title: "Strategic Work Often Hides in Operational Language", quote: "Transformation efforts are frequently mislabeled as routine administrative work.", tags: ["leadership","org-design"] },
      { title: "Knowledge Systems Require Curation, Not Accumulation", quote: "A knowledge system's value comes from what it excludes as much as what it holds. Systems that accumulate without active filtering degrade over time.", tags: ["strategy","knowledge-management","curation"] },
      { title: "Build On The Core Before The Future", quote: "Enterprise transformation fails when leaders try to layer visionary capabilities on top of unstable transactional foundations. The smarter sequence is to stabilize the system that pays people, governs records, and defines truth before selling the future-state architecture. Transformation sequencing itself is strategic, and credibility is lost when advanced capabilities are built on contested operational truth.", tags: ["strategy","sequencing","enterprise-change"] },
      { title: "Governance Beats Heroics", quote: "When multiple groups interpret the same operational dataset independently, the organization creates parallel truths, duplicated effort, and policy risk. Durable progress comes from coordinated governance over data access, definitions, and reporting ownership rather than from individual teams working harder. In complex organizations, ambiguity in governance produces recurring friction that no amount of individual effort can solve.", tags: ["strategy","governance","data-strategy"] },
    ]
  },
  "Personal Strategic Philosophy": {
    icon: "💎",
    color: "rgba(239,106,154,0.15)",
    desc: "Leverage, systems-thinking, language as power, and your personal operating model.",
    items: [
      { title: "Leverage Beats Motion", quote: "Strategic impact comes from changing leverage points rather than increasing effort.", tags: ["strategy","leadership"] },
      { title: "Recurring Problems Should Become Systems", quote: "Repeated issues should be solved with frameworks and automation.", tags: ["systems-thinking","productivity"] },
      { title: "Language Is a Strategic Tool", quote: "Communication style influences outcomes and power dynamics.", tags: ["communication","leadership"] },
      { title: "Institutions Rarely Self-Correct", quote: "Legacy systems require deliberate redesign.", tags: ["transformation","leadership"] },
      { title: "Transformation Leaders Operate Across Domains", quote: "Effective strategists integrate policy, technology, analytics, and operations.", tags: ["leadership","transformation"] },
      { title: "Strategic Leaders Simplify Complexity", quote: "Clarity accelerates institutional action.", tags: ["leadership","strategy"] },
      { title: "The Strategist Redesigns Systems", quote: "The goal of strategy is to create systems where better outcomes become inevitable.", tags: ["systems-thinking","strategy"] },
      { title: "Use Industry Frameworks as Scoring Rubrics, Not Blueprints", quote: "Established models (Bersin, SHRM, Ulrich, IPMA-HR) are most useful not as organizational templates to copy, but as alignment scoring tools that quantify current state, measure progress, and expose blind spots in proposed designs.", tags: ["strategy","hr-transformation","frameworks"] },
      { title: "The Gap Between Philosophy and Workforce Is the Real Gap", quote: "Having a sophisticated organizational philosophy means nothing if the workforce lacks the baseline capability to execute it. Vision without bench strength is just aspiration.", tags: ["strategy","leadership","workforce-planning"] },
      { title: "Reorgs Are Scaffolding — Culture Is the Building", quote: "Accept a structural reorganization as the skeleton, then inject capability-first philosophy into how people move through it. The structure enables; the operating model determines what actually changes.", tags: ["strategy","org-design","hr-transformation"] },
      { title: "Your Model Is Your Business Case", quote: "When your personal organizational philosophy (elite HRBPs, interchangeable managers, continuous improvement, tribal accountability) can be articulated clearly against established frameworks, it becomes a competing architecture — not just an opinion. Quantify the delta and let the numbers argue.", tags: ["strategy","leadership","influence"] },
      { title: "Insight Capture Turns Experience Into Compounding Advantage", quote: "The real asset is not the work product from any single conversation, but the transferable lessons extracted from repeated friction, tradeoffs, and decision patterns. A personal knowledge system becomes strategic when it captures judgment, not output. The highest-leverage use of AI in knowledge work is converting lived experience into durable decision intelligence.", tags: ["strategy","knowledge-compounding","judgment"] },
      { title: "Standards Need A Narrative, Not Just A Rule", quote: "Teams are more likely to internalize discipline when expectations are tied to identity: who we are, how we work, and what kind of team we are becoming. Standards stick when they feel like belonging to a culture, not merely complying with a manager. Culture adoption happens through narrative framing, not policy language alone.", tags: ["strategy","culture-building","leadership-identity"] },
    ]
  }
};

const topicsGrid   = document.getElementById('topicsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modal        = document.getElementById('modal');
const modalCategory = document.getElementById('modalCategory');
const modalTitle   = document.getElementById('modalTitle');
const modalQuote   = document.getElementById('modalQuote');
const modalTags    = document.getElementById('modalTags');
const modalClose   = document.getElementById('modalClose');
const btnAnother   = document.getElementById('btnAnother');
const btnCopy      = document.getElementById('btnCopy');
const scrollCue    = document.getElementById('scrollCue');
const shareX       = document.getElementById('shareX');
const shareLinkedIn = document.getElementById('shareLinkedIn');
const shareFacebook = document.getElementById('shareFacebook');
const themeToggle  = document.getElementById('themeToggle');
const root         = document.documentElement;

// ─── Theme Initialization ───
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
  root.setAttribute('data-theme', 'light');
}

// ─── Theme Toggle Logic ───
themeToggle.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  if (currentTheme === 'light') {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

let currentCategory = null;
let usedIndices = {};  // track shown insights per category to avoid repeats

// ─── Build Topic Cards ───
function renderTopics() {
  const categories = Object.keys(INSIGHTS);
  categories.forEach((name, i) => {
    const data = INSIGHTS[name];
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Get insight about ${name}`);
    card.innerHTML = `
      <div class="card-icon" style="background:${data.color}">${data.icon}</div>
      <div class="card-title">${name}</div>
      <div class="card-desc">${data.desc}</div>
      <div class="card-count">${data.items.length} insight${data.items.length !== 1 ? 's' : ''}</div>
    `;
    card.addEventListener('click', () => openInsight(name));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInsight(name); } });
    topicsGrid.appendChild(card);
  });
}

// ─── Random Insight (avoids repeats until all shown) ───
function getRandomInsight(category) {
  const items = INSIGHTS[category].items;
  if (!usedIndices[category]) usedIndices[category] = [];
  if (usedIndices[category].length >= items.length) usedIndices[category] = [];

  let idx;
  do {
    idx = Math.floor(Math.random() * items.length);
  } while (usedIndices[category].includes(idx));

  usedIndices[category].push(idx);
  return items[idx];
}

// ─── Open Modal ───
function openInsight(category) {
  currentCategory = category;
  const insight = getRandomInsight(category);
  populateModal(category, insight);
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  btnAnother.focus();
}

function populateModal(category, insight) {
  modalCategory.textContent = category;
  modalTitle.textContent = insight.title;
  modalQuote.textContent = insight.quote;
  modalTags.innerHTML = insight.tags.map(t => `<span class="tag">#${t}</span>`).join('');

  // Reset copy button
  const copySpan = btnCopy.querySelector('span');
  if (copySpan) copySpan.textContent = 'Copy';
  btnCopy.classList.remove('copied');

  // Animate in
  modal.style.animation = 'none';
  modal.offsetHeight; // trigger reflow
  modal.style.animation = '';
}

// ─── Build share text ───
function getShareText() {
  const quote = modalQuote.textContent;
  const title = modalTitle.textContent;
  // Customizable attribution
  const attribution = "via @EddieGarciaLAX"; 
  return `"${quote}"\n\n— ${title}\n\n${attribution}`;
}

// ─── Close Modal ───
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── Another Insight ───
btnAnother.addEventListener('click', () => {
  if (!currentCategory) return;
  const insight = getRandomInsight(currentCategory);

  // Quick exit-enter animation
  modal.style.transform = 'translateY(10px) scale(0.97)';
  modal.style.opacity = '0.6';
  setTimeout(() => {
    populateModal(currentCategory, insight);
    modal.style.transform = '';
    modal.style.opacity = '';
  }, 180);
});

// ─── Copy ───
btnCopy.addEventListener('click', () => {
  const text = getShareText();
  navigator.clipboard.writeText(text).then(() => {
    const span = btnCopy.querySelector('span');
    if (span) span.textContent = 'Copied!';
    btnCopy.classList.add('copied');
    setTimeout(() => {
      if (span) span.textContent = 'Copy';
      btnCopy.classList.remove('copied');
    }, 2000);
  });
});

// ─── Social Sharing ───
shareX.addEventListener('click', () => {
  const text = getShareText();
  // twitter.com/intent/tweet handles text better than the new x.com URLs
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
});

shareLinkedIn.addEventListener('click', () => {
  const text = getShareText();
  // LinkedIn blocks custom text on standard share URLs (it only reads meta tags from public URLs).
  // This workaround auto-copies the text to your clipboard AND opens the feed compose box.
  // You just hit "Paste" (Cmd/Ctrl+V) when LinkedIn opens!
  navigator.clipboard.writeText(text).then(() => {
    alert("Quote copied to clipboard! Just paste it into the LinkedIn post box.");
    const url = `https://www.linkedin.com/feed/?shareActive=true`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  });
});

shareFacebook.addEventListener('click', () => {
  const text = getShareText();
  // Facebook strictly rules against pre-filling text; it must be pasted by the user.
  navigator.clipboard.writeText(text).then(() => {
    alert("Quote copied to clipboard! Just paste it into the Facebook post box.");
    // Link back to the site once it's hosted publicly
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  });
});

// ─── Scroll Cue ───
scrollCue.addEventListener('click', () => {
  document.getElementById('topics').scrollIntoView({ behavior: 'smooth' });
});

// ─── Init ───
renderTopics();
