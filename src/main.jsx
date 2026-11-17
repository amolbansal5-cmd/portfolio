import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Menu, X, Code2, Layers3, Database, Server, Sparkles } from "lucide-react";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const linkedin = "https://www.linkedin.com/in/amol-bansal-590836250/";
const github = "https://github.com/amolbansal5-cmd";

function OrbScene() {
  const mount = useRef(null);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 7.4;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const geometry = new THREE.IcosahedronGeometry(1.7, 5);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x8735ed, metalness: 0.25, roughness: 0.19,
      transmission: 0.22, thickness: 1.2, clearcoat: 1, clearcoatRoughness: 0.12,
      transparent: true, opacity: 0.94
    });
    const orb = new THREE.Mesh(geometry, material);
    group.add(orb);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.82, 2),
      new THREE.MeshBasicMaterial({ color: 0xc5a3ff, wireframe: true, transparent: true, opacity: 0.24 })
    );
    group.add(wire);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x8d39f4, transparent: true, opacity: 0.58 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.012, 12, 180), ringMat);
    ring1.rotation.set(1.1, 0.4, 0.2);
    group.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.48, 0.008, 10, 180), new THREE.MeshBasicMaterial({ color: 0x45404c, transparent: true, opacity: 0.2 }));
    ring2.rotation.set(0.2, 1.2, 0.8);
    group.add(ring2);

    const lightA = new THREE.PointLight(0xffffff, 35, 20); lightA.position.set(3, 4, 5); scene.add(lightA);
    const lightB = new THREE.PointLight(0xb77aff, 24, 20); lightB.position.set(-4, -2, 3); scene.add(lightB);
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const starGeo = new THREE.BufferGeometry();
    const starCount = 420;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i*3] = (Math.random() - .5) * 11;
      positions[i*3+1] = (Math.random() - .5) * 9;
      positions[i*3+2] = (Math.random() - .5) * 5 - 1;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x9a6acb, size: 0.018, transparent: true, opacity: .7 }));
    scene.add(stars);

    let raf, scrollY = 0, targetX = 0, targetY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    const onMove = e => {
      const r = host.getBoundingClientRect();
      targetY = ((e.clientX - r.left) / r.width - .5) * .22;
      targetX = ((e.clientY - r.top) / r.height - .5) * .18;
    };
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.00025;
      group.rotation.y += (targetY + Math.sin(t) * .08 - group.rotation.y) * .025;
      group.rotation.x += (targetX + Math.cos(t * .8) * .06 - group.rotation.x) * .025;
      orb.rotation.y += .0018;
      wire.rotation.y -= .001;
      ring1.rotation.z += .0017;
      ring2.rotation.x += .0008;
      group.position.y = Math.sin(t * 2) * .08 - Math.min(scrollY / 2600, 1.1);
      group.rotation.z = scrollY * .00018;
      stars.rotation.y = t * .12;
      renderer.render(scene, camera);
    };
    animate();
    window.addEventListener("scroll", onScroll, { passive: true });
    host.addEventListener("pointermove", onMove);
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(resize); observer.observe(host);
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll);
      host.removeEventListener("pointermove", onMove); observer.disconnect();
      geometry.dispose(); material.dispose(); renderer.dispose();
      if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
    };
  }, []);
  return <div className="orb-scene" ref={mount} aria-label="Animated 3D purple abstract object" />;
}

const projects = [
  { n: "01", name: "CallURL", type: "Enterprise API · .NET 8", desc: "A backend integration that retrieves call records from an external platform using date and phone-number filters, with structured responses, retry handling and application logging.", stack: ["C#", "ASP.NET Core", "REST API", "NLog"], accent: "violet" },
  { n: "02", name: "Expense Manager", type: "Full-stack web application", desc: "A personal finance dashboard to track income and expenses, review month-wise trends, and understand savings through visual analytics.", stack: ["React", "Node.js", "Express", "MongoDB"], accent: "ink", href: github + "/Expense_manager" },
  { n: "03", name: "Grocery Billing System", type: "Web application", desc: "A grocery management and billing application designed to organize products and simplify day-to-day billing workflows.", stack: ["Python", "Django", "MySQL"], accent: "lilac" }
];

const skillGroups = [
  { icon: <Code2 />, title: "Frontend", items: ["React.js", "Next.js", "JavaScript", "HTML & CSS"] },
  { icon: <Server />, title: "Backend", items: ["C#", "ASP.NET Core", ".NET 8", "Node.js", "REST APIs"] },
  { icon: <Database />, title: "Databases", items: ["SQL Server", "MySQL", "MongoDB"] },
  { icon: <Layers3 />, title: "Tools & workflow", items: ["Git", "Postman", "Visual Studio", "API integration", "Testing"] }
];

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", { y: 34, opacity: 0, duration: .9, stagger: .12, ease: "power3.out", delay: .15 });
      gsap.utils.toArray(".reveal").forEach(el => {
        gsap.fromTo(el, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
      gsap.utils.toArray(".project-card").forEach((el, i) => {
        gsap.fromTo(el, { y: 55, rotateX: 5, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: .85, delay: i*.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.to(".about-ghost", { y: -90, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".hero-stamp", { y: 130, rotate: 16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
    });
    return () => ctx.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return <>
    <div className="grain" />
    <header className="topbar">
      <a className="brand" href="#home" onClick={closeMenu}><span>A</span>mol<span className="brand-dot">.</span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? "nav nav-open" : "nav"}>
        {["Home", "About", "Skills", "Work", "Contact"].map(item => <a key={item} href={"#" + item.toLowerCase()} onClick={closeMenu}>{item}</a>)}
      </nav>
      <a className="top-cta" href="#contact">Let's talk <ArrowUpRight size={15}/></a>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> AVAILABLE FOR OPPORTUNITIES</div>
          <h1>Building digital<br/>experiences with <em>purpose.</em></h1>
          <h2>Hi, I'm Amol Bansal<span className="purple">.</span></h2>
          <p className="hero-desc">Full Stack Developer crafting responsive interfaces, dependable APIs and practical software solutions.</p>
          <div className="hero-actions">
            <a className="btn primary" href="#work">Explore my work <ArrowUpRight size={16}/></a>
            <a className="btn secondary" href={linkedin} target="_blank" rel="noreferrer">Let's connect <Linkedin size={16}/></a>
          </div>
          <div className="hero-social">
            <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a>
            <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a>
            <span>GHAZIABAD, INDIA · OPEN TO GROWTH</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/>
          <OrbScene/>
          <div className="floating-note note-top"><span className="note-icon"><Sparkles size={15}/></span><span><b>Thoughtful code</b><small>Built to make an impact</small></span></div>
          <div className="floating-note note-bottom"><span className="note-pulse"/><span><b>Full Stack</b><small>Frontend · Backend · APIs</small></span></div>
          <div className="hero-stamp">DEVELOPER<br/>PORTFOLIO <span>✳</span></div>
          <div className="hero-index">01 / 05</div>
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a>
      </section>

      <section className="about section" id="about">
        <div className="section-kicker reveal">01 — A LITTLE ABOUT ME</div>
        <div className="about-grid">
          <div className="about-heading reveal"><span className="about-ghost">ABOUT</span><h2>Curious mind.<br/><em>Practical builder.</em></h2></div>
          <div className="about-copy reveal">
            <p className="lead">I’m a developer who enjoys turning complex problems into clear, useful digital experiences.</p>
            <p>My work spans frontend development, backend APIs and database-driven applications. I care about writing maintainable code, understanding how systems fit together, and continuously improving the details that make software reliable.</p>
            <div className="about-facts">
              <div><b>2025</b><span>BCA graduate</span></div>
              <div><b>.NET + React</b><span>Current focus</span></div>
              <div><b>India</b><span>Based in Ghaziabad</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="experience section">
        <div className="section-kicker reveal">02 — EXPERIENCE & EDUCATION</div>
        <div className="timeline">
          <div className="timeline-item reveal"><div className="timeline-date">2026 — PRESENT</div><div className="timeline-mark"/><div><h3>Software Developer <span>· Arvius Software Pvt. Ltd.</span></h3><p>Working across .NET and React-based application development, API integrations, database workflows and debugging.</p><div className="chips"><span>C#</span><span>ASP.NET Core</span><span>React</span><span>SQL</span></div></div></div>
          <div className="timeline-item reveal"><div className="timeline-date">2022 — 2025</div><div className="timeline-mark"/><div><h3>Bachelor of Computer Applications <span>· Graphic Era Deemed University</span></h3><p>Built a foundation in programming, databases, operating systems and computer networks.</p><div className="chips"><span>Programming</span><span>DBMS</span><span>Networking</span></div></div></div>
        </div>
      </section>

      <section className="skills section" id="skills">
        <div className="section-kicker reveal">03 — MY TOOLKIT</div>
        <div className="section-heading reveal"><h2>Technologies I work <em>with.</em></h2><p>A growing toolkit for building complete, reliable products.</p></div>
        <div className="skill-grid">
          {skillGroups.map((group, i) => <article className="skill-card reveal" key={group.title}><div className="skill-icon">{group.icon}</div><div className="skill-num">0{i+1}</div><h3>{group.title}</h3><div className="skill-tags">{group.items.map(x => <span key={x}>{x}</span>)}</div></article>)}
        </div>
      </section>

      <section className="work section" id="work">
        <div className="section-kicker reveal">04 — SELECTED WORK</div>
        <div className="section-heading work-heading reveal"><h2>Things I've <em>built.</em></h2><p>Projects that reflect how I approach real-world problems: understand the need, design the flow, build and refine.</p></div>
        <div className="project-list">
          {projects.map(p => <article className={"project-card " + p.accent} key={p.n}>
            <div className="project-top"><span>PROJECT / {p.n}</span><span className="project-type">{p.type}</span></div>
            <div className="project-main"><div><h3>{p.name}<span className="project-arrow"><ArrowUpRight size={22}/></span></h3><p>{p.desc}</p><div className="chips">{p.stack.map(s => <span key={s}>{s}</span>)}</div></div><div className="project-art"><div className="art-window"><div className="window-dots"><i/><i/><i/></div><div className="art-lines"><b/><b/><b/><b/></div><div className="art-orb"/></div><div className="art-caption">{p.n} / DIGITAL CRAFT</div></div></div>
            {p.href && <a className="project-link" href={p.href} target="_blank" rel="noreferrer">View source on GitHub <ArrowUpRight size={15}/></a>}
          </article>)}
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-back">LET'S TALK</div>
        <div className="section-kicker reveal">05 — HAVE A PROJECT IN MIND?</div>
        <div className="contact-content reveal"><h2>Let's make something<br/><em>meaningful.</em></h2><p>I'm always open to connecting with developers, teams and people building useful things.</p><a className="btn primary contact-btn" href={linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={17}/></a></div>
        <div className="contact-bottom"><a className="brand" href="#home"><span>A</span>mol<span className="brand-dot">.</span></a><span>DESIGNED & BUILT WITH INTENTION</span><div className="footer-social"><a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={17}/></a><a href={github} target="_blank" rel="noreferrer"><Github size={17}/></a></div></div>
      </section>
    </main>
  </>;
}

createRoot(document.getElementById("root")).render(<App/>);