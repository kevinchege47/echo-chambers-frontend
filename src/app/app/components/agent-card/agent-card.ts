import { Component, input, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {AgentResult} from '../../models/models';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl:'agent-card.html'
})
export class AgentCardComponent {
  agent = input.required<AgentResult>();
  visible = input<boolean>(false);

  scoreColor = computed(() => {
    const s = this.agent().distortion_score;
    if (s < 30) return '#22c55e';
    if (s < 55) return '#f5a623';
    if (s < 75) return '#ff8c00';
    return '#ff3b3b';
  });

  cleanText = computed(() =>
    this.agent().rewritten_text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
  );

  scoreLabel = computed(() => {
    const s = this.agent().distortion_score;
    if (s < 30) return 'Low';
    if (s < 55) return 'Mid';
    if (s < 75) return 'High';
    return 'Severe';
  });
}
