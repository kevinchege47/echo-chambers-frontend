import { AfterViewInit, Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-why-page',
  imports: [RouterModule],
  templateUrl: './why-page.html',
  styleUrl: './why-page.css',
})
export class WhyPage implements AfterViewInit, OnDestroy {
  @ViewChild('meterEl') meterEl!: ElementRef;
  @ViewChild('flowEl') flowEl!: ElementRef;

  // Meter
  displayScore = signal(0);
  barWidth = signal('0%');
  private readonly target = 84;
  private animFrame = 0;
  private meterObserver!: IntersectionObserver;
  private meterAnimated = false;

  // Enhanced Flow
  flowSteps = [
    { emoji: '📝', label: 'Original Fact', description: 'Raw information with full context', highlight: false },
    { emoji: '🧠', label: 'Super Agent', description: 'Analyzes and chooses propagation path', highlight: true },
    { emoji: '🔀', label: 'Agent Selection', description: 'Decides which actors will reshape the story', highlight: false },
    { emoji: '✍️', label: 'Rewrites', description: 'Multiple actors modify tone, emotion & framing', highlight: false },
    { emoji: '📊', label: 'Distortion Score', description: 'Cumulative changes are measured', highlight: false },
    { emoji: '🌫️', label: 'Final Narrative', description: 'Heavily mutated version reaches audience', highlight: true },
  ];

  flowVisible = signal<boolean[]>(this.flowSteps.map(() => false));
  progressWidth = signal(0);           // New: Progress line

  private flowObserver!: IntersectionObserver;
  private flowAnimated = false;

  ngAfterViewInit() {
    // Meter animation
    this.meterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.meterAnimated) {
        this.meterAnimated = true;
        this.animateMeter();
      }
    }, { threshold: 0.4 });
    this.meterObserver.observe(this.meterEl.nativeElement);

    // Flow animation
    this.flowObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.flowAnimated) {
        this.flowAnimated = true;
        this.animateFlow();
      }
    }, { threshold: 0.35 });
    this.flowObserver.observe(this.flowEl.nativeElement);
  }

  private animateMeter() {
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * this.target);

      this.displayScore.set(current);
      this.barWidth.set(current + '%');

      if (progress < 1) {
        this.animFrame = requestAnimationFrame(tick);
      }
    };

    this.animFrame = requestAnimationFrame(tick);
  }

  private animateFlow() {
    const steps = this.flowSteps.length;
    this.flowVisible.set(new Array(steps).fill(false));
    this.progressWidth.set(0);

    this.flowSteps.forEach((_, i) => {
      setTimeout(() => {
        // Reveal step
        this.flowVisible.update(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });

        // Update progress line
        this.progressWidth.set(((i + 1) / (steps - 1)) * 100);
      }, i * 380); // Slightly slower for better visual pacing
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrame);
    this.meterObserver?.disconnect();
    this.flowObserver?.disconnect();
  }
}
