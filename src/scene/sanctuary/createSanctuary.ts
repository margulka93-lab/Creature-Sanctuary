import { Application, Container, Graphics, Text } from 'pixi.js';
import radura from '../../content/radura.json';
import type { GameState } from '../../core/state/GameState';

export async function createSanctuary(host: HTMLDivElement) {
  const app = new Application();
  try {
    await app.init({ width: 800, height: 400, background: '#a6c48a', antialias: true });
  } catch (error) {
    app.destroy(true, { children: true });
    throw error;
  }
  app.canvas.setAttribute('aria-label', 'La Radura: Momo fra Albero e Ruscello');
  app.canvas.setAttribute('role', 'img');
  host.appendChild(app.canvas);

  const background = new Graphics()
    .rect(130, 95, 45, 115).fill('#806447')
    .circle(152, 85, 70).fill('#52764b')
    .roundRect(625, 50, 65, 290, 25).fill('#75b9d0');
  app.stage.addChild(background);
  for (const anchor of radura.anchors) {
    const marker = new Graphics().ellipse(anchor.x, anchor.y + 36, 64, 17).stroke({ color: '#46633b', width: 2 });
    const label = new Text({ text: anchor.label, style: { fontSize: 20, fill: '#263b27' } });
    label.anchor.set(0.5);
    label.position.set(anchor.x, anchor.y + 67);
    app.stage.addChild(marker, label);
  }
  const momo = new Container();
  momo.addChild(new Graphics().circle(0, 0, 30).fill('#f3e4be')
    .circle(-10, -5, 4).fill('#39352e').circle(10, -5, 4).fill('#39352e'));
  const name = new Text({ text: 'Momo', style: { fontSize: 18, fill: '#263b27' } });
  name.anchor.set(0.5);
  name.position.set(0, -48);
  momo.addChild(name);
  app.stage.addChild(momo);

  return {
    render(state: GameState) {
      const anchor = radura.anchors.find((entry) => entry.id === state.momo.currentAnchor)!;
      momo.position.set(anchor.x, anchor.y);
    },
    destroy() { app.destroy(true, { children: true }); },
  };
}
