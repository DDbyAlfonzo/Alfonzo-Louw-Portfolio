
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(pointer: fine)').matches;

  var hero = document.getElementById('top');
  /* ---------- Fit the name to the viewport ---------- */
  var names = document.querySelectorAll('.name');
  function fit(){
    if (!hero.clientWidth) return;
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:Anybody,sans-serif;font-weight:820;letter-spacing:-.035em;font-size:100px;font-variation-settings:"wdth" 118';
    document.body.appendChild(probe);
    probe.textContent = 'Alfonzo'; var w = probe.getBoundingClientRect().width; probe.remove();
    var target = hero.clientWidth * 0.96;
    names.forEach(function(n){ n.style.fontSize = (100 * target / w) + 'px'; });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fit);
  addEventListener('resize', fit); window.__fitName = fit;

  /* ---------- Natural head performance ---------- */
  // One story per 12.5s loop: a user need appears and he looks at it, the business goal appears
  // and he turns to it and nods, both fade, then he watches the cursor resize his frame.
  var TL = 12.5, TL_DELAY = 2.4;
  var POSES = [ // [time s, turn, tilt]  turn: + looks right, tilt: + nods down
    [0, 0, 0], [0.5, 0, 0],
    [1.4, -.36, .03], [3.0, -.36, .03],
    [3.9, .42, -.05], [4.5, .42, -.05], [4.85, .42, .09], [5.3, .42, -.04], [6.2, .42, -.05],
    [7.2, 0, 0], [7.9, 0, 0],
    [8.7, .15, .07], [11.2, .15, .07],
    [12.1, 0, 0], [12.5, 0, 0]
  ];
  function easeIO(x){ return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function posePerf(t){
    var p = t % TL, i = 0;
    while (i < POSES.length - 2 && POSES[i + 1][0] <= p) i++;
    var a = POSES[i], b = POSES[i + 1], k = easeIO((p - a[0]) / Math.max(b[0] - a[0], .001));
    var dx = Math.sin(t * 1.7) * .012 + Math.sin(t * 2.9 + 1) * .008, dy = Math.sin(t * 1.3 + 2) * .01;
    return [a[1] + (b[1] - a[1]) * k + dx, a[2] + (b[2] - a[2]) * k + dy];
  }

  /* ---------- Thoughts: pairing what people need with what the business needs ---------- */
  (function(){
    var PAIRS = [
      ['Who is this really for?', 'What does success look like?'],
      ['Fewer steps to send money', 'More completed payments'],
      ['Clear fees, no surprises', 'Trust that brings people back'],
      ['Help when something goes wrong', 'Fewer calls to support'],
      ['Easy for everyone to use', 'Reach more customers']
    ];
    var layer = document.getElementById('thoughts'), subjectEl = document.getElementById('subject');
    var mobile = matchMedia('(max-width:860px)');
    function el(cls, html){ var d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; layer.appendChild(d); return d; }
    function rel(){ var s = subjectEl.getBoundingClientRect(), h = hero.getBoundingClientRect(); return {x:s.left - h.left, y:s.top - h.top, w:s.width, h:s.height, hw:h.width}; }
    // one thought: two trailing dots from the head, then the bubble
    function bubble(text, biz, side){
      var r = rel(), ax, ay;
      if (mobile.matches){ ax = r.x + r.w * .62; ay = r.y + r.h * .1; }
      else if (side === 'left'){ ax = r.x + r.w * .40; ay = r.y + r.h * .52; }
      else { ax = r.x + r.w * .86; ay = r.y + r.h * .18; }
      var b = el('th' + (biz ? ' biz' : ''), '<small><i></i>' + (biz ? 'Business goal' : 'User need') + '</small><b>' + text + '</b>');
      var bw = b.offsetWidth, bh = b.offsetHeight, bx, by, d1, d2;
      if (mobile.matches){
        bx = Math.max(12, Math.min(ax - bw / 2, r.hw - bw - 12)); by = ay - bh - 40;
        d1 = [ax - 3, ay - 12, 6]; d2 = [ax + 2, ay - 24, 9];
        b.style.transformOrigin = '50% 100%';
      } else if (side === 'left'){
        bx = ax - bw - 38; by = ay - bh * .6;
        d1 = [ax - 14, ay - 4, 6]; d2 = [ax - 28, ay - 12, 9];
        b.style.transformOrigin = '100% 60%';
      } else {
        bx = ax + 38; by = Math.max(ay - bh - 14, 78);
        d1 = [ax + 10, ay - 8, 6]; d2 = [ax + 24, ay - 20, 9];
        b.style.transformOrigin = '0% 100%';
      }
      b.style.left = bx + 'px'; b.style.top = by + 'px';
      var dots = [d1, d2].map(function(d){ var e = el('th-dot'); e.style.cssText = 'left:' + (d[0] - d[2] / 2) + 'px;top:' + (d[1] - d[2] / 2) + 'px;width:' + d[2] + 'px;height:' + d[2] + 'px'; return e; });
      if (reduce){ dots.concat(b).forEach(function(e){ e.classList.add('on'); }); return [dots[0], dots[1], b]; }
      setTimeout(function(){ dots[0].classList.add('on'); }, 20);
      setTimeout(function(){ dots[1].classList.add('on'); }, 140);
      setTimeout(function(){ b.classList.add('on'); }, 260);
      return [dots[0], dots[1], b];
    }
    function clear(items){ items.forEach(function(e){ e.classList.add('out'); setTimeout(function(){ e.remove(); }, 700); }); }

    var live = {user:null, biz:null};
    window.__thoughts = {
      user:function(n){ var p = PAIRS[n % PAIRS.length]; live.user = bubble(p[0], false, 'left'); },
      biz:function(n){ var p = PAIRS[n % PAIRS.length]; if (mobile.matches && live.user){ clear(live.user); live.user = null; } live.biz = bubble(p[1], true, 'right'); },
      clearAll:function(){ if (live.user) clear(live.user); if (live.biz) clear(live.biz); live.user = live.biz = null; }
    };
    if (reduce) (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function(){
      bubble(PAIRS[0][0], false, 'left'); if (!mobile.matches) bubble(PAIRS[0][1], true, 'right');
    });
  })();

  /* ---------- Pause ---------- */
  (function(){
    var btn = document.getElementById('hpause'), ic = document.getElementById('hpIcon'), pIc = ic.innerHTML, plIc = '<path d="M4 2.5v11l9.5-5.5z" fill="currentColor"/>';
    btn.addEventListener('click', function(){
      var s = window.__heroState; if (!s) return;
      s.paused = !s.paused;
      btn.setAttribute('aria-label', s.paused ? 'Play animation' : 'Pause animation');
      ic.innerHTML = s.paused ? plIc : pIc;
    });
  })();

  /* ---------- Selection frame readout ---------- */
  var selframe = document.getElementById('selframe'), seldim = document.getElementById('seldim'), lastDim = 0;
  var mcur = document.getElementById('mcur'), handle = selframe.querySelector('.h8');
  var cur = {x:0, y:0, init:false, last:0}, CT = 10;
  function easeC(x){ x = Math.max(0, Math.min(1, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  var lastPhase = -1;
  function fireEvents(tl){
    var p = tl % TL, n = Math.floor(tl / TL), T = window.__thoughts;
    if (!T) return;
    function crossed(e){ return lastPhase < e && p >= e || (p < lastPhase && e <= p); }
    if (lastPhase >= 0){
      if (crossed(0.5)) T.user(n);
      if (crossed(3.2)) T.biz(n);
      if (crossed(6.4)) T.clearAll();
    }
    lastPhase = p;
  }
  function updateFrame(now, mx, tl){
    var dt = Math.min((now - (cur.last || now)) / 1000, .1); cur.last = now;
    var mobileNow = innerWidth <= 860, g = 0, press = false;
    if (!reduce && tl > 0 && state.visible) fireEvents(tl);
    var p = tl % TL;
    if (!reduce && !mobileNow && tl > 7){
      var h = hero.getBoundingClientRect(), hr = handle.getBoundingClientRect(), fr = selframe.getBoundingClientRect();
      var hx = hr.left - h.left + hr.width / 2, hy = hr.top - h.top + hr.height / 2;
      var idle = {x:Math.min(fr.right - h.left + 46, h.width - 120) + Math.sin(now / 900) * 8, y:fr.bottom - h.top - 70 + Math.cos(now / 1100) * 8};
      var tgt = idle;
      // grab, drag out, let go, come back, drag in, let go
      // in the pause between thoughts: grab the corner, drag out, hold, drag back
      if (p < 7.6) tgt = idle;
      else if (p < 8.5) tgt = {x:hx, y:hy};
      else if (p < 9.7){ g = easeC((p - 8.5) / 1.2) * 32; tgt = {x:hx, y:hy}; press = true; }
      else if (p < 10.4){ g = 32; tgt = {x:hx, y:hy}; }
      else if (p < 11.5){ g = 32 * (1 - easeC((p - 10.4) / 1.1)); tgt = {x:hx, y:hy}; press = true; }
      else tgt = idle;
      if (!cur.init){ cur.x = h.width + 40; cur.y = idle.y; cur.init = true; }
      var k = 1 - Math.exp(-dt * (press ? 30 : 6));
      cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k;
      mcur.style.transform = 'translate(' + cur.x.toFixed(1) + 'px,' + cur.y.toFixed(1) + 'px)';
      mcur.classList.add('on'); mcur.classList.toggle('press', press);
    }
    selframe.style.setProperty('--g', g.toFixed(1) + 'px');
    if (now - lastDim > 90){ var r = selframe.getBoundingClientRect(); seldim.textContent = Math.round(r.width) + ' \u00d7 ' + Math.round(r.height); lastDim = now; }
  }

  /* ---------- 3D portrait ---------- */
  var subject = document.getElementById('subject'), canvas = document.getElementById('gl');
  var gl = canvas.getContext('webgl', {premultipliedAlpha:true, alpha:true, antialias:false});
  var state = {mx:0, my:0, tx:0, ty:0, amt:0, light:0, lastMove:-9999, intro:0, visible:true};
  window.__heroState = state;
  if ('IntersectionObserver' in window) new IntersectionObserver(function(e){ state.visible = e[0].isIntersecting; }).observe(hero);
  var t0 = performance.now();
  // Hero video: set to a stacked-alpha MP4 (colour frame on top, black/white matte below),
  // e.g. 'hero.mp4'. Leave empty to use the 3D still portrait.
  var HERO_VIDEO = window.HERO_VIDEO || '';
  var video = null, vidTex = null, videoOn = false, lastVT = -1, vidStart = 0;
  function startVideo(){
    if (!HERO_VIDEO || reduce) return;
    video = document.createElement('video');
    video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
    video.setAttribute('playsinline', ''); video.crossOrigin = 'anonymous'; video.src = HERO_VIDEO;
    video.addEventListener('loadedmetadata', function(){ subject.style.aspectRatio = video.videoWidth + '/' + (video.videoHeight / 2); size(); });
    video.addEventListener('playing', function(){ videoOn = true; vidStart = performance.now(); }, {once:true});
    var p = video.play(); if (p && p.catch) p.catch(function(){});
  }

  function initGL(imgSrc, depthSrc){
    var vs = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;varying vec2 v;',
      'uniform sampler2D uImg,uDepth,uVid;uniform vec2 uMouse,uTexel;uniform float uAmt,uLight,uVideo,uMix;',
      'vec4 still(){',
      ' vec2 off=uMouse*uAmt;',
      ' float d=texture2D(uDepth,v).r; vec2 p=v-off*(d-.42);',
      ' d=texture2D(uDepth,p).r; p=v-off*(d-.42);',
      ' d=texture2D(uDepth,p).r; p=v-off*(d-.42);',
      ' vec4 c=texture2D(uImg,p);',
      ' float dx=texture2D(uDepth,p+vec2(uTexel.x,0.)).r-texture2D(uDepth,p-vec2(uTexel.x,0.)).r;',
      ' float dy=texture2D(uDepth,p+vec2(0.,uTexel.y)).r-texture2D(uDepth,p-vec2(0.,uTexel.y)).r;',
      ' vec3 n=normalize(vec3(-dx*6.,-dy*6.,1.));',
      ' vec3 L=normalize(vec3(uMouse.x*.9+.2,uMouse.y*.6+.35,.8));',
      ' float lam=max(dot(n,L),0.);',
      ' float shade=mix(1.,.84+.26*lam,uLight);',
      ' float rim=pow(clamp(1.-n.z,0.,1.),1.1)*max(dot(normalize(n.xy+1e-4),normalize(L.xy)),0.);',
      ' vec3 rgb=c.rgb*shade+vec3(1.,.74,.44)*rim*.5*uLight*c.a;',
      ' return vec4(rgb,c.a);',
      '}',
      // stacked-alpha video: colour on top, matte underneath
      'vec4 vid(){ float a=texture2D(uVid,vec2(v.x,min(v.y*.5,.498))).r; vec3 c=texture2D(uVid,vec2(v.x,max(.5+v.y*.5,.502))).rgb; return vec4(c*a,a); }',
      'void main(){ gl_FragColor = uVideo > .5 ? mix(still(), vid(), uMix) : still(); }'].join('\n');
    function sh(type, src){ var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    function tex(img, unit, premult){
      var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premult);
      if (img) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function(k){ gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE); });
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return t;
    }
    tex(imgSrc, 0, true); tex(depthSrc, 1, false); vidTex = tex(null, 2, false);
    var U = function(n){ return gl.getUniformLocation(prog, n); };
    gl.uniform1i(U('uImg'), 0); gl.uniform1i(U('uDepth'), 1); gl.uniform1i(U('uVid'), 2);
    gl.uniform2f(U('uTexel'), 3 / depthSrc.width, 3 / depthSrc.height);
    return {mouse:U('uMouse'), amt:U('uAmt'), light:U('uLight'), video:U('uVideo'), mix:U('uMix')};
  }

  function size(){
    var r = subject.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function load(src){ return new Promise(function(res, rej){ var i = new Image(); i.onload = function(){ res(i); }; i.onerror = rej; i.src = src; }); }

  if (gl){
    Promise.all([load(document.getElementById('subjectImg').src), load((window.__BASE || '') + '/img/depth.jpg')]).then(function(imgs){
      var u;
      try { u = initGL(imgs[0], imgs[1]); } catch(e){ return; }
      subject.classList.add('gl'); size(); addEventListener('resize', size);
      startVideo();
      var visible = true, running = true;
      if ('IntersectionObserver' in window) new IntersectionObserver(function(e){
        visible = e[0].isIntersecting;
        if (video){ if (!visible) video.pause(); else video.play(); }
        if (visible && !running){ running = true; requestAnimationFrame(frame); }
      }).observe(hero);

      function frame(now){
        var t = (now - t0) / 1000;
        // Intro: the head turns into place and the light sweeps across
        var k = reduce ? 1 : Math.min(Math.max((t - .5) / 2.2, 0), 1), e = 1 - Math.pow(1 - k, 3);
        var introX = (1 - e) * -.45;
        // Always-on loop: a slow head turn with a small nod and a breath, like a looping GIF.
        var dt = Math.min((now - (state.last || now)) / 1000, .1); state.last = now;
        if (!state.paused && !reduce) state.at = (state.at || 0) + dt;
        // Pose-to-pose performance: hold, glance, settle, nod, glance back. Eased moves with
        // real holds read as a person; a constant sine wave reads as a machine.
        var lt = state.at || 0, tl = Math.max(0, lt - TL_DELAY), pose = posePerf(tl);
        var tx = videoOn ? 0 : pose[0], ty = videoOn ? 0 : pose[1];
        // The cursor still nudges the pose a little when it's used, but nothing depends on it.
        if (finePointer && now - state.lastMove < 1800){ tx += state.tx * .3; ty += state.ty * .2; }
        if (reduce){ tx = 0; ty = 0; }
        var sm = 1 - Math.exp(-dt * 10); state.mx += (tx - state.mx) * sm; state.my += (ty - state.my) * sm;
        var mx = state.mx * e + introX, my = state.my * e;
        hero.style.setProperty('--b', reduce ? 0 : (Math.sin(lt * Math.PI * 2 / 4.2) * e).toFixed(4));
        if (videoOn && video.readyState >= 2 && video.currentTime !== lastVT){
          gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, vidTex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          lastVT = video.currentTime;
        }
        gl.uniform1f(u.video, videoOn ? 1 : 0);
        gl.uniform1f(u.mix, videoOn ? Math.min((now - vidStart) / 500, 1) : 0);
        updateFrame(now, mx, tl);
        gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.mouse, mx, -my);
        gl.uniform1f(u.amt, .055);
        gl.uniform1f(u.light, reduce ? .5 : .35 + .65 * e);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        hero.style.setProperty('--mx', mx.toFixed(4));
        hero.style.setProperty('--my', my.toFixed(4));
        if (visible) requestAnimationFrame(frame); else running = false;
      }
      requestAnimationFrame(frame);
    });
  }

  hero.addEventListener('pointermove', function(ev){
    if (ev.pointerType !== 'mouse') return;
    var r = hero.getBoundingClientRect();
    state.tx = ((ev.clientX - r.left) / r.width) * 2 - 1;
    state.ty = ((ev.clientY - r.top) / r.height) * 2 - 1;
    state.lastMove = performance.now();
  });
  hero.addEventListener('pointerleave', function(){ state.tx = 0; state.ty = 0; });


  /* ---------- Copy email ---------- */
  var copy = document.getElementById('copy');
  copy.addEventListener('click', function(){
    var ok = function(){ copy.textContent = 'Copied'; setTimeout(function(){ copy.textContent = 'Copy email'; }, 1800); };
    try { navigator.clipboard.writeText('alfonzolouw9@gmail.com').then(ok, function(){ copy.textContent = 'Select the email to copy'; }); } catch(e){ copy.textContent = 'Select the email to copy'; }
  });
})();
