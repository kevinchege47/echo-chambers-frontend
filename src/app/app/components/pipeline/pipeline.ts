import {
  Component, OnInit, inject, signal, computed, effect, Provider
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DecimalPipe, SlicePipe} from '@angular/common';
import {AgentCardComponent} from '../agent-card/agent-card';
import {MisinformationService} from '../../services/misinformation';
import {AIProvider, AppState, PipelineResponse} from '../../models/models';


const FALLBACK_PROVIDERS: AIProvider[] = [
  {
    id: 'groq', name: 'Groq (Free)',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    api_key_url: 'https://console.groq.com/keys'
  },
  {
    id: 'claude', name: 'Anthropic Claude',
    models: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6'],
    api_key_url: 'https://console.anthropic.com'
  },
  {
    id: 'openai', name: 'OpenAI',
    models: ['gpt-4o-mini', 'gpt-4o'],
    api_key_url: 'https://platform.openai.com/api-keys'
  }
];

const EXAMPLES = [
  'A study of 200 adults found that people who walk 20 minutes per day had a 12% lower chance of developing type 2 diabetes over 5 years, though researchers noted lifestyle factors weren\'t fully controlled.',
  'Researchers found that students who sleep 8 hours before an exam scored on average 7% higher than those who slept 5 hours, in a sample of 150 university students.',
  'A survey of 500 remote office workers found 34% reported feeling less productive due to home distractions, while 41% reported feeling more productive due to fewer office interruptions.'
];

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [FormsModule, DecimalPipe, AgentCardComponent, SlicePipe],
  templateUrl:'pipeline.html'
})
export class PipelineComponent {
  private svc = inject(MisinformationService);

  // ── Signals ──────────────────────────────────────────────
  appState = signal<AppState>('idle');
  result = signal<PipelineResponse | null>(null);
  errorMsg = signal('');
  providers = signal<AIProvider[]>(FALLBACK_PROVIDERS);
  visibleCards = signal<Set<number>>(new Set());

  // ── Form state (plain properties are fine for two-way binding) ──
  fact = '';
  apiKey = '';
  selectedProvider = 'groq';
  selectedModel = 'llama-3.3-70b-versatile';

  examples = EXAMPLES;
  agentNames = [
    '📰 Wire Service',
    '🔥 Tabloid Blog',
    '📱 Influencer',
    '🎙️ Podcast Host',
    '📺 TV News',
    '💬 Random Commenter',
    '🏛️ Government Official',
    '🎓 Academic'
  ];
  // ── Computed ──────────────────────────────────────────────
  currentModels = computed(() => {
    const p = this.providers().find(p => p.id === this.selectedProvider);
    return p?.models ?? [];
  });

  currentProviderUrl = computed(() => {
    const p = this.providers().find(p => p.id === this.selectedProvider);
    return p?.api_key_url ?? '#';
  });

  canAnalyze = computed(() =>
    this.appState() === 'idle' || this.appState() === 'error'
  );

  // ── Lifecycle ──────────────────────────────────────────────


  // ── Actions ──────────────────────────────────────────────

  analyze() {
    if (!this.fact.trim()) return;
    this.appState.set('loading');
    this.errorMsg.set('');
    this.result.set(null);
    this.visibleCards.set(new Set());

    this.svc.analyze({
      fact: this.fact,
      provider: this.selectedProvider,
      api_key: this.apiKey,
      model: this.selectedModel
    }).subscribe({
      next: (data) => {
        this.result.set(data);
        this.appState.set('results');
        this.revealCards(data.agents.length);
      },
      error: (err) => {
        this.appState.set('error');
        this.errorMsg.set(err.error?.detail ?? 'Something went wrong. Check your API key and try again.');
      }
    });
  }

  revealCards(count: number) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.visibleCards.update(s => new Set([...s, i]));
      }, i * 250);
    }
  }

  isVisible(index: number): boolean {
    return this.visibleCards().has(index);
  }

  reset() {
    this.appState.set('idle');
    this.result.set(null);
    this.errorMsg.set('');
    this.fact = '';
    this.visibleCards.set(new Set());
  }

  getScoreColor(score: number): string {
    if (score < 30) return '#22c55e';
    if (score < 55) return '#f5a623';
    if (score < 75) return '#ff8c00';
    return '#ff3b3b';
  }
}
