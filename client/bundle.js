/* dsh-plugin-effort-slider — Client half (web bundle).
 * 仿 Claude Code 思考强度滑块：shadow 模型座位，弹出火焰滑块 + 模型列表，
 * 真实提交 reasoningEffort（off/high/max），明暗主题自适应。
 * 打包协议：window.__ModuleLoader__.load 注册一个 factory，接收 CommonJS require。
 */
window.__ModuleLoader__.load({
  id: "dsh-plugin-effort-slider",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var React = require("react")

    const CSS_STRING = `
.dsh-eff-root{position:relative;min-width:0;outline:none}
.dsh-eff-trigger{display:flex;align-items:center;gap:4px;height:28px;max-width:220px;min-width:0;padding:0 4px 0 8px;border:none;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:20px;cursor:pointer;font-family:inherit}
.dsh-eff-trigger:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}
.dsh-eff-trigger:disabled{opacity:.6;cursor:default}
.dsh-eff-triggerLabel{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.dsh-eff-triggerEffort{color:var(--dsw-alias-label-secondary);flex:none;opacity:.85}
.dsh-eff-chevron{color:var(--dsw-alias-label-secondary);flex:none;transition:transform .12s;display:inline-flex;line-height:1}
.dsh-eff-chevronOpen{transform:rotate(180deg)}
.dsh-eff-menu{position:absolute;bottom:calc(100% + 8px);right:0;z-index:30;width:min(280px,100vw - 32px);max-height:min(460px,100vh - 96px);overflow:auto;display:flex;flex-direction:column;gap:2px;padding:6px;border:1px solid var(--dsw-alias-border-inverted);border-radius:14px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3, 0 8px 30px rgba(0,0,0,.25));color:var(--dsw-alias-label-primary)}
.dsh-eff-slider{display:flex;flex-direction:column;gap:7px;padding:6px 4px 10px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dsh-eff-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.dsh-eff-label{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dsh-eff-status{display:inline-block;font-size:12px;color:var(--dsw-alias-label-secondary);transform-origin:center bottom;transition:color .3s,text-shadow .3s}
.dsh-eff-status-glow{color:var(--dsw-alias-state-business-primary);text-shadow:0 0 12px rgba(77,107,254,.55);font-weight:600}
.dsh-eff-animate-up{animation:dsh-flipUp .42s cubic-bezier(.33,1,.68,1) forwards}
@keyframes dsh-flipUp{0%{opacity:0;transform:translateY(14px) rotateX(-80deg);filter:blur(4px)}100%{opacity:1;transform:translateY(0) rotateX(0);filter:blur(0)}}
.dsh-eff-scale{display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--dsw-alias-label-secondary)}
.dsh-eff-track{position:relative;height:30px;border-radius:10px;overflow:hidden;border:1px solid var(--dsw-alias-border-l2);background:#f4f8fe;isolation:isolate}
body[data-ds-dark-theme] .dsh-eff-track{background:var(--dsw-alias-bg-layer-2)}
.dsh-eff-trackbg{position:absolute;inset:0;background:#f4f8fe;z-index:0}
body[data-ds-dark-theme] .dsh-eff-trackbg{background:var(--dsw-alias-bg-layer-2)}
.dsh-eff-dots{position:absolute;inset:0;pointer-events:none;z-index:1}
.dsh-eff-dot{position:absolute;width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-border-l2);top:50%;transform:translate(-50%,-50%);transition:background .3s}
.dsh-eff-dot-cur{background:var(--dsw-alias-state-business-primary);box-shadow:0 0 6px 0 var(--dsw-alias-state-business-primary)}
.dsh-eff-fire{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;transition:opacity .3s;z-index:2}
.dsh-eff-range{position:absolute;inset:0;width:100%;height:100%;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;z-index:5;outline:none;margin:0;padding:0}
input.dsh-eff-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:26px;height:26px;border-radius:10px;background:#ffffff;border:1px solid var(--dsw-alias-border-l2);box-shadow:0 1px 2px rgba(0,0,0,.15),inset 0 -1px 0 rgba(0,0,0,.04);cursor:grab;transition:box-shadow .4s ease,transform .15s ease}
input.dsh-eff-range::-webkit-slider-thumb:active{cursor:grabbing;transform:scale(.95)}
input.dsh-eff-range.dsh-eff-glowing::-webkit-slider-thumb{box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary),0 0 22px rgba(77,107,254,.5),inset 0 -1px 0 rgba(0,0,0,.04)}
input.dsh-eff-range::-moz-range-thumb{width:24px;height:24px;border-radius:9px;background:#ffffff;border:1px solid var(--dsw-alias-border-l2);box-shadow:0 1px 2px rgba(0,0,0,.15);cursor:grab}
input.dsh-eff-range.dsh-eff-glowing::-moz-range-thumb{box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary),0 0 22px rgba(77,107,254,.5)}
input.dsh-eff-range::-moz-range-track{background:transparent;border:none;height:30px}
.dsh-eff-cell{display:flex;align-items:center;gap:6px;padding:8px 10px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-primary);font-size:13px;cursor:pointer;text-align:left;font-family:inherit}
.dsh-eff-cell:hover{background:var(--dsw-alias-bg-layer-2)}
.dsh-eff-cellVal{margin-left:auto;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-eff-hint{padding:10px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsh-eff-group{padding:6px 10px 2px;font-size:11px;font-weight:700;color:var(--dsw-alias-label-secondary);letter-spacing:.04em}
.dsh-eff-opt{display:flex;flex-direction:column;gap:1px;width:100%;padding:7px 10px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-primary);font-size:13px;cursor:pointer;text-align:left;font-family:inherit}
.dsh-eff-opt:hover{background:var(--dsw-alias-bg-layer-2)}
.dsh-eff-opt-sel{background:var(--dsw-alias-bg-layer-2);box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary)}
.dsh-eff-optName{font-weight:600}
.dsh-eff-optDesc{font-size:11px;color:var(--dsw-alias-label-secondary)}
`

    const VERT = `#version 300 es
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){ v_uv=a_pos*0.5+0.5; gl_Position=vec4(a_pos,0.0,1.0); }
`
    const FRAG_SIM = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 fc;
uniform float u_time, u_slider, u_elapsed;
uniform sampler2D u_back;
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
void main(){
  vec2 uv=v_uv;
  vec2 g=uv*vec2(72.0,6.0);
  vec2 id=floor(g);
  vec2 cf=fract(g);
  float h=hash(id);
  vec2 ap=abs(cf-0.5);
  float cell=smoothstep(0.34,0.22,max(ap.x*0.9,ap.y));
  vec3 prev=texture(u_back,uv).rgb;
  float fade_mask = smoothstep(0.0, 0.45, uv.x);
  vec3 decay = prev * 0.90 * fade_mask;
  float act=smoothstep(0.95,1.0,u_slider);
  if(act<0.01||u_elapsed<0.0){ fc=vec4(decay,1.0); return; }
  float t=u_time;
  float cellDelay = h * 1.2;
  float cellAge   = max(u_elapsed - cellDelay, 0.0);
  float ignited   = step(0.001, cellAge);
  float cellSpd   = 0.85 + h * 0.30;
  float eased = 1.0 - pow(1.0 - clamp(cellAge / 2.5, 0.0, 1.0), 3.0);
  float dist  = eased * u_slider * cellSpd * ignited;
  float cellOff = (h - 0.5) * 0.05;
  float front   = max(u_slider - dist - cellOff, 0.02);
  float tail    = max(u_slider - front, 0.001);
  float inZ   = step(front - 0.003, uv.x) * step(uv.x, u_slider + 0.003);
  float dn    = clamp(max(u_slider - uv.x, 0.0) / tail, 0.0, 1.0);
  float bright = pow(1.0 - dn, 0.65);
  bright = max(bright, 0.04 * ignited) * inZ;
  bright *= 1.0 - smoothstep(0.94, 1.05, dn);
  float es = mix(0.15, 0.5, min(u_elapsed / 1.0, 1.0));
  float vy = abs(uv.y - 0.5) * 2.0;
  float vf = pow(max(1.0 - vy * vy * 0.45, 0.0), 0.75);
  float ts = mix(0.85, 1.0, min(u_elapsed / 1.5, 1.0));
  float f1 = sin(uv.x * 30.0 + t * 15.0 * ts + h * 6.28);
  float f2 = sin(uv.x * 17.0 + t * 8.0 * ts + h * 3.14);
  float f3 = sin(uv.x * 52.0 + t * 25.0 * ts + h * 10.0);
  float flame = smoothstep(0.08, 0.92, (f1 + f2 * 0.5 + f3 * 0.25) * 0.35 + 0.5);
  float r1 = sin(dn * 16.0 - t * 5.0 * ts + h * 3.0);
  float r2 = sin(dn * 8.0 - t * 2.5 * ts + h * 5.0);
  float rhythm = smoothstep(-0.15, 0.55, r1) * (r2 * 0.5 + 0.5);
  rhythm = pow(max(rhythm, 0.0), 1.2);
  float avgSpd = dist / max(cellAge, 0.001);
  float age    = max(cellAge - max(u_slider - uv.x, 0.0) / max(avgSpd, 0.001), 0.0);
  float flash  = step(0.0, age) * exp(-age * 3.2);
  float sp  = fract(t * (0.38 + h * 0.15) + h * 7.0);
  float sX  = u_slider - sp * tail;
  float sY  = 0.5 + sin(sp * 11.0 + h * 6.28) * 0.28;
  float spark = smoothstep(0.014, 0.0, abs(uv.x - sX)) * smoothstep(0.18, 0.0, abs(uv.y - sY)) * (1.0 - sp) * (1.0 - sp) * es;
  float energy = bright * vf * (flame * 0.42 + rhythm * 0.38) + flash * bright * vf * 0.55 + spark * 0.7 * inZ;
  energy *= es;
  float edgeBase = exp(-pow((uv.x - front) * 18.0, 2.0));
  float ef1 = sin(uv.x * 45.0 + t * 20.0 * ts + h * 6.28) * 0.5 + 0.5;
  float ef2 = sin(uv.x * 28.0 + t * 11.0 * ts + h * 3.14) * 0.5 + 0.5;
  float edge = edgeBase * (0.25 + ef1 * ef2 * 1.5) * 1.6 * act * es;
  float leadD    = front - uv.x;
  float leadZone = smoothstep(0.07, 0.0, leadD) * step(0.0, leadD) * vf;
  float h2       = hash(id + vec2(99.0, 33.0));
  float leadF    = sin(leadD * 100.0 + t * 20.0 * ts + h2 * 6.28) * 0.5 + 0.5;
  float leadSpark = leadZone * step(0.6, h2) * leadF * act * es * 0.5;
  float total = energy + edge + leadSpark;
  vec3 ember = vec3(0.10, 0.18, 0.58);
  vec3 wblue = vec3(0.30, 0.42, 1.00);
  vec3 wht   = vec3(0.90, 0.94, 1.00);
  float temp = 1.0 - dn;
  vec3 col   = mix(ember, wblue, temp);
  col        = mix(col, wht, pow(temp, 4.5));
  col       *= total;
  float pulse = sin(t * 2.8) * 0.15 + 1.0;
  float core  = exp(-pow((uv.x - u_slider) * 16.0, 2.0));
  col += wht * core * 2.2 * pulse * act * es;
  col += wblue * exp(-pow((uv.x - u_slider) * 3.5, 2.0)) * 0.12 * act * es;
  col *= cell;
  col *= fade_mask;
  fc = vec4(min(decay + col, vec3(1.5)), 1.0);
}
`
    const FRAG_BLUR = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 fc;
uniform sampler2D u_tex;
uniform vec2 u_dir, u_res;
uniform float u_ext;
vec3 s(vec2 uv){ vec3 c=texture(u_tex,uv).rgb; return u_ext>0.5 && dot(c,vec3(0.2126,0.7152,0.0722))<0.3 ? vec3(0.0) : c; }
void main(){
  vec2 o=u_dir*1.8/u_res;
  vec3 r=s(v_uv)*0.227027;
  r+=s(v_uv+o)*0.194595;    r+=s(v_uv-o)*0.194595;
  r+=s(v_uv+o*2.0)*0.121622;r+=s(v_uv-o*2.0)*0.121622;
  r+=s(v_uv+o*3.0)*0.054054;r+=s(v_uv-o*3.0)*0.054054;
  fc=vec4(r,1.0);
}
`
    const FRAG_COMP = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 fc;
uniform sampler2D u_scene, u_glow;
uniform float u_light;
void main(){
  vec3 s=texture(u_scene,v_uv).rgb;
  vec3 g=texture(u_glow,v_uv).rgb;
  vec3 c=1.0-exp(-(s+g*1.2+s*g*0.35)*1.15);
  float a;
  if(u_light>0.5){
    c*=1.30;
    float l=max(c.r,max(c.g,c.b));
    a=smoothstep(0.24,0.62,l);
  } else {
    float l=max(c.r,max(c.g,c.b));
    a=clamp(l*2.2,0.0,1.0);
  }
  fc=vec4(c,a);
}
`

    const MAX_IDLE = 180

    function useWebglFire(canvasRef, sliderValue, isActive, isLight, timer) {
      const cache = React.useRef({ active: isActive, slider: sliderValue / 100, light: isLight })
      React.useEffect(function () { cache.current.active = isActive; cache.current.slider = sliderValue / 100; cache.current.light = isLight })
      const ultraStart = React.useRef(null)
      React.useEffect(function () {
        if (isActive && ultraStart.current == null) ultraStart.current = Date.now()
        else if (!isActive) ultraStart.current = null
      }, [isActive])
      const ensureLoopRef = React.useRef(null)
      React.useEffect(function () { if (isActive && ensureLoopRef.current) ensureLoopRef.current() }, [isActive])
      React.useEffect(function () {
        const el = canvasRef.current
        if (!el) return
        const glCtx = el.getContext('webgl2', { preserveDrawingBuffer: false, antialias: false })
        if (!glCtx) { console.warn('WebGL2 not supported'); return }
        const g = glCtx
        let simProg = null, blurProg = null, compProg = null, vao = null, vbo = null
        let programsReady = false
        let simA = null, simB = null, blurH = null, blurV = null
        const U = { simTime: null, simSlider: null, simElapsed: null, simBack: null, blurDir: null, blurExt: null, blurTex: null, blurRes: null, compScene: null, compGlow: null, light: null }
        let loopDispose = null, loopRunning = false, idleFrames = 0, wasActive = false
        let simTime = 0, lastNow = Date.now()
        function compileShader(type, src) {
          const sh = g.createShader(type); if (!sh) return null
          g.shaderSource(sh, src); g.compileShader(sh)
          if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) { console.error(g.getShaderInfoLog(sh)); g.deleteShader(sh); return null }
          return sh
        }
        function linkProgram(vsSrc, fsSrc) {
          const v = compileShader(g.VERTEX_SHADER, vsSrc); const f = compileShader(g.FRAGMENT_SHADER, fsSrc)
          if (!v || !f) return null
          const p = g.createProgram(); if (!p) return null
          g.attachShader(p, v); g.attachShader(p, f); g.bindAttribLocation(p, 0, 'a_pos'); g.linkProgram(p); g.deleteShader(v); g.deleteShader(f)
          if (!g.getProgramParameter(p, g.LINK_STATUS)) { console.error(g.getProgramInfoLog(p)); return null }
          return p
        }
        function compilePrograms() {
          simProg = linkProgram(VERT, FRAG_SIM); blurProg = linkProgram(VERT, FRAG_BLUR); compProg = linkProgram(VERT, FRAG_COMP)
          if (!simProg || !blurProg || !compProg) return
          vao = g.createVertexArray(); g.bindVertexArray(vao); vbo = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, vbo)
          g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), g.STATIC_DRAW)
          g.enableVertexAttribArray(0); g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0)
          U.simTime = g.getUniformLocation(simProg, 'u_time'); U.simSlider = g.getUniformLocation(simProg, 'u_slider'); U.simElapsed = g.getUniformLocation(simProg, 'u_elapsed'); U.simBack = g.getUniformLocation(simProg, 'u_back')
          U.blurDir = g.getUniformLocation(blurProg, 'u_dir'); U.blurExt = g.getUniformLocation(blurProg, 'u_ext'); U.blurTex = g.getUniformLocation(blurProg, 'u_tex'); U.blurRes = g.getUniformLocation(blurProg, 'u_res')
          U.compScene = g.getUniformLocation(compProg, 'u_scene'); U.compGlow = g.getUniformLocation(compProg, 'u_glow'); U.light = g.getUniformLocation(compProg, 'u_light')
          programsReady = true
        }
        function makeFBO() {
          const fbo = g.createFramebuffer(); const tex = g.createTexture(); if (!fbo || !tex) return null
          g.bindFramebuffer(g.FRAMEBUFFER, fbo); g.bindTexture(g.TEXTURE_2D, tex)
          g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, el.width, el.height, 0, g.RGBA, g.UNSIGNED_BYTE, null)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
          g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0); g.clearColor(0,0,0,1); g.clear(g.COLOR_BUFFER_BIT)
          return { fbo: fbo, tex: tex }
        }
        function destroyFBO(f) { if (!f) return; g.deleteFramebuffer(f.fbo); g.deleteTexture(f.tex) }
        function createFBOs() { simA = makeFBO(); simB = makeFBO(); blurH = makeFBO(); blurV = makeFBO() }
        function destroyFBOs() { destroyFBO(simA); simA = null; destroyFBO(simB); simB = null; destroyFBO(blurH); blurH = null; destroyFBO(blurV); blurV = null }
        function resize() {
          const w = el.clientWidth || 260; const h = el.clientHeight || 30
          if (el.width === w && el.height === h && simA && simB) return
          el.width = w; el.height = h; destroyFBOs(); createFBOs()
        }
        function stopLoop() { if (loopDispose) { loopDispose(); loopDispose = null }; loopRunning = false }
        function ensureLoop() {
          if (!simA || !simB) { resize(); if (!simA || !simB) return }
          if (loopRunning) { idleFrames = 0; return }
          loopRunning = true; idleFrames = 0; wasActive = false; simTime = 0; lastNow = Date.now()
          g.bindFramebuffer(g.FRAMEBUFFER, simA.fbo); g.clear(g.COLOR_BUFFER_BIT); g.bindFramebuffer(g.FRAMEBUFFER, simB.fbo); g.clear(g.COLOR_BUFFER_BIT)
          loopDispose = timer.interval(render, 16)
        }
        function render() {
          const now = Date.now(); const dt = Math.min(now - lastNow, 100); lastNow = now; simTime += dt / 1000
          const active = cache.current.active
          if (!active && !wasActive) { if (++idleFrames > MAX_IDLE) { stopLoop(); return }; return }
          idleFrames = 0
          if (active && !wasActive) { g.bindFramebuffer(g.FRAMEBUFFER, simA.fbo); g.clear(g.COLOR_BUFFER_BIT); g.bindFramebuffer(g.FRAMEBUFFER, simB.fbo); g.clear(g.COLOR_BUFFER_BIT) }
          wasActive = active
          const elapsed = active ? (Date.now() - (ultraStart.current || 0)) / 1000 : -1.0
          const sv = cache.current.slider
          g.viewport(0, 0, el.width, el.height)
          g.bindFramebuffer(g.FRAMEBUFFER, simB.fbo); g.useProgram(simProg)
          g.uniform1f(U.simTime, simTime); g.uniform1f(U.simSlider, sv); g.uniform1f(U.simElapsed, elapsed)
          g.activeTexture(g.TEXTURE0); g.bindTexture(g.TEXTURE_2D, simA.tex); g.uniform1i(U.simBack, 0); g.drawArrays(g.TRIANGLES, 0, 6)
          g.useProgram(blurProg); g.uniform2f(U.blurRes, el.width, el.height); g.bindFramebuffer(g.FRAMEBUFFER, blurH.fbo)
          g.uniform2f(U.blurDir, 1.0, 0.0); g.uniform1f(U.blurExt, 1.0); g.bindTexture(g.TEXTURE_2D, simB.tex); g.uniform1i(U.blurTex, 0); g.drawArrays(g.TRIANGLES, 0, 6)
          g.bindFramebuffer(g.FRAMEBUFFER, blurV.fbo); g.uniform2f(U.blurDir, 0.0, 1.0); g.uniform1f(U.blurExt, 0.0); g.bindTexture(g.TEXTURE_2D, blurH.tex); g.drawArrays(g.TRIANGLES, 0, 6)
          g.bindFramebuffer(g.FRAMEBUFFER, null); g.useProgram(compProg)
          g.activeTexture(g.TEXTURE0); g.bindTexture(g.TEXTURE_2D, simB.tex); g.uniform1i(U.compScene, 0)
          g.activeTexture(g.TEXTURE1); g.bindTexture(g.TEXTURE_2D, blurV.tex); g.uniform1i(U.compGlow, 1)
          g.uniform1f(U.light, cache.current.light ? 1.0 : 0.0)
          g.drawArrays(g.TRIANGLES, 0, 6)
          const tmp = simA; simA = simB; simB = tmp
        }
        function onContextLost(e) { e.preventDefault() }
        function onContextRestored() { programsReady = false; compilePrograms(); if (programsReady) { resize(); if (cache.current.active) ensureLoop() } }
        el.addEventListener('webglcontextlost', onContextLost); el.addEventListener('webglcontextrestored', onContextRestored)
        compilePrograms(); if (!programsReady) return
        resize(); ensureLoopRef.current = ensureLoop; if (cache.current.active) ensureLoop()
        return function () {
          ensureLoopRef.current = null; stopLoop(); destroyFBOs()
          if (simProg) g.deleteProgram(simProg); if (blurProg) g.deleteProgram(blurProg); if (compProg) g.deleteProgram(compProg)
          if (vao) g.deleteVertexArray(vao); if (vbo) g.deleteBuffer(vbo)
          el.removeEventListener('webglcontextlost', onContextLost); el.removeEventListener('webglcontextrestored', onContextRestored)
        }
      }, [])
    }

    function EffortSlider(props) {
      const efforts = props.efforts || []
      const currentEffortId = props.currentEffortId
      const busy = props.busy
      const onChoose = props.onChoose
      const timer = props.timer
      const light = props.light
      const canvasRef = React.useRef(null)
      const n = efforts.length
      const [level, setLevel] = React.useState(function () {
        const i = efforts.findIndex(function (e) { return e.id === currentEffortId })
        return i >= 0 ? i : (n > 0 ? n - 1 : 0)
      })
      React.useEffect(function () {
        const i = efforts.findIndex(function (e) { return e.id === currentEffortId })
        if (i >= 0) setLevel(i)
      }, [currentEffortId, efforts])
      const isMax = n > 0 && level === n - 1
      const sliderValue = n <= 1 ? 100 : Math.round((level / (n - 1)) * 100)
      useWebglFire(canvasRef, sliderValue, isMax, light, timer)
      const [flip, setFlip] = React.useState(false)
      const prevMaxRef = React.useRef(isMax)
      React.useEffect(function () {
        if (isMax && !prevMaxRef.current) { setFlip(true); return timer.timeout(function () { setFlip(false) }, 460) }
        else if (!isMax) setFlip(false)
        prevMaxRef.current = isMax
      }, [isMax])
      const cur = efforts[level]
      const pct = Math.min(sliderValue + 2, 100)
      const dotLeft = function (i) { return (n <= 1) ? '50%' : 'calc(13px + ' + (i / (n - 1)) + ' * (100% - 26px))' }
      if (n === 0) return React.createElement('div', { className: 'dsh-eff-hint' }, '当前模型无思考强度档位')
      return React.createElement('div', { className: 'dsh-eff-slider' },
        React.createElement('div', { className: 'dsh-eff-head' },
          React.createElement('span', { className: 'dsh-eff-label' }, '思考强度'),
          React.createElement('span', { className: (isMax ? 'dsh-eff-status dsh-eff-status-glow' : 'dsh-eff-status') + (flip ? ' dsh-eff-animate-up' : '') }, cur ? cur.name : ''),
        ),
        React.createElement('div', { className: 'dsh-eff-scale' },
          React.createElement('span', null, '更快'),
          React.createElement('span', null, '更聪明'),
        ),
        React.createElement('div', { className: 'dsh-eff-track' },
          React.createElement('div', { className: 'dsh-eff-trackbg' }),
          React.createElement('div', { className: 'dsh-eff-dots' },
            efforts.map(function (e, i) {
              return React.createElement('span', { key: i, className: 'dsh-eff-dot' + (i === level ? ' dsh-eff-dot-cur' : ''), style: { left: dotLeft(i) } })
            })
          ),
          React.createElement('canvas', { ref: canvasRef, className: 'dsh-eff-fire', style: { opacity: isMax ? 1 : 0, maskImage: 'linear-gradient(to right, black 0%, black ' + pct + '%, transparent ' + pct + '%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, black ' + pct + '%, transparent ' + pct + '%)' } }),
          React.createElement('input', {
            type: 'range', min: 0, max: Math.max(n - 1, 1), step: 1, value: level, disabled: busy,
            className: 'dsh-eff-range' + (isMax ? ' dsh-eff-glowing' : ''),
            onChange: function (e) { setLevel(Number(e.target.value)) },
            onMouseUp: function () { if (cur) onChoose(cur.id) },
            onTouchEnd: function () { if (cur) onChoose(cur.id) },
          }),
        ),
      )
    }

    function ModelEffortSelect(props) {
      const locked = props.locked
      const available = props.available
      const directory = props.directory
      const load = props.load
      const select = props.select
      const timer = props.timer
      const theme = props.theme
      const onThemeChange = props.onThemeChange
      const [state, setState] = React.useState(function () {
        try { return directory.getSnapshot() } catch (e) { return { groups: [], current: null, status: 'idle' } }
      })
      React.useEffect(function () {
        let unsubscribe
        try {
          unsubscribe = directory.subscribe(function () {
            try { setState(directory.getSnapshot()) } catch (e) { /* unreadable store */ }
          })
        } catch (e) { /* store handle unavailable */ }
        return typeof unsubscribe === 'function' ? unsubscribe : undefined
      }, [directory])
      const [open, setOpen] = React.useState(false)
      const [pane, setPane] = React.useState('root')
      const rootRef = React.useRef(null)
      const [dark, setDark] = React.useState(function () {
        if (theme !== undefined && typeof theme.getTheme === 'function') return theme.getTheme().active.colorScheme === 'dark'
        return typeof document !== 'undefined' && document.body != null && document.body.hasAttribute('data-ds-dark-theme')
      })
      React.useEffect(function () {
        if (onThemeChange === undefined) return
        return onThemeChange(function (snap) { setDark(snap.active.colorScheme === 'dark') })
      }, [onThemeChange])
      React.useEffect(function () { if (available) load() }, [available, load])
      React.useEffect(function () {
        if (!open) return
        function closeOutside(e) {
          if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', closeOutside)
        return function () { document.removeEventListener('mousedown', closeOutside) }
      }, [open])
      if (!available) return null
      const groups = state.groups || []
      const current = state.current
      let curModelObj = null
      for (let gi = 0; gi < groups.length; gi++) {
        const g = groups[gi]
        for (let mi = 0; mi < g.models.length; mi++) {
          const m = g.models[mi]
          if (current !== null && current.provider === g.id && current.model === m.id) curModelObj = { group: g, model: m }
        }
      }
      const modelLabel = curModelObj ? curModelObj.model.name : (props.degraded === true ? '模型' : '选择模型')
      const efforts = curModelObj && curModelObj.model.reasoning ? (curModelObj.model.reasoning.efforts || []) : []
      const currentEffortId = current ? current.reasoningEffort : undefined
      const curEffort = efforts.find(function (e) { return e.id === currentEffortId })
      const effortLabel = curEffort ? curEffort.name : (curModelObj && curModelObj.model.reasoning && curModelObj.model.reasoning.defaultEffort !== undefined ? '默认' : undefined)
      const busy = state.status === 'selecting'
      function chooseEffort(effortId) {
        if (curModelObj === null) return
        select({ provider: curModelObj.group.id, model: curModelObj.model.id, reasoningEffort: effortId }).then(function () {})
      }
      function chooseModel(g, m) {
        const selection = { provider: g.id, model: m.id }
        if (m.reasoning && m.reasoning.defaultEffort !== undefined) selection.reasoningEffort = m.reasoning.defaultEffort
        select(selection).then(function (accepted) { if (accepted) setPane('root') })
      }
      return React.createElement('div', { ref: rootRef, className: 'dsh-eff-root', tabIndex: -1 },
        React.createElement('button', {
          type: 'button', className: 'dsh-eff-trigger', disabled: locked, 'aria-haspopup': 'menu', 'aria-expanded': open,
          title: modelLabel + (effortLabel === undefined ? '' : ' · ' + effortLabel),
          onClick: function () { if (open) setOpen(false); else { setPane('root'); setOpen(true); load() } },
        },
          React.createElement('span', { className: 'dsh-eff-triggerLabel' }, modelLabel),
          effortLabel !== undefined && React.createElement('span', { className: 'dsh-eff-triggerEffort' }, effortLabel),
          React.createElement('span', { className: 'dsh-eff-chevron' + (open ? ' dsh-eff-chevronOpen' : '') }, '\u25be'),
        ),
        open && React.createElement('div', { className: 'dsh-eff-menu', role: 'menu' },
          pane === 'root' && React.createElement(React.Fragment, null,
            state.status === 'loading' && React.createElement('div', { className: 'dsh-eff-hint' }, '加载中…'),
            React.createElement(EffortSlider, { efforts: efforts, currentEffortId: currentEffortId, busy: busy, onChoose: chooseEffort, timer: timer, light: !dark }),
            React.createElement('button', { type: 'button', className: 'dsh-eff-cell', onClick: function () { setPane('model') } },
              '模型',
              React.createElement('span', { className: 'dsh-eff-cellVal' }, modelLabel),
              '\u203a',
            ),
          ),
          pane === 'model' && React.createElement(React.Fragment, null,
            React.createElement('button', { type: 'button', className: 'dsh-eff-cell', onClick: function () { setPane('root') } }, '\u2039 返回'),
            state.status === 'loading' && React.createElement('div', { className: 'dsh-eff-hint' }, '加载中…'),
            groups.map(function (g) {
              return React.createElement(React.Fragment, { key: g.id },
                React.createElement('div', { className: 'dsh-eff-group' }, g.name),
                g.models.map(function (m) {
                  const sel = current !== null && current.provider === g.id && current.model === m.id
                  return React.createElement('button', {
                    key: m.id, type: 'button', className: 'dsh-eff-opt' + (sel ? ' dsh-eff-opt-sel' : ''), disabled: busy,
                    onClick: function () { chooseModel(g, m) },
                  },
                    React.createElement('span', { className: 'dsh-eff-optName' }, m.name),
                    m.description !== undefined && React.createElement('span', { className: 'dsh-eff-optDesc' }, m.description),
                  )
                })
              )
            }),
          ),
        ),
      )
    }

    function apply(ctx) {
      const theme = ctx.get('theme')
      ctx.effect(function () {
        const tag = document.createElement('style')
        tag.dataset.dshEffortSlider = ''
        tag.textContent = CSS_STRING
        document.head.appendChild(tag)
        return function () { tag.remove() }
      })
      // Register only once the client slot service exists (client module load
      // order is not guaranteed), and resolve the model directory lazily so a
      // late-provided service still reaches the seat. Subagent seats stay
      // hidden exactly like the built-in seat; a missing directory degrades to
      // a clickable placeholder instead of rendering nothing.
      ctx.inject(['slots'], function (scope) {
        scope.slots.inject('conversation.input.right', function () {
          return scope.slots.register({
            name: 'conversation.input.right',
            id: 'effort-slider',
            order: 20,
            registrant: 'dsh-plugin-effort-slider',
            inject: function (sessionId) {
              const stub = {
                subscribe: function () { return function () {} },
                getSnapshot: function () { return { groups: [], current: null, status: 'idle', failures: [], error: null } },
              }
              const sessions = ctx.get('sessions')
              const subagent = sessions !== undefined && typeof sessions.subagentAddress === 'function' ? sessions.subagentAddress(sessionId) : undefined
              if (subagent !== undefined) {
                return { available: false, degraded: false, directory: stub, load: function () {}, select: function () { return Promise.resolve(false) } }
              }
              const models = ctx.get('modelDirectories')
              if (models === undefined) {
                return { available: true, degraded: true, directory: stub, load: function () {}, select: function () { return Promise.resolve(false) } }
              }
              try {
                const directory = models.directoryFor(sessionId)
                return {
                  available: true,
                  degraded: false,
                  directory: directory.store,
                  load: function () { try { directory.load().catch(function () {}) } catch (e) {} },
                  select: function (selection) {
                    try { return directory.select(selection).then(function () { return true }, function () { return false }) } catch (e) { return Promise.resolve(false) }
                  },
                }
              } catch (e) {
                return { available: true, degraded: true, directory: stub, load: function () {}, select: function () { return Promise.resolve(false) } }
              }
            },
          }, function (p) {
            return React.createElement(ModelEffortSelect, {
              locked: p.locked,
              available: p.available,
              degraded: p.degraded === true,
              directory: p.directory,
              load: p.load,
              select: p.select,
              timer: ctx.timer,
              theme: theme,
              onThemeChange: function (fn) { return ctx.on('theme/change', fn) },
            })
          })
        })
      })
    }

    exports.name = 'dsh-plugin-effort-slider'
    exports.inject = ['timer']
    exports.apply = apply
    return module.exports
  }
})