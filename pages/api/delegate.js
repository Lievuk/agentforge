const { supervise, AGENTS } = require('../../lib/agents')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { task, workers } = req.body

    if (!task || !task.trim()) {
      return res.status(400).json({ error: 'Task description is required' })
    }

    const validWorkers = workers?.filter(w => AGENTS[w]) || []

    const result = await supervise(task.trim(), validWorkers, 'simulated')

    return res.status(200).json(result)

  } catch (error) {
    console.error('AgentForge error:', error)
    return res.status(200).json({
      error: true,
      task: req.body?.task || '',
      consolidated: `Error: ${error.message}`,
      metrics: { totalTokens: 0, totalTime: 0, workerCount: 0 }
    })
  }
}