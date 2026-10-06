import { Application, Container, Graphics, Text } from 'pixi.js';
import radura from '../../content/radura.json';
import { activityById, type GameState } from '../../core/state/GameState';
import type { Clock } from '../../core/time/Clock';

export async function createSanctuary(host: HTMLDivElement, clock: Clock) {
  const app = new Application();
  try {
    await app.init({ width: 800, height: 400, background: '#a6c48a', antialias: true });
  } catch (error) {
    app.destroy(true, { children: true });
    throw error;
  }
  app.canvas.setAttribute('aria-label', 'La Radura: Momo fra Albero, Ruscello ed Erba Alta');
  app.canvas.setAttribute('role', 'img');
  host.appendChild(app.canvas);

  const background = new Graphics()
    .rect(130, 95, 45, 115).fill('#806447')
    .circle(152, 85, 70).fill('#52764b')
    .roundRect(625, 50, 65, 290, 25).fill('#75b9d0');
  app.stage.addChild(background);
  const grass = new Graphics();
  for (let x = 350; x <= 450; x += 20) {
    grass.moveTo(x, 150).lineTo(x - 9, 75).lineTo(x + 8, 95).lineTo(x + 12, 150).fill('#63854b');
  }
  app.stage.addChild(grass);
  for (const anchor of radura.anchors) {
    const marker = new Graphics().ellipse(anchor.x, anchor.y + 36, 64, 17).stroke({ color: '#46633b', width: 2 });
    const label = new Text({ text: anchor.label, style: { fontSize: 20, fill: '#263b27' } });
    label.anchor.set(0.5);
    label.position.set(anchor.x, anchor.y + 67);
    app.stage.addChild(marker, label);
  }
  const momo = new Container();
  momo.addChild(new Graphics().circle(0, 0, 30).fill('#f3e4be'));
  const eyes = new Graphics();
  momo.addChild(eyes);
  const name = new Text({ text: 'Momo', style: { fontSize: 18, fill: '#263b27' } });
  name.anchor.set(0.5);
  name.position.set(0, -48);
  momo.addChild(name);
  const symbol = new Text({ text: '', style: { fontSize: 19, fill: '#263b27' } });
  symbol.position.set(31, -31);
  momo.addChild(symbol);
  app.stage.addChild(momo);

  let displayedState: GameState | null = null;
  const drawPosition = () => {
    if (!displayedState) return;
    const current = displayedState.momo;
    const from = radura.anchors.find((entry) => entry.id === current.currentAnchor)!;
    if (current.phase === 'settled') { momo.position.set(from.x, from.y); return; }
    const to = radura.anchors.find((entry) => entry.id === activityById(current.targetActivityId).anchor)!;
    const progress = Math.max(0, Math.min(1, (clock.now() - current.phaseStartedAt) / (current.deadline - current.phaseStartedAt)));
    momo.position.set(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress);
  };
  app.ticker.add(drawPosition);

  return {
    render(state: GameState) {
      displayedState = state;
      const sleeping = state.momo.phase === 'settled' && state.momo.currentActivityId === 'doze_tree';
      eyes.clear();
      if (sleeping) eyes.moveTo(-14, -5).lineTo(-6, -5).moveTo(6, -5).lineTo(14, -5).stroke({ color: '#39352e', width: 3 });
      else eyes.circle(-10, -5, 4).circle(10, -5, 4).fill('#39352e');
      symbol.text = state.momo.phase === 'settled' ? activityById(state.momo.currentActivityId).symbol : '';
      drawPosition();
    },
    destroy() { app.destroy(true, { children: true }); },
  };
}
