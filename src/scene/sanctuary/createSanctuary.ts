import { Application, Assets, Container, Graphics, Sprite, Text, type Texture } from 'pixi.js';
import momoManifest from '../../../public/assets/creatures/momo/momo_manifest.json';
import radura from '../../content/radura.json';
import { activityById, nibiActivityById, type GameState } from '../../core/state/GameState';
import type { ActivityDefinition, BehaviorState } from '../../core/state/behavior';
import type { Clock } from '../../core/time/Clock';

export async function createSanctuary(host: HTMLDivElement, clock: Clock) {
  const app = new Application();
  try {
    await app.init({ width: 800, height: 400, background: '#a6c48a', antialias: true });
  } catch (error) {
    app.destroy(true, { children: true });
    throw error;
  }
  let momoTextures: { idle: Texture; blink: Texture } | null = null;
  try {
    const assetBase = `${import.meta.env.BASE_URL}assets/creatures/momo/`;
    const [idle, blink] = await Promise.all([
      Assets.load<Texture>(assetBase + momoManifest.files.idle),
      Assets.load<Texture>(assetBase + momoManifest.files.blink),
    ]);
    momoTextures = { idle, blink };
  } catch {
    // PNG failure must not prevent gameplay or the existing placeholder scene.
  }
  app.canvas.setAttribute('aria-label', 'La Radura: Momo fra Albero, Ruscello ed Erba Alta, con una ciotola');
  app.canvas.setAttribute('role', 'img');
  host.appendChild(app.canvas);

  const background = new Graphics()
    .rect(130, 95, 45, 115).fill('#806447')
    .circle(152, 85, 70).fill('#52764b')
    .roundRect(625, 50, 65, 290, 25).fill('#75b9d0');
  app.stage.addChild(background);
  const bowl = new Graphics().ellipse(335, 320, 29, 13).fill('#9e8066')
    .ellipse(335, 315, 29, 10).fill('#d6bd99').stroke({ color: '#6d5944', width: 2 });
  const berry = new Graphics().circle(335, 311, 8).fill('#a44157');
  const bowlLabel = new Text({ text: 'Ciotola', style: { fontSize: 18, fill: '#263b27' } });
  bowlLabel.anchor.set(0.5);
  bowlLabel.position.set(335, 350);
  app.stage.addChild(bowl, berry, bowlLabel);
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
  const placeholder = new Container();
  placeholder.addChild(new Graphics().circle(0, 0, 30).fill('#f3e4be'));
  const eyes = new Graphics();
  placeholder.addChild(eyes);
  momo.addChild(placeholder);
  const sprite = momoTextures ? new Sprite(momoTextures.idle) : null;
  const displayScale = momoManifest.recommendedDisplayHeightPx / momoManifest.canvas.height;
  if (sprite) {
    sprite.anchor.set(momoManifest.pivot.x, momoManifest.pivot.y);
    sprite.scale.set(displayScale);
    placeholder.visible = false;
    momo.addChild(sprite);
  }
  const name = new Text({ text: 'Momo', style: { fontSize: 18, fill: '#263b27' } });
  name.anchor.set(0.5);
  name.position.set(0, sprite ? -momoManifest.recommendedDisplayHeightPx * momoManifest.pivot.y - 18 : -48);
  momo.addChild(name);
  const symbol = new Text({ text: '', style: { fontSize: 19, fill: '#263b27' } });
  symbol.position.set(31, -31);
  momo.addChild(symbol);
  app.stage.addChild(momo);

  const nibi = new Container();
  nibi.addChild(new Graphics().ellipse(-12, -30, 7, 21).ellipse(12, -30, 7, 21).fill('#a77950')
    .ellipse(0, 0, 24, 27).fill('#bd9266')
    .circle(-8, -6, 3).circle(8, -6, 3).fill('#39352e')
    .moveTo(0, -28).lineTo(0, -48).stroke({ color: '#46633b', width: 3 })
    .ellipse(-7, -48, 8, 4).ellipse(7, -53, 8, 4).fill('#52764b'));
  const nibiName = new Text({ text: 'Nibi', style: { fontSize: 18, fill: '#263b27' } });
  nibiName.anchor.set(0.5);
  nibiName.position.set(0, -75);
  const nibiSymbol = new Text({ text: '', style: { fontSize: 19, fill: '#263b27' } });
  nibiSymbol.position.set(25, -30);
  nibi.addChild(nibiName, nibiSymbol);
  nibi.visible = false;
  app.stage.addChild(nibi);

  let displayedState: GameState | null = null;
  function position<Id extends string>(sprite: Container, current: BehaviorState<Id>,
    byId: (id: Id) => ActivityDefinition<Id>, offset: number) {
    const from = radura.anchors.find((entry) => entry.id === current.currentAnchor)!;
    if (current.phase === 'settled') { sprite.position.set(from.x + offset, from.y); return; }
    const to = radura.anchors.find((entry) => entry.id === byId(current.targetActivityId).anchor)!;
    const progress = Math.max(0, Math.min(1, (clock.now() - current.phaseStartedAt) / (current.deadline - current.phaseStartedAt)));
    sprite.position.set(from.x + (to.x - from.x) * progress + offset, from.y + (to.y - from.y) * progress);
  }
  let visualElapsedMs = 0;
  // Fixed cosmetic cadence uses no gameplay RNG and is never persisted.
  const blink = momoManifest.animations.blink;
  const blinkIntervalMs = (blink.intervalMs.min + blink.intervalMs.max) / 2;
  const drawAppearance = () => {
    if (!displayedState || !sprite || !momoTextures) return;
    const sleeping = displayedState.momo.phase === 'settled' && displayedState.momo.currentActivityId === 'doze_tree';
    const blinking = visualElapsedMs % blinkIntervalMs >= blinkIntervalMs - blink.closedDurationMs;
    sprite.texture = sleeping || blinking ? momoTextures.blink : momoTextures.idle;
    const breathe = momoManifest.animations.idle_breathe;
    const amount = (1 - Math.cos(2 * Math.PI * visualElapsedMs / breathe.durationMs)) / 2;
    sprite.scale.set(
      displayScale * (1 + (breathe.scaleX[1] - 1) * amount),
      displayScale * (1 + (breathe.scaleY[1] - 1) * amount),
    );
    // Scale around the manifest pivot; leave position fixed at the scene anchor.
  };
  const drawPosition = () => {
    if (!displayedState) return;
    const resident = displayedState.nibiPhase === 'resident' && displayedState.nibi;
    // Fixed visual lanes avoid overlap at a shared anchor; persisted anchors stay unchanged.
    position(momo, displayedState.momo, activityById, resident ? -35 : 0);
    if (resident) position(nibi, resident, nibiActivityById, 35);
  };
  app.ticker.add((ticker) => {
    visualElapsedMs += ticker.deltaMS;
    drawPosition();
    drawAppearance();
  });

  return {
    render(state: GameState) {
      displayedState = state;
      berry.visible = state.bowl === 'berry';
      nibi.visible = state.nibiPhase === 'resident' && state.nibi !== null;
      nibiSymbol.text = state.nibi?.phase === 'settled' ? nibiActivityById(state.nibi.currentActivityId).symbol : '';
      app.canvas.setAttribute('aria-label', `La Radura: Momo${nibi.visible ? ' e Nibi' : ''} fra Albero, Ruscello ed Erba Alta, con una ciotola`);
      const sleeping = state.momo.phase === 'settled' && state.momo.currentActivityId === 'doze_tree';
      eyes.clear();
      if (sleeping) eyes.moveTo(-14, -5).lineTo(-6, -5).moveTo(6, -5).lineTo(14, -5).stroke({ color: '#39352e', width: 3 });
      else eyes.circle(-10, -5, 4).circle(10, -5, 4).fill('#39352e');
      symbol.text = state.momo.phase === 'settled' ? activityById(state.momo.currentActivityId).symbol : '';
      drawPosition();
      drawAppearance();
    },
    destroy() { app.destroy(true, { children: true }); },
  };
}
