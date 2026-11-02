import * as THREE from "three";
export function makeBrush() {
  const root = new THREE.Group();
  const grain = document.createElement("canvas"); grain.width = 64; grain.height = 512;
  const ctx = grain.getContext("2d")!; ctx.fillStyle = "#ead69f"; ctx.fillRect(0, 0, 64, 512);
  for (let i = 0; i < 65; i++) { const x = i * 19 % 64; ctx.strokeStyle = i % 3 ? "#a0844b30" : "#fff4d960"; ctx.lineWidth = i % 5 ? .5 : 1; ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x - 6, 170, x + 5, 330, x, 512); ctx.stroke(); }
  const texture = new THREE.CanvasTexture(grain); texture.colorSpace = THREE.SRGBColorSpace;
  const wood = new THREE.MeshStandardMaterial({ map: texture, roughness: .55 });
  const brass = new THREE.MeshStandardMaterial({ color: "#a8b1b5", metalness: .75, roughness: .32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .92, vertexColors: true });
  const profile = [[0, 1.75], [.022, 1.70], [.057, 1.4], [.083, .85], [.093, -.55], [.085, -.64], [0, -.65]].map(([r, y]) => new THREE.Vector2(r, y));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(profile.reverse(), 24), wood));
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(.095, .14, .58, 20), brass); ferrule.position.y = -.89; ferrule.scale.x = 1.28; root.add(ferrule);
  for (const y of [-.64, -1.12, -1.16]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(y < -1 ? .139 : .097, .008, 5, 20), brass); ring.rotation.x = Math.PI / 2; ring.scale.x = 1.28; ring.position.y = y; root.add(ring); }
  const geometry = new THREE.LatheGeometry([[0,-2.13],[.035,-2.05],[.11,-1.91],[.19,-1.72],[.24,-1.51],[.22,-1.34],[.15,-1.16],[.13,-1.13],[0,-1.13]].map(([r,y])=>new THREE.Vector2(r,y)),24);
  const base = geometry.getAttribute("position"); const bent = base.clone(); const colours: number[] = [];
  const color = new THREE.Color();
  for (let i = 0; i < base.count; i++) {
    const t = THREE.MathUtils.clamp((-base.getY(i) - 1.15) / .84, 0, 1);
    bent.setX(i, base.getX(i) + t * t * .16); bent.setY(i, base.getY(i) + t * t * .07);
    color.set(t > .78 ? "#131b2b" : i % 3 ? "#171e2c" : "#343b48"); colours.push(color.r, color.g, color.b);
  }
  geometry.scale(1.1, 1, .95); bent.array.forEach((_, index) => { if (index % 3 === 0) bent.array[index] *= 1.1; else if (index % 3 === 2) bent.array[index] *= .95; });
  geometry.morphAttributes.position = [bent]; geometry.setAttribute("color", new THREE.Float32BufferAttribute(colours, 3));
  const tuft = new THREE.Mesh(geometry, dark); root.add(tuft);
  const fibers = new THREE.InstancedMesh(new THREE.ConeGeometry(.009, .79, 4), new THREE.MeshStandardMaterial({ color: "#333c4a", roughness: 1 }), 36);
  for (let i = 0; i < 36; i++) {
    const radius = Math.sqrt(i / 36) * .13, angle = i * 2.39996;
    const dummy = new THREE.Object3D(); dummy.position.set(Math.cos(angle) * radius * 1.28, -1.58 - (i % 4) * .012, Math.sin(angle) * radius * .72); dummy.rotation.z = Math.PI + Math.cos(angle) * .035; dummy.scale.y = .92 + (i % 5) * .025; dummy.updateMatrix(); fibers.setMatrixAt(i, dummy.matrix);
  }
  root.add(fibers);
  return { root, tuft, texture };
}
