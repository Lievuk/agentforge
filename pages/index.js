import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const WORKERS = [
  { id: 'codesmith', name: 'CodeSmith', role: 'Developer', desc: 'Writes and optimizes code', color: '#0f3460' },
  { id: 'contentcrafter', name: 'ContentCrafter', role: 'Writer', desc: 'Creates articles and content', color: '#16213e' },
  { id: 'dataseeker', name: 'DataSeeker', role: 'Researcher', desc: 'Gathers information and insights', color: '#533483' },
  { id: 'qualityguard', name: 'QualityGuard', role: 'Reviewer', desc: 'Reviews for quality and correctness', color: '#2d3436' }
]

const examples = [
  'Build a REST API with user authentication and PostgreSQL integration',
  'Write technical documentation for a machine learning pipeline',
  'Research and compare cloud providers for deploying microservices',
  'Create a system design for a real-time chat application'
]

export default function Home() {
  const [task, setTask] = useState('')
  const [selectedWorkers, setSelectedWorkers] = useState([])
  const [mode, setMode] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [expandedWorker, setExpandedWorker] = useState(null)
  const [showExamples, setShowExamples] = useState(false)
  const resultsRef = useRef(null)

  const toggleWorker = (id) => {
    setSelectedWorkers(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    )
  }

  const runDelegation = async () => {
    if (!task.trim() || loading) return
    setLoading(true)
    setResult(null)
    setShowExamples(false)

    try {
      const res = await fetch('/api/delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: task.trim(),
          workers: mode === 'manual' ? selectedWorkers : []
        })
      })
      const data = await res.json()
      setResult(data)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 200)
    } catch (err) {
      setResult({
        error: true,
        consolidated: `Error: ${err.message}`,
        metrics: { totalTokens: 0, totalTime: 0, workerCount: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo-section">
            <h1 className="logo">AgentForge</h1>
            <span className="tag">Hierarchical Agent System</span>
          </div>
          <nav className="nav">
            <button className="nav-link" onClick={() => window.open('https://github.com/Lievuk/agentforge', '_blank')}>GitHub</button>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h2 className="hero-title">A supervisor agent that controls multiple worker agents</h2>
          <p className="hero-desc">
            The Supervisor Agent analyzes your task, decides which workers to deploy,
            delegates subtasks, and consolidates all outputs into a final report.
          </p>
        </section>

        {/* Architecture Diagram */}
        <section className="arch-section">
          <div className="arch-diagram">
            <div className="arch-supervisor">
              <div className="arch-node supervisor">Supervisor Agent</div>
            </div>
            <div className="arch-arrows">
              <div className="arch-arrow arrow-left"></div>
              <div className="arch-arrow arrow-mid"></div>
              <div className="arch-arrow arrow-right"></div>
            </div>
            <div className="arch-workers">
              {WORKERS.map(w => (
                <div key={w.id} className="arch-worker-node" style={{ borderColor: w.color }}>
                  <div className="arch-role">{w.role}</div>
                  <div className="arch-name">{w.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Input */}
        <section className="input-section">
          <div className="input-card">
            <div className="input-header">
              <label className="input-label">Task Description</label>
              <button className="examples-btn" onClick={() => setShowExamples(!showExamples)}>
                {showExamples ? 'Hide' : 'Examples'}
              </button>
            </div>

            {showExamples && (
              <div className="examples-list">
                {examples.map((ex, i) => (
                  <button key={i} className="example-item" onClick={() => { setTask(ex); setShowExamples(false) }}>
                    {ex}
                  </button>
                ))}
              </div>
            )}

            <textarea
              className="task-input"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe the task for the Supervisor Agent..."
              rows={4}
              disabled={loading}
            />

            {/* Mode */}
            <div className="mode-row">
              <label className="input-label">Deployment Mode</label>
              <div className="mode-group">
                <button className={`mode-btn ${mode === 'auto' ? 'active' : ''}`} onClick={() => setMode('auto')}>
                  Auto (Supervisor decides)
                </button>
                <button className={`mode-btn ${mode === 'manual' ? 'active' : ''}`} onClick={() => setMode('manual')}>
                  Manual (Pick workers)
                </button>
              </div>
            </div>

            {/* Manual worker selection */}
            {mode === 'manual' && (
              <div className="worker-select" style={{ marginTop: 12 }}>
                <label className="input-label">Select Workers</label>
                <div className="worker-grid">
                  {WORKERS.map(w => (
                    <button
                      key={w.id}
                      className={`worker-chip ${selectedWorkers.includes(w.id) ? 'active' : ''}`}
                      style={selectedWorkers.includes(w.id) ? { borderColor: w.color, background: w.color + '15' } : {}}
                      onClick={() => toggleWorker(w.id)}
                    >
                      <div className="worker-chip-name">{w.name}</div>
                      <div className="worker-chip-role">{w.role}</div>
                      <div className="worker-chip-desc">{w.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="run-btn" onClick={runDelegation} disabled={loading || !task.trim()}>
              {loading ? (
                <span className="loading-text">
                  <span className="loader"></span>
                  Supervisor is delegating...
                </span>
              ) : 'Deploy to Supervisor'}
            </button>
          </div>
        </section>

        {/* Results */}
        {result && (
          <section className="results-section" ref={resultsRef}>
            <h3 className="section-title">Results</h3>

            {/* Metrics */}
            <div className="metrics-bar">
              <div className="metric">
                <span className="metric-value">{result?.metrics?.workerCount || 0}</span>
                <span className="metric-label">Workers</span>
              </div>
              <div className="metric">
                <span className="metric-value">{result?.metrics?.totalTime ? (result.metrics.totalTime / 1000).toFixed(1) : '0'}s</span>
                <span className="metric-label">Duration</span>
              </div>
              <div className="metric">
                <span className="metric-value">{result?.metrics?.complexity || 'N/A'}</span>
                <span className="metric-label">Complexity</span>
              </div>
              <div className="metric">
                <span className="metric-value">{result?.metrics?.strategy || 'N/A'}</span>
                <span className="metric-label">Strategy</span>
              </div>
              <div className="metric">
                <span className="metric-value">~{result?.metrics?.totalTokens || 0}</span>
                <span className="metric-label">Tokens</span>
              </div>
            </div>

            {/* Supervisor Analysis */}
            {result?.analysis && (
              <div className="analysis-card">
                <h4 className="sub-title">Supervisor Analysis</h4>
                <div className="analysis-grid">
                  <div className="analysis-item">
                    <span className="analysis-label">Complexity</span>
                    <span className="analysis-value">{result.analysis.complexity}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Code Detected</span>
                    <span className={`analysis-value ${result.analysis.hasCode ? 'yes' : 'no'}`}>{result.analysis.hasCode ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Research Needed</span>
                    <span className={`analysis-value ${result.analysis.hasResearch ? 'yes' : 'no'}`}>{result.analysis.hasResearch ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Writing Needed</span>
                    <span className={`analysis-value ${result.analysis.hasWriting ? 'yes' : 'no'}`}>{result.analysis.hasWriting ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Review Needed</span>
                    <span className={`analysis-value ${result.analysis.hasReview ? 'yes' : 'no'}`}>{result.analysis.hasReview ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Word Count</span>
                    <span className="analysis-value">{result.analysis.wordCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Workers */}
            {result?.workerResults?.length > 0 && (
              <div className="workers-section">
                <h4 className="sub-title">Worker Outputs</h4>
                <div className="worker-timeline">
                  {result.workerResults.map((w, i) => (
                    <div key={i} className="worker-card">
                      <button className="worker-header" onClick={() => setExpandedWorker(expandedWorker === i ? null : i)}>
                        <div className="worker-info">
                          <span className="worker-name">{w.name}</span>
                          <span className="worker-role-badge">{w.role}</span>
                          <span className="status-badge">{w.status}</span>
                        </div>
                        <div className="worker-meta">
                          <span className="worker-tokens">~{w.tokens} tokens</span>
                          <span className="worker-time">+{w.latency}ms</span>
                          <span className="worker-expand">{expandedWorker === i ? 'Collapse' : 'Expand'}</span>
                        </div>
                      </button>
                      {expandedWorker === i && (
                        <div className="worker-body">
                          <ReactMarkdown>{w.output}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supervisor Final Report */}
            {result?.consolidated && (
              <div className="final-report">
                <h4 className="sub-title">Supervisor Consolidated Report</h4>
                <div className="report-card">
                  <ReactMarkdown>{result.consolidated}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Timeline */}
            {result?.timeline?.length > 0 && (
              <div className="timeline-section">
                <h4 className="sub-title">Execution Timeline</h4>
                <div className="timeline">
                  {result.timeline.map((t, i) => (
                    <div key={i} className="tl-item">
                      <div className={`tl-dot ${t.status}`}></div>
                      <div className="tl-content">
                        <span className="tl-phase">{t.phase.replace(/_/g, ' ')}</span>
                        <span className={`tl-status ${t.status}`}>{t.status}</span>
                        {t.latency && <span className="tl-time">+{t.latency}ms</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <footer className="footer">
          <p>AgentForge - Hierarchical Multi-Agent System. Built for MiMo 100T.</p>
        </footer>
      </main>

      <style jsx>{`
        .app { max-width: 920px; margin: 0 auto; padding: 0 20px; min-height: 100vh; background: #fff; color: #111; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif; }

        .header { border-bottom: 1px solid #e5e5e5; padding: 16px 0; }
        .header-inner { display: flex; align-items: center; justify-content: space-between; }
        .logo-section { display: flex; align-items: baseline; gap: 10px; }
        .logo { font-size: 1.3rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
        .tag { font-size: 0.7rem; color: #888; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
        .nav { display: flex; gap: 12px; }
        .nav-link { padding: 6px 14px; border: 1px solid #d0d0d0; border-radius: 6px; background: #fff; font-size: 0.8rem; cursor: pointer; color: #333; }

        .main { padding: 40px 0 60px; }
        .hero { text-align: center; margin-bottom: 32px; }
        .hero-title { font-size: 1.7rem; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.02em; line-height: 1.3; }
        .hero-desc { font-size: 0.92rem; color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6; }

        .arch-section { margin-bottom: 32px; }
        .arch-diagram { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 10px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .arch-supervisor {}
        .arch-node { padding: 12px 28px; border-radius: 8px; font-size: 0.9rem; font-weight: 700; }
        .arch-node.supervisor { background: #1a1a2e; color: #fff; }
        .arch-arrows { display: flex; gap: 60px; justify-content: center; }
        .arch-arrow { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid #aaa; }
        .arch-workers { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .arch-worker-node { padding: 10px 16px; border: 2px solid; border-radius: 8px; background: #fff; text-align: center; min-width: 90px; }
        .arch-role { font-size: 0.65rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
        .arch-name { font-size: 0.8rem; font-weight: 600; margin-top: 2px; }

        .input-section { margin-bottom: 32px; }
        .input-card { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 10px; padding: 20px; }
        .input-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .input-label { font-size: 0.78rem; font-weight: 600; color: #333; text-transform: uppercase; letter-spacing: 0.05em; }
        .examples-btn { font-size: 0.78rem; color: #666; border: none; background: none; cursor: pointer; text-decoration: underline; }
        .examples-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .example-item { text-align: left; padding: 8px 12px; border: 1px solid #e5e5e5; border-radius: 6px; background: #fff; font-size: 0.8rem; color: #444; cursor: pointer; }
        .example-item:hover { border-color: #888; }
        .task-input { width: 100%; padding: 12px 16px; border: 1px solid #d0d0d0; border-radius: 8px; font-size: 0.88rem; font-family: inherit; line-height: 1.5; resize: vertical; outline: none; background: #fff; color: #111; }
        .task-input:focus { border-color: #555; }
        .task-input::placeholder { color: #aaa; }

        .mode-row { margin-top: 14px; }
        .mode-group { display: flex; gap: 8px; margin-top: 8px; }
        .mode-btn { flex: 1; padding: 10px; border: 1px solid #d0d0d0; border-radius: 6px; background: #fff; font-size: 0.82rem; cursor: pointer; font-weight: 500; color: #333; text-align: center; }
        .mode-btn.active { border-color: #111; background: #111; color: #fff; }

        .worker-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
        .worker-chip { display: flex; flex-direction: column; padding: 10px 14px; border: 1px solid #d0d0d0; border-radius: 8px; background: #fff; cursor: pointer; text-align: left; }
        .worker-chip:hover { border-color: #999; }
        .worker-chip.active { border-width: 2px; }
        .worker-chip-name { font-size: 0.85rem; font-weight: 600; }
        .worker-chip-role { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 0.03em; }
        .worker-chip-desc { font-size: 0.72rem; color: #666; margin-top: 2px; }

        .run-btn { width: 100%; padding: 14px; margin-top: 18px; border: none; border-radius: 8px; background: #111; color: #fff; font-size: 0.92rem; font-weight: 600; cursor: pointer; }
        .run-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .run-btn:not(:disabled):hover { opacity: 0.85; }
        .loading-text { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .loader { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .results-section { margin-bottom: 40px; }
        .section-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 16px; }
        .sub-title { font-size: 0.9rem; font-weight: 600; margin: 0 0 12px; }

        .metrics-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
        .metric { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 14px; text-align: center; }
        .metric-value { display: block; font-size: 1.3rem; font-weight: 700; margin-bottom: 3px; text-transform: capitalize; }
        .metric-label { font-size: 0.65rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }

        .analysis-card { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
        .analysis-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .analysis-item { background: #fff; border: 1px solid #e5e5e5; border-radius: 6px; padding: 10px 12px; }
        .analysis-label { display: block; font-size: 0.68rem; color: #888; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
        .analysis-value { font-size: 0.9rem; font-weight: 600; text-transform: capitalize; }
        .analysis-value.yes { color: #2e7d32; }
        .analysis-value.no { color: #888; }

        .workers-section { margin-bottom: 20px; }
        .worker-card { border: 1px solid #e5e5e5; border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
        .worker-header { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border: none; background: #fafafa; cursor: pointer; text-align: left; }
        .worker-header:hover { background: #f0f0f0; }
        .worker-info { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .worker-name { font-size: 0.85rem; font-weight: 600; }
        .worker-role-badge { font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; background: #eee; color: #555; text-transform: uppercase; }
        .status-badge { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; background: #e8f5e9; color: #2e7d32; text-transform: uppercase; }
        .worker-meta { display: flex; align-items: center; gap: 10px; }
        .worker-tokens, .worker-time { font-size: 0.72rem; color: #888; }
        .worker-expand { font-size: 0.72rem; color: #555; }
        .worker-body { padding: 14px 18px; border-top: 1px solid #e5e5e5; font-size: 0.86rem; line-height: 1.6; }
        .worker-body :global(p) { margin: 6px 0; }
        .worker-body :global(code) { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: 0.85em; }
        .worker-body :global(pre) { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 0.78rem; border: 1px solid #e5e5e5; }
        .worker-body :global(table) { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 0.82rem; }
        .worker-body :global(th), .worker-body :global(td) { border: 1px solid #e5e5e5; padding: 5px 8px; text-align: left; }
        .worker-body :global(th) { background: #fafafa; font-weight: 600; }
        .worker-body :global(h2) { font-size: 1rem; margin: 10px 0 5px; }
        .worker-body :global(h3) { font-size: 0.9rem; margin: 8px 0 4px; }
        .worker-body :global(hr) { border: none; border-top: 1px solid #e5e5e5; margin: 10px 0; }

        .final-report { margin-bottom: 20px; }
        .report-card { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 18px 22px; font-size: 0.88rem; line-height: 1.7; }
        .report-card :global(p) { margin: 6px 0; }
        .report-card :global(table) { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 0.82rem; }
        .report-card :global(th), .report-card :global(td) { border: 1px solid #e5e5e5; padding: 5px 8px; text-align: left; }
        .report-card :global(th) { background: #f5f5f5; }
        .report-card :global(hr) { border: none; border-top: 1px solid #e5e5e5; margin: 10px 0; }

        .timeline-section { margin-bottom: 20px; }
        .timeline { padding-left: 24px; position: relative; }
        .timeline::before { content: ''; position: absolute; left: 7px; top: 4px; bottom: 4px; width: 2px; background: #e5e5e5; }
        .tl-item { position: relative; padding: 6px 0; display: flex; align-items: center; gap: 10px; }
        .tl-dot { position: absolute; left: -17px; width: 12px; height: 12px; border-radius: 50%; background: #e5e5e5; border: 2px solid #fff; }
        .tl-dot.complete { background: #2e7d32; }
        .tl-content { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .tl-phase { font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
        .tl-status { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
        .tl-status.complete { background: #e8f5e9; color: #2e7d32; }
        .tl-time { font-size: 0.72rem; color: #888; }

        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e5e5; }
        .footer p { font-size: 0.75rem; color: #888; margin: 0; }

        @media (max-width: 640px) {
          .metrics-bar { grid-template-columns: repeat(3, 1fr); }
          .analysis-grid { grid-template-columns: 1fr 1fr; }
          .worker-grid { grid-template-columns: 1fr; }
          .arch-workers { gap: 6px; }
          .arch-worker-node { min-width: 70px; padding: 8px 10px; }
        }
      `}</style>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; color: #111; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
        ::selection { background: #111; color: #fff; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 3px; }
      `}</style>
    </div>
  )
}