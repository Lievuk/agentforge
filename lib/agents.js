// AgentForge - Hierarchical Multi-Agent System
// Supervisor Agent controls multiple Worker Agents

const AGENTS = {
  supervisor: {
    id: 'supervisor',
    name: 'Supervisor Agent',
    role: 'CEO',
    description: 'Analyzes tasks, delegates to workers, consolidates results',
    color: '#1a1a2e'
  },
  codesmith: {
    id: 'codesmith',
    name: 'CodeSmith',
    role: 'Developer',
    description: 'Writes, reviews, and optimizes code across languages',
    color: '#0f3460'
  },
  contentcrafter: {
    id: 'contentcrafter',
    name: 'ContentCrafter',
    role: 'Writer',
    description: 'Creates articles, documentation, and structured content',
    color: '#16213e'
  },
  dataseeker: {
    id: 'dataseeker',
    name: 'DataSeeker',
    role: 'Researcher',
    description: 'Gathers information, analyzes data, finds insights',
    color: '#533483'
  },
  qualityguard: {
    id: 'qualityguard',
    name: 'QualityGuard',
    role: 'Reviewer',
    description: 'Reviews outputs for quality, consistency, and correctness',
    color: '#2d3436'
  }
}

// Supervisor logic: analyze task and decide which workers to deploy
function analyzeTask(task) {
  const analysis = {
    hasCode: /```|function|class|def |import |const |let |var |return|async|await|npm|pip|git/i.test(task),
    hasResearch: /\?|why|how|what|explain|research|compare|analyze|difference|history|statistics|data|information/i.test(task),
    hasWriting: /write|draft|create|article|blog|document|story|essay|report|content|guide|tutorial/i.test(task),
    hasReview: /review|check|validate|verify|improve|optimize|refactor|audit|quality/i.test(task),
    complexity: 'low',
    wordCount: task.split(/\s+/).filter(Boolean).length
  }

  analysis.complexity = analysis.wordCount > 50 ? 'high' : analysis.wordCount > 20 ? 'medium' : 'low'

  return analysis
}

function decideDeployment(analysis) {
  const workers = []

  if (analysis.hasCode) workers.push('codesmith')
  if (analysis.hasWriting) workers.push('contentcrafter')
  if (analysis.hasResearch) workers.push('dataseeker')
  if (analysis.hasReview) workers.push('qualityguard')

  // Default: deploy dataseeker + contentcrafter if nothing specific
  if (workers.length === 0) {
    workers.push('dataseeker', 'contentcrafter')
  }

  // Add qualityguard for complex tasks
  if (analysis.complexity === 'high' && !workers.includes('qualityguard')) {
    workers.push('qualityguard')
  }

  return workers
}

function generateWorkerOutput(workerId, task, supervisorContext) {
  switch (workerId) {
    case 'codesmith':
      return `## Code Generation Report\n\n### Implementation\n\nThe following implementation addresses the task requirements with clean, maintainable code.\n\n\`\`\`python\nimport os\nfrom typing import List, Optional\n\nclass TaskHandler:\n    """Handles delegated tasks from the supervisor agent."""\n    \n    def __init__(self, config: Optional[dict] = None):\n        self.config = config or {}\n        self.status = "idle"\n    \n    def execute(self, instruction: str) -> dict:\n        """Execute a delegated task and return results."""\n        self.status = "running"\n        try:\n            result = self._process(instruction)\n            self.status = "complete"\n            return {"status": "success", "data": result}\n        except Exception as e:\n            self.status = "failed"\n            return {"status": "error", "message": str(e)}\n    \n    def _process(self, instruction: str) -> dict:\n        """Core processing logic."""\n        return {\n            "instruction": instruction,\n            "output": f"Processed: {instruction[:50]}...",\n            "metadata": {"agent": "CodeSmith", "version": "1.0"}\n        }\n\n\nclass AgentRegistry:\n    """Registry of available agents managed by the supervisor."""\n    \n    def __init__(self):\n        self._agents = {}\n    \n    def register(self, agent_id: str, handler: TaskHandler):\n        self._agents[agent_id] = handler\n    \n    def get(self, agent_id: str) -> Optional[TaskHandler]:\n        return self._agents.get(agent_id)\n    \n    def list_agents(self) -> List[str]:\n        return list(self._agents.keys())\n\n\n# Usage\nregistry = AgentRegistry()\nregistry.register("CodeSmith", TaskHandler())\nresult = registry.get("CodeSmith").execute("Build a REST endpoint")\nprint(f"Result: {result['status']}")\n\`\`\`\n\n### Key Points\n- Modular architecture for agent isolation\n- Error handling at each execution step\n- Registry pattern for agent discovery\n- Clean status tracking`

    case 'contentcrafter':
      return `## Content Report\n\n### Overview\n\nBased on the supervisor's delegation, this document provides comprehensive coverage of the task requirements.\n\n### Key Sections\n\n**1. Executive Summary**\nThe task encompasses multiple aspects that require careful consideration and structured delivery. A systematic approach ensures all requirements are met.\n\n**2. Detailed Breakdown**\n\nThe implementation follows industry best practices:\n\n- **Architecture**: Modular design with clear separation of concerns\n- **Scalability**: Designed to handle growth and changing requirements\n- **Maintainability**: Clean code with comprehensive documentation\n- **Testing**: Verification at each stage of delivery\n\n**3. Recommendations**\n\n| Priority | Action | Expected Outcome |\n|:---------|:-------|:-----------------|\n| High | Establish core architecture | Foundation for all features |\n| Medium | Implement core logic | Functional delivery |\n| Lower | Add optimizations | Performance improvements |\n\n### Conclusion\nA structured, multi-phase approach ensures quality delivery while maintaining flexibility for changes.`

    case 'dataseeker':
      return `## Research Findings\n\n### Topic Analysis\n\nThe task involves several interconnected domains. Here is the structured research output.\n\n### Key Findings\n\n**1. Context**\n- The subject spans multiple technical domains\n- Current best practices emphasize modularity and testing\n- Industry standards provide clear guidelines\n\n**2. Technical Landscape**\n\n| Aspect | Status | Recommendation |\n|:-------|:-------|:---------------|\n| Architecture | Well-established | Use proven patterns |\n| Tools | Mature ecosystem | Select based on requirements |\n| Standards | Clearly defined | Follow industry conventions |\n\n**3. Critical Insights**\n- Prioritize error handling and edge cases\n- Design for extensibility from the start\n- Document decisions and rationale\n\n### Sources\n- Industry documentation and best practices\n- Community standards and conventions\n- Technical references and specifications`

    case 'qualityguard':
      return `## Quality Review Report\n\n### Review Scope\nReviewing all outputs generated by worker agents for the delegated task.\n\n### Findings\n\n**1. Code Quality**\n| Criteria | Status | Notes |\n|:---------|:-------|:------|\n| Syntax | PASS | Clean, valid syntax |\n| Structure | PASS | Well-organized |\n| Error handling | PASS | Comprehensive coverage |\n| Documentation | PASS | Clear inline docs |\n\n**2. Content Quality**\n| Criteria | Status | Notes |\n|:---------|:-------|:------|\n| Clarity | PASS | Clear and concise |\n| Completeness | PASS | Covers all aspects |\n| Consistency | PASS | Uniform style |\n\n**3. Research Quality**\n| Criteria | Status | Notes |\n|:---------|:-------|:------|\n| Accuracy | PASS | Factually correct |\n| Depth | PASS | Sufficient detail |\n| Relevance | PASS | Directly applicable |\n\n### Overall Assessment\n\nAll worker outputs meet quality standards. Minor improvements suggested for edge case handling in code. **Rating: 4.5/5**`

    default:
      return `Processed task: ${task.substring(0, 100)}`
  }
}

async function supervise(task, selectedWorkers, mode) {
  const startTime = Date.now()
  const timeline = []
  const workerResults = []

  // Phase 1: Supervisor analyzes
  timeline.push({ phase: 'supervisor_analysis', status: 'running', timestamp: 0 })
  const analysis = analyzeTask(task)
  timeline[timeline.length - 1].status = 'complete'
  timeline[timeline.length - 1].result = `Complexity: ${analysis.complexity}, Detected: ${Object.entries(analysis).filter(([k,v]) => k !== 'wordCount' && k !== 'complexity' && v).map(([k]) => k).join(', ')}`

  // Phase 2: Supervisor decides deployment
  timeline.push({ phase: 'supervisor_decision', status: 'running', timestamp: Date.now() - startTime })
  const deployed = selectedWorkers.length > 0 ? selectedWorkers : decideDeployment(analysis)
  const supervisorDecision = {
    task,
    analysis,
    deployedWorkers: deployed,
    strategy: deployed.length > 2 ? 'parallel' : 'sequential',
    estimatedTokens: analysis.wordCount * 4 * deployed.length
  }
  timeline[timeline.length - 1].status = 'complete'
  timeline[timeline.length - 1].result = `Deploying: ${deployed.join(', ')}`

  // Phase 3: Deploy workers
  for (const workerId of deployed) {
    const ts = Date.now() - startTime
    timeline.push({ phase: `worker_${workerId}`, status: 'running', timestamp: ts, worker: workerId })

    // Simulate worker processing
    await new Promise(r => setTimeout(r, 400 + Math.random() * 800))

    const output = generateWorkerOutput(workerId, task, supervisorDecision)
    const tokens = Math.ceil(output.length / 4)

    workerResults.push({
      agentId: workerId,
      name: AGENTS[workerId]?.name || workerId,
      role: AGENTS[workerId]?.role || 'Worker',
      status: 'complete',
      output,
      tokens,
      latency: Date.now() - startTime - ts
    })

    timeline[timeline.length - 1].status = 'complete'
    timeline[timeline.length - 1].latency = workerResults[workerResults.length - 1].latency
  }

  // Phase 4: Supervisor consolidates
  timeline.push({ phase: 'supervisor_consolidation', status: 'running', timestamp: Date.now() - startTime })

  let consolidated = `## Supervisor Final Report\n\n`
  consolidated += `### Task\n${task}\n\n`
  consolidated += `### Analysis\n`
  consolidated += `- **Complexity**: ${analysis.complexity}\n`
  consolidated += `- **Workers Deployed**: ${deployed.length}\n`
  consolidated += `- **Execution Mode**: ${supervisorDecision.strategy}\n\n`
  consolidated += `### Worker Summary\n\n`
  consolidated += `| Agent | Role | Status | Tokens |\n`
  consolidated += `|:-----|:----|:------|:------|\n`
  workerResults.forEach(w => {
    consolidated += `| ${w.name} | ${w.role} | ${w.status} | ~${w.tokens} |\n`
  })
  consolidated += `\n### Consolidated Output\n\n`
  consolidated += `The supervisor agent has analyzed the task, deployed specialized workers, and compiled their outputs. `
  consolidated += `Each worker contributed within their domain of expertise. `
  consolidated += `The combined result provides comprehensive coverage of all task requirements.\n\n`

  const totalTokens = workerResults.reduce((s, w) => s + (w.tokens || 0), 0)
  consolidated += `---\n`
  consolidated += `*Generated by AgentForge Hierarchical Multi-Agent System*\n`
  consolidated += `*Supervisor: ${AGENTS.supervisor.name} | Workers Deployed: ${deployed.length} | Total Tokens: ~${totalTokens}*`

  timeline[timeline.length - 1].status = 'complete'

  return {
    task,
    analysis,
    supervisorDecision,
    workerResults,
    consolidated,
    metrics: {
      totalTokens,
      totalTime: Date.now() - startTime,
      workerCount: workerResults.length,
      complexity: analysis.complexity,
      strategy: supervisorDecision.strategy
    },
    timeline
  }
}

module.exports = { AGENTS, supervise, analyzeTask, decideDeployment }