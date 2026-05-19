export interface AgentResult {
  agent_id: string;
  agent_name: string;
  agent_emoji: string;
  role_description: string;
  original_text: string;
  rewritten_text: string;
  distortion_score: number;
  distortion_tactics: string[];
}

export interface PipelineResponse {
  original_fact: string;
  agents: AgentResult[];
  total_distortion: number;
  final_vs_original_score: number;
  story_type: string;
  propagation_reasoning: string;
}

export interface FactRequest {
  fact: string;
  provider: string;
  api_key: string;
  model?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  api_key_url: string;
}

export type AppState = 'idle' | 'loading' | 'results' | 'error';
