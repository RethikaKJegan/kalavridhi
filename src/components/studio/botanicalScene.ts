import * as THREE from "three";

type Petal = { mesh: THREE.Mesh; ring: number; offset: number };
const ease = (value: number) => { const t = THREE.MathUtils.clamp(value, 0, 1); return t * t * (3 - 2 * t); };

function paintedTexture(leaf = false) {
  const canvas = document.createElement("canvas"); canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  if (leaf) { gradient.addColorStop(0, "#728b52"); gradient.addColorStop(.5, "#507455"); gradient.addColorStop(1, "#254f42"); }
  else { gradient.addColorStop(0, "#b92264"); gradient.addColorStop(.17, "#e85b91"); gradient.addColorStop(.55, "#f7b8cd"); gradient.addColorStop(1, "#fff0d8"); }
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = i % 3 ? "#fff7df10" : "#772c4910";
    ctx.fillRect((i * 73) % 256, (i * 137) % 512, 1 + i % 3, 2 + i % 4);
  }
  for (let i = 0; i < 30; i++) {
    const x = 8 + i * 8;
    ctx.strokeStyle = leaf ? "#e4d99155" : i % 3 ? "#a92a6338" : "#fff5e870";
    ctx.lineWidth = i % 3 ? .6 : 1;
    ctx.beginPath(); ctx.moveTo(128 + (x - 128) * .12, 512);
    ctx.bezierCurveTo(128 + (x - 128) * .5, 350, x - 8, 170, x, 0); ctx.stroke();
  }
  if (leaf) {
    ctx.strokeStyle = "#e4dc9b99"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(128, 512); ctx.lineTo(128, 0); ctx.stroke();
    for (let i = 0; i < 9; i++) { const y = 45 + i * 47; ctx.beginPath(); ctx.moveTo(128, y + 65); ctx.lineTo(18, y); ctx.moveTo(128, y + 65); ctx.lineTo(238, y); ctx.stroke(); }
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function petalGeometry(length: number, width: number, leaf = false, ring = 0) {
  const positions: number[] = [], opened: number[] = [], uv: number[] = [], indices: number[] = [];
  const rows = 14, columns = 8;
  for (let row = 0; row <= rows; row++) {
    const t = row / rows, envelope = Math.pow(Math.sin(Math.PI * t), .8);
    for (let column = 0; column <= columns; column++) {
      const u = column / columns * 2 - 1;
      const spread = u * width * envelope;
      if (leaf) {
        positions.push(spread, t * length, 0);
        opened.push(spread, t * length * .87 + u * u * .08, Math.sin(t * Math.PI) * .45 + t * t * .2 - u * u * .1);
      } else {
        positions.push(spread * .7, t * length, .22 * Math.sin(t * Math.PI));
        const rise = [.35, .6, .92][ring], radial = [.94, .72, .43][ring];
        opened.push(spread, length * (rise * t + .12 * Math.sin(t * Math.PI) + .15 * t * t * t) + u * u * .10 * envelope, length * radial * t + u * u * .12 * envelope);
      }
      uv.push(column / columns, t);
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column, b = a + columns + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
  const target = geometry.clone(); target.setAttribute("position", new THREE.Float32BufferAttribute(opened, 3)); target.computeVertexNormals();
  geometry.morphAttributes.position = [target.getAttribute("position").clone()];
  geometry.morphAttributes.normal = [target.getAttribute("normal").clone()]; target.dispose();
  return geometry;
}

function makeLotus() {
  const root = new THREE.Group(), head = new THREE.Group();
  const texture = paintedTexture();
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: .86, metalness: 0, side: THREE.DoubleSide });
  const stemMaterial = new THREE.MeshStandardMaterial({ color: "#567454", roughness: 1 });
  const stemCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-.09, .55, 0), new THREE.Vector3(.04, 1.05, .03), new THREE.Vector3(0, 1.45, 0)]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 20, .023, 7, false), stemMaterial));
  head.position.y = 1.45; head.rotation.x = .85; root.add(head);
  const petals: Petal[] = [];
  const rings = [{ count: 9, length: 1.6, width: .48 }, { count: 8, length: 1.28, width: .40 }, { count: 6, length: .98, width: .32 }];
  rings.forEach((ring, ringIndex) => {
    const geometry = petalGeometry(ring.length, ring.width, false, ringIndex);
    for (let i = 0; i < ring.count; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      const angle = i / ring.count * Math.PI * 2 + ringIndex * .39;
      mesh.rotation.y = angle;
      mesh.position.set(Math.sin(angle) * .07, ringIndex * .075, Math.cos(angle) * .07);
      head.add(mesh); petals.push({ mesh, ring: ringIndex, offset: (i % 3) * .055 });
    }
  });
  const center = new THREE.Group(); center.position.y = .45; head.add(center);
  const gold = new THREE.MeshStandardMaterial({ color: "#e4b84e", roughness: .85 });
  const disk = new THREE.Mesh(new THREE.SphereGeometry(.27, 16, 10), gold); disk.scale.set(1, .42, 1); disk.position.y = .19; center.add(disk);
  const stamens = new THREE.InstancedMesh(new THREE.SphereGeometry(.035, 5, 4), gold, 30);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 30; i++) { const angle = i * 2.39996, radius = .10 + Math.sqrt(i / 30) * .24; dummy.position.set(Math.cos(angle) * radius, .23 + (i % 3) * .025, Math.sin(angle) * radius); dummy.updateMatrix(); stamens.setMatrixAt(i, dummy.matrix); }
  center.add(stamens);
  return { root, head, petals, center, texture };
}

function makeBrush() {
  const root = new THREE.Group();
  const grain = document.createElement("canvas"); grain.width = 64; grain.height = 512;
  const ctx = grain.getContext("2d")!; ctx.fillStyle = "#713c35"; ctx.fillRect(0, 0, 64, 512);
  for (let i = 0; i < 65; i++) { const x = i * 19 % 64; ctx.strokeStyle = i % 3 ? "#321f2840" : "#ca997e45"; ctx.lineWidth = i % 5 ? .5 : 1; ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x - 6, 170, x + 5, 330, x, 512); ctx.stroke(); }
  const texture = new THREE.CanvasTexture(grain); texture.colorSpace = THREE.SRGBColorSpace;
  const wood = new THREE.MeshPhysicalMaterial({ map: texture, roughness: .38, clearcoat: .65, clearcoatRoughness: .3 });
  const brass = new THREE.MeshStandardMaterial({ color: "#b79553", metalness: .75, roughness: .32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .92, vertexColors: true });
  const profile = [[0, 1.75], [.022, 1.70], [.057, 1.4], [.083, .85], [.093, -.55], [.085, -.64], [0, -.65]].map(([r, y]) => new THREE.Vector2(r, y));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(profile.reverse(), 24), wood));
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(.095, .14, .58, 20), brass); ferrule.position.y = -.89; ferrule.scale.x = 1.28; root.add(ferrule);
  for (const y of [-.64, -1.12, -1.16]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(y < -1 ? .139 : .097, .008, 5, 20), brass); ring.rotation.x = Math.PI / 2; ring.scale.x = 1.28; ring.position.y = y; root.add(ring); }
  const geometry = new THREE.ConeGeometry(.15, .84, 22, 9); geometry.rotateZ(Math.PI); geometry.translate(0, -1.57, 0);
  const base = geometry.getAttribute("position"); const bent = base.clone(); const colours: number[] = [];
  const color = new THREE.Color();
  for (let i = 0; i < base.count; i++) {
    const t = THREE.MathUtils.clamp((-base.getY(i) - 1.15) / .84, 0, 1);
    bent.setX(i, base.getX(i) + t * t * .16); bent.setY(i, base.getY(i) + t * t * .07);
    color.set(t > .78 ? "#bd5180" : i % 3 ? "#8a6949" : "#b6926a"); colours.push(color.r, color.g, color.b);
  }
  geometry.scale(1.28, 1, .72); bent.array.forEach((_, index) => { if (index % 3 === 0) bent.array[index] *= 1.28; else if (index % 3 === 2) bent.array[index] *= .72; });
  geometry.morphAttributes.position = [bent]; geometry.setAttribute("color", new THREE.Float32BufferAttribute(colours, 3));
  const tuft = new THREE.Mesh(geometry, dark); root.add(tuft);
  const fibers = new THREE.InstancedMesh(new THREE.ConeGeometry(.009, .79, 4), new THREE.MeshStandardMaterial({ color: "#aa855f", roughness: 1 }), 36);
  for (let i = 0; i < 36; i++) {
    const radius = Math.sqrt(i / 36) * .13, angle = i * 2.39996;
    const dummy = new THREE.Object3D(); dummy.position.set(Math.cos(angle) * radius * 1.28, -1.58 - (i % 4) * .012, Math.sin(angle) * radius * .72); dummy.rotation.z = Math.PI + Math.cos(angle) * .035; dummy.scale.y = .92 + (i % 5) * .025; dummy.updateMatrix(); fibers.setMatrixAt(i, dummy.matrix);
  }
  root.add(fibers);
  return { root, tuft, texture };
}

export function mountBotanicalScene(host: HTMLDivElement, variant: "hero" | "footer", ready: (value: boolean) => void) {
  const initializedAt = performance.now();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); } catch { return { dispose() {}, replay() {} }; }
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true"); host.prepend(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(0, 1, 1, 0, .1, 2000); camera.position.z = 1000;
  scene.add(new THREE.HemisphereLight(0xfff8ef, 0xffdce4, 1.65));
  const light = new THREE.DirectionalLight(0xfff2db, 1.85); light.position.set(-150, 400, 600); scene.add(light);
  const fill = new THREE.DirectionalLight(0xffdce7, 1.2); fill.position.set(250, -180, 600); scene.add(fill);
  const lotus = makeLotus(); scene.add(lotus.root);
  const brush = variant === "hero" ? makeBrush() : null; if (brush) scene.add(brush.root);
  const leafTexture = paintedTexture(true), leafMaterial = new THREE.MeshStandardMaterial({ map: leafTexture, side: THREE.DoubleSide, roughness: 1, transparent: true });
  const branch = new THREE.Group(); scene.add(branch);
  const branchCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-.13, .6, 0), new THREE.Vector3(.03, 1.25, .03), new THREE.Vector3(.2, 1.9, .05)]);
  const stemGeometry = new THREE.TubeGeometry(branchCurve, 40, .016, 5, false);
  const stem = new THREE.Mesh(stemGeometry, new THREE.MeshBasicMaterial({ color: "#8b8b60", transparent: true })); branch.add(stem);
  const leaves: THREE.Mesh[] = [];
  const outlines: THREE.Line[] = [];
  const outlineMaterial = new THREE.LineBasicMaterial({ color: "#8b785a", transparent: true, opacity: .6 });
  for (let i = 0; i < 3; i++) { const mesh = new THREE.Mesh(petalGeometry(.83, .24, true), leafMaterial); mesh.position.set(i % 2 ? -.06 : .04, .55 + i * .45, 0); mesh.rotation.z = i % 2 ? .8 : -.7; branch.add(mesh); leaves.push(mesh); }
  for (const leaf of leaves) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) { const t = i <= 20 ? i / 20 : (40 - i) / 20; points.push(new THREE.Vector3((i <= 20 ? -1 : 1) * .24 * Math.pow(Math.sin(Math.PI * t), .8), t * .83, -.02)); }
    const outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), outlineMaterial); outline.position.copy(leaf.position); outline.rotation.z = leaf.rotation.z; branch.add(outline); outlines.push(outline);
  }
  const shadowMaterial = new THREE.MeshBasicMaterial({ color: "#5e4631", transparent: true, opacity: 0, depthWrite: false });
  const leafShadow = new THREE.Mesh(petalGeometry(.83, .24, true), shadowMaterial); leafShadow.position.copy(leaves[2].position); leafShadow.position.z = -.1; leafShadow.rotation.z = leaves[2].rotation.z; branch.add(leafShadow);
  branch.visible = variant === "hero";
  let width = 0, height = 0, imageScale = 1, imageX = 0, imageY = 0, hostLeft = 0, nextRender = 0, compact = false;
  const brushPoint = new THREE.Vector3();
  let elapsed = variant === "footer" ? 8 : 0, frame = 0, last = 0, visible = false, disposed = false, lost = false, warmed = false;
  let frameCount = 0, sampleStart = 0, largestRender = 0, bloomPhase = "";
  const map = (x: number, y: number) => new THREE.Vector3(imageX + x * imageScale, height - (imageY + y * imageScale), 0);
  const layout = () => {
    width = host.clientWidth; height = host.clientHeight;
    hostLeft = host.getBoundingClientRect().left;
    if (!width || !height) return;
    const mobile = matchMedia("(max-width:767px)").matches;
    compact = mobile;
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1 : 1.25)); renderer.setSize(width, height);
    camera.right = width; camera.top = height; camera.updateProjectionMatrix();
    imageScale = (mobile ? Math.min : Math.max)(width / 1484, height / 1060);
    imageX = (width - 1484 * imageScale) / 2; imageY = height - 1060 * imageScale;
    if (variant === "hero") {
      lotus.root.position.copy(map(510, 1030)); lotus.root.scale.setScalar(imageScale * 108);
      branch.position.copy(map(235, 960)); branch.scale.setScalar(imageScale * 125);
      if (brush) { brush.root.visible = !mobile && matchMedia("(pointer:fine)").matches; brush.root.scale.setScalar(Math.min(90, imageScale * 110)); }
    } else { lotus.root.position.set(width * .5, height * .08, 0); lotus.root.scale.setScalar(Math.min(width / 3.8, height / 3.2)); }
    render(0, false);
  };
  const render = (now: number, advance = true) => {
    if (disposed || lost || !width || !warmed) return;
    const mobile = compact;
    if (advance && !reduced.matches) elapsed += Math.min((now - last) / 1000 || 0, .06);
    last = now;
    const t = reduced.matches ? 8 : elapsed;
    const opening = ease((t - .65) / 3.6);
    for (const petal of lotus.petals) petal.mesh.morphTargetInfluences![0] = variant === "footer" ? 1 : ease((t - .65 - petal.ring * .24 - petal.offset) / 3.15);
    lotus.center.scale.setScalar(variant === "footer" ? 1 : ease((opening - .45) / .5));
    const sway = reduced.matches ? 0 : ease((t - 4.3) / 1.3);
    lotus.root.rotation.z = Math.sin(t * .68) * .026 * sway;
    lotus.head.rotation.z = Math.sin(t * .68 - .45) * .012 * sway;
    lotus.head.rotation.x = .85 + Math.sin(t * .6 - .2) * .012 * sway;
    const leafFill = ease((t - 1.3) / 1.1), lift = reduced.matches ? 1 : ease((t - 4.7) / 1.7);
    leafMaterial.opacity = leafFill;
    stemGeometry.setDrawRange(0, Math.ceil(ease((t - .7) / 1.1) * stemGeometry.index!.count / 3) * 3);
    for (let i = 0; i < outlines.length; i++) outlines[i].geometry.setDrawRange(0, Math.floor(ease((t - .85 - i * .12) / .9) * 41));
    for (let i = 0; i < leaves.length; i++) { const amount = i === 2 ? lift : 0; leaves[i].morphTargetInfluences![0] = amount; leaves[i].rotation.y = amount * (.5 + Math.sin(t * .7) * .06); }
    shadowMaterial.opacity = lift * .1; leafShadow.position.x = leaves[2].position.x + lift * .1;
    branch.rotation.z = reduced.matches ? 0 : Math.sin(t * .6 - .4) * .018 * lift;
    if (brush?.root.visible) {
      const scale = brush.root.scale.x;
      const restX = Math.min(width * .71, innerWidth - hostLeft - 125);
      const restY = height * .72;
      let x = restX, y = restY, angle = -.53;
      if (t >= .35 && t < 2.7 && !reduced.matches) {
        const draw = ease((t - .75) / 1.1), point = branchCurve.getPointAt(draw, brushPoint);
        const targetX = branch.position.x + point.x * branch.scale.x - Math.sin(-.53) * 1.98 * scale;
        const targetY = branch.position.y + point.y * branch.scale.x + Math.cos(-.53) * 1.98 * scale;
        const enter = t < .75 ? ease((t - .35) / .4) : t > 1.85 ? 1 - ease((t - 1.85) / .85) : 1;
        x = THREE.MathUtils.lerp(restX, targetX, enter); y = THREE.MathUtils.lerp(restY, targetY, enter) + Math.sin(enter * Math.PI) * Math.min(150, height * .2);
        brush.tuft.morphTargetInfluences![0] = enter * Math.sin(draw * Math.PI) * .8;
      } else brush.tuft.morphTargetInfluences![0] = 0;
      brush.root.position.set(x, y, 100); brush.root.rotation.set(.1, -.18, angle);
    }
    const phase = t < 1 ? "bud" : t < 4.6 ? "opening" : t < 6.4 ? "leaf-lifting" : "bloomed-sway";
    if (phase !== bloomPhase) { host.dataset.bloom = phase; bloomPhase = phase; }
    const start = performance.now(); renderer.render(scene, camera); largestRender = Math.max(largestRender, performance.now() - start);
    frameCount++;
    if (now - sampleStart > 1500) { host.dataset.sceneStats = JSON.stringify({ fps: Math.round(frameCount * 1000 / (now - sampleStart)), maxSubmitMs: Math.round(largestRender * 10) / 10, calls: renderer.info.render.calls, pixels: renderer.domElement.width * renderer.domElement.height }); frameCount = 0; sampleStart = now; largestRender = 0; }
    if (variant === "footer" && mobile) lotus.root.rotation.z = 0;
  };
  const tick = (now: number) => {
    frame = 0;
    if (!visible || document.hidden || disposed || lost || reduced.matches) return;
    const interval = 1000 / (compact ? 24 : 30);
    if (now >= nextRender) { render(now); nextRender = now + interval - (now - nextRender) % interval; }
    frame = requestAnimationFrame(tick);
  };
  const content = document.getElementById("kv-content");
  const resume = () => {
    if (frame) cancelAnimationFrame(frame); frame = 0; last = performance.now(); nextRender = last; sampleStart = last; frameCount = 0;
    const allowed = warmed && visible && !document.hidden && !lost && !content?.hasAttribute("inert");
    const staticFrame = reduced.matches || (variant === "footer" && compact);
    host.dataset.renderState = allowed ? staticFrame ? "static" : "running" : "paused";
    if (allowed) { if (staticFrame) render(last, false); else frame = requestAnimationFrame(tick); }
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= (variant === "hero" ? .3 : .1); resume(); }, { threshold: variant === "hero" ? .3 : .1 }); observer.observe(host);
  const resize = new ResizeObserver(() => { layout(); resume(); }); resize.observe(host);
  const modalObserver = new MutationObserver(resume); if (content) modalObserver.observe(content, { attributes: true, attributeFilter: ["inert"] });
  const loss = (event: Event) => { event.preventDefault(); lost = true; ready(false); resume(); };
  const restore = () => { lost = false; ready(true); resume(); };
  renderer.domElement.addEventListener("webglcontextlost", loss); renderer.domElement.addEventListener("webglcontextrestored", restore);
  document.addEventListener("visibilitychange", resume); reduced.addEventListener("change", resume);
  layout(); host.dataset.buildMs = `${Math.round(performance.now() - initializedAt)}`;
  void renderer.compileAsync(scene, camera).then(() => {
    if (disposed) return;
    warmed = true; layout(); host.dataset.initMs = `${Math.round(performance.now() - initializedAt)}`; ready(true); resume();
  }).catch(() => { if (!disposed) ready(false); });
  return {
    replay() { if (variant === "hero" && !reduced.matches) { elapsed = 0; host.dataset.bloom = "bud"; resume(); } },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); modalObserver.disconnect(); document.removeEventListener("visibilitychange", resume); reduced.removeEventListener("change", resume);
      renderer.domElement.removeEventListener("webglcontextlost", loss); renderer.domElement.removeEventListener("webglcontextrestored", restore);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
      scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Line) { geometries.add(object.geometry); const list = Array.isArray(object.material) ? object.material : [object.material]; list.forEach(material => materials.add(material)); } });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); lotus.texture.dispose(); leafTexture.dispose(); brush?.texture.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
