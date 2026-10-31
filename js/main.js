// ============================================================================
// MAIN APPLICATION SCRIPT — KEVIN CHRISTOPHER PORTFOLIO
// Handles theme switching, navigation, dynamic content rendering from
// js/config.js, GitHub repository synchronization, and modal interactions.
// ============================================================================

(function () {
    "use strict";

    // SVG Icon Dictionary for crisp minimalist outline icons
    const ICONS = {
        github: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
        linkedin: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
        facebook: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`,
        instagram: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
        email: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`,
        external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
        eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
    };

    let toastTimeout = null;

    // ------------------------------------------------------------------------
    // 1. TOAST NOTIFICATION HELPER
    // ------------------------------------------------------------------------
    function showToast(message) {
        const toast = document.getElementById("toastNotification");
        if (!toast) return;

        toast.textContent = message;
        toast.hidden = false;

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        toastTimeout = setTimeout(() => {
            toast.hidden = true;
        }, 3800);
    }

    // ------------------------------------------------------------------------
    // 2. THEME MANAGEMENT (DARK / LIGHT MODE)
    // ------------------------------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem("kevin_portfolio_theme") || "dark";
        applyTheme(savedTheme);

        const themeToggle = document.getElementById("themeToggle");
        const mobileThemeToggle = document.getElementById("mobileThemeToggle");

        const handleToggle = () => {
            const current = document.documentElement.getAttribute("data-theme") || "dark";
            const next = current === "dark" ? "light" : "dark";
            applyTheme(next);
            localStorage.setItem("kevin_portfolio_theme", next);
        };

        if (themeToggle) themeToggle.addEventListener("click", handleToggle);
        if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", handleToggle);
    }

    function applyTheme(theme) {
        const resolved = theme === "light" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", resolved);
        const label = document.getElementById("themeToggleLabel");
        if (label) {
            label.textContent = resolved === "dark" ? "Dark Mode" : "Light Mode";
        }
    }

    // ------------------------------------------------------------------------
    // 3. SIDEBAR & MOBILE NAVIGATION
    // ------------------------------------------------------------------------
    function initNavigation() {
        const sidebar = document.getElementById("sidebar");
        const mobileMenuBtn = document.getElementById("mobileMenuToggle");
        const backdrop = document.getElementById("sidebarBackdrop");
        const navItems = document.querySelectorAll(".nav-item");
        const sections = document.querySelectorAll(".content-section");

        function closeMobileMenu() {
            if (!sidebar || !mobileMenuBtn || !backdrop) return;
            sidebar.classList.remove("is-open");
            backdrop.classList.remove("is-visible");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        }

        if (mobileMenuBtn && sidebar && backdrop) {
            mobileMenuBtn.addEventListener("click", () => {
                const isOpen = sidebar.classList.toggle("is-open");
                backdrop.classList.toggle("is-visible", isOpen);
                mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
            });

            backdrop.addEventListener("click", closeMobileMenu);
        }

        navItems.forEach((link) => {
            link.addEventListener("click", () => {
                navItems.forEach((item) => item.classList.remove("active"));
                link.classList.add("active");
                closeMobileMenu();
            });
        });

        // IntersectionObserver to update active nav item while scrolling
        if ("IntersectionObserver" in window && sections.length > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute("id");
                            navItems.forEach((item) => {
                                item.classList.toggle("active", item.dataset.section === id);
                            });
                        }
                    });
                },
                {
                    rootMargin: "-25% 0px -60% 0px",
                    threshold: 0
                }
            );

            sections.forEach((sec) => observer.observe(sec));
        }
    }

    // ------------------------------------------------------------------------
    // 4. PERSONAL INFO HYDRATION
    // ------------------------------------------------------------------------
    function renderPersonalInfo() {
        if (typeof PERSONAL_INFO === "undefined") return;

        const bindings = {
            sidebarBrandName: PERSONAL_INFO.name,
            heroLine1: PERSONAL_INFO.heroHeadingLine1,
            heroIntro: PERSONAL_INFO.introduction,
            profileFullName: PERSONAL_INFO.fullName || PERSONAL_INFO.name,
            profileIdentity: PERSONAL_INFO.identity,
            profileCourse: PERSONAL_INFO.course,
            profilePrimaryInterest: PERSONAL_INFO.primaryInterest,
            profileAdditionalInterest: PERSONAL_INFO.additionalInterest
        };

        Object.entries(bindings).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value) el.textContent = value;
        });

        const profileImg = document.getElementById("profileImage");
        if (profileImg && PERSONAL_INFO.profilePhoto) {
            profileImg.src = PERSONAL_INFO.profilePhoto;
            profileImg.alt = PERSONAL_INFO.fullName || PERSONAL_INFO.name;
        }
    }

    // ------------------------------------------------------------------------
    // 5. SOCIAL LINKS RENDERING (NO FAKE '#' LINKS)
    // ------------------------------------------------------------------------
    function renderSocialLinks() {
        if (typeof SOCIAL_LINKS === "undefined") return;

        const platforms = [
            { key: "github", label: "GitHub", icon: ICONS.github },
            { key: "linkedin", label: "LinkedIn", icon: ICONS.linkedin },
            { key: "facebook", label: "Facebook", icon: ICONS.facebook },
            { key: "instagram", label: "Instagram", icon: ICONS.instagram },
            { key: "email", label: "Email", icon: ICONS.email }
        ];

        const sidebarList = document.getElementById("sidebarSocialList");
        const contactGrid = document.getElementById("contactSocialGrid");

        if (sidebarList) {
            sidebarList.innerHTML = "";
            platforms.forEach((platform) => {
                const rawValue = (SOCIAL_LINKS[platform.key] || "").trim();
                const li = document.createElement("li");

                if (rawValue) {
                    const href =
                        platform.key === "email" && !rawValue.startsWith("mailto:")
                            ? `mailto:${rawValue}`
                            : rawValue;

                    const anchor = document.createElement("a");
                    anchor.className = "social-nav-link";
                    anchor.href = href;
                    if (platform.key !== "email") {
                        anchor.target = "_blank";
                        anchor.rel = "noopener noreferrer";
                    }
                    anchor.innerHTML = `
                        <span class="social-nav-link-left">
                            ${platform.icon}
                            <span>${platform.label}</span>
                        </span>
                        <span class="social-external-indicator" aria-hidden="true">&#8599;</span>
                    `;
                    li.appendChild(anchor);
                } else {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "social-nav-link unconfigured";
                    btn.setAttribute("aria-label", `${platform.label} (not configured yet)`);
                    btn.innerHTML = `
                        <span class="social-nav-link-left">
                            ${platform.icon}
                            <span>${platform.label}</span>
                        </span>
                    `;
                    btn.addEventListener("click", () => {
                        showToast(`${platform.label} link not configured yet. Add your URL in js/config.js.`);
                    });
                    li.appendChild(btn);
                }

                sidebarList.appendChild(li);
            });
        }

        if (contactGrid) {
            contactGrid.innerHTML = "";
            platforms.forEach((platform) => {
                const rawValue = (SOCIAL_LINKS[platform.key] || "").trim();

                if (rawValue) {
                    const href =
                        platform.key === "email" && !rawValue.startsWith("mailto:")
                            ? `mailto:${rawValue}`
                            : rawValue;

                    const anchor = document.createElement("a");
                    anchor.className = "contact-channel-item";
                    anchor.href = href;
                    if (platform.key !== "email") {
                        anchor.target = "_blank";
                        anchor.rel = "noopener noreferrer";
                    }
                    anchor.innerHTML = `
                        <span class="channel-info">
                            <span class="channel-icon">${platform.icon}</span>
                            <span class="channel-label">${platform.label}</span>
                        </span>
                        <span class="channel-status">Connected &#8599;</span>
                    `;
                    contactGrid.appendChild(anchor);
                } else {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "contact-channel-item";
                    btn.innerHTML = `
                        <span class="channel-info">
                            <span class="channel-icon">${platform.icon}</span>
                            <span class="channel-label">${platform.label}</span>
                        </span>
                        <span class="channel-status">Set in js/config.js</span>
                    `;
                    btn.addEventListener("click", () => {
                        showToast(`To activate ${platform.label}, add your link under SOCIAL_LINKS in js/config.js.`);
                    });
                    contactGrid.appendChild(btn);
                }
            });
        }
    }

    // ------------------------------------------------------------------------
    // 6. PROJECTS RENDERING & PREVIEW MODAL
    // ------------------------------------------------------------------------
    function createProjectMediaMarkup(project) {
        if (project.image && project.image.trim() !== "") {
            return `
                <div class="project-media">
                    <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} screenshot" loading="lazy">
                </div>
            `;
        }

        // Minimalist architectural wireframe preview for systems like Drivesphere
        return `
            <div class="project-media">
                <div class="project-system-preview">
                    <div class="system-preview-top">
                        <div class="system-window-dots" aria-hidden="true">
                            <span></span><span></span><span></span>
                        </div>
                        <span class="system-badge">SYSTEM ARCHITECTURE</span>
                    </div>
                    <div class="system-preview-graphic">
                        <div class="system-wireframe-grid">
                            <div class="wireframe-stat">
                                <span class="wireframe-stat-label">MODULE</span>
                                <span class="wireframe-stat-val">Fleet Ops</span>
                            </div>
                            <div class="wireframe-stat">
                                <span class="wireframe-stat-label">WORKFLOW</span>
                                <span class="wireframe-stat-val">Reservations</span>
                            </div>
                            <div class="wireframe-stat">
                                <span class="wireframe-stat-label">STATUS</span>
                                <span class="wireframe-stat-val">Featured</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createProjectCard(project, isFeaturedHighlight) {
        const article = document.createElement("article");
        article.className = `project-card${isFeaturedHighlight ? " featured-highlight" : ""}`;

        const tagsHtml = (project.tags || [])
            .map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`)
            .join("");

        let actionsHtml = "";

        if (project.githubUrl && project.githubUrl.trim() !== "") {
            actionsHtml += `
                <a href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-btn">
                    ${ICONS.github}
                    <span>Repository</span>
                </a>
            `;
        }

        if (project.liveUrl && project.liveUrl.trim() !== "") {
            actionsHtml += `
                <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-btn">
                    ${ICONS.external}
                    <span>Live Demo</span>
                </a>
            `;
        }

        // Always allow inspecting the project details / screenshot in the clean modal
        actionsHtml += `
            <button type="button" class="project-btn js-preview-project" data-project-id="${escapeHtml(project.id)}">
                ${ICONS.eye}
                <span>${project.image ? "View Screenshot" : "Project Details"}</span>
            </button>
        `;

        article.innerHTML = `
            ${createProjectMediaMarkup(project)}
            <div class="project-content">
                <div class="project-meta-top">
                    <span class="project-category">${escapeHtml(project.category || "Project")}</span>
                    ${project.featured ? `<span class="featured-tag">Featured</span>` : ""}
                </div>
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <div class="project-tags">${tagsHtml}</div>
                <div class="project-actions">${actionsHtml}</div>
            </div>
        `;

        const previewBtn = article.querySelector(".js-preview-project");
        if (previewBtn) {
            previewBtn.addEventListener("click", () => openProjectModal(project));
        }

        return article;
    }

    function renderProjects() {
        if (typeof PROJECTS_DATA === "undefined" || !Array.isArray(PROJECTS_DATA)) return;

        const featuredGrid = document.getElementById("featuredProjectsGrid");
        const projectsGrid = document.getElementById("projectsGrid");
        const countBadge = document.getElementById("manualProjectsCount");

        if (countBadge) {
            countBadge.textContent = `${PROJECTS_DATA.length} Project${PROJECTS_DATA.length === 1 ? "" : "s"}`;
        }

        if (featuredGrid) {
            featuredGrid.innerHTML = "";
            const featuredItems = PROJECTS_DATA.filter((p) => p.featured).slice(0, 2);
            featuredItems.forEach((project) => {
                featuredGrid.appendChild(createProjectCard(project, false));
            });
        }

        if (projectsGrid) {
            projectsGrid.innerHTML = "";
            PROJECTS_DATA.forEach((project, index) => {
                // Highlight Drivesphere (first featured project) across 2 columns on desktop
                const isHighlight = index === 0 && project.featured;
                projectsGrid.appendChild(createProjectCard(project, isHighlight));
            });
        }
    }

    // ------------------------------------------------------------------------
    // 7. GITHUB PUBLIC REPOSITORIES INTEGRATION
    // ------------------------------------------------------------------------
    async function initGitHubIntegration() {
        const container = document.getElementById("githubReposContainer");
        const statusBadge = document.getElementById("githubStatusBadge");
        if (!container || typeof GITHUB_CONFIG === "undefined") return;

        const username = (GITHUB_CONFIG.username || "").trim();

        if (!username) {
            if (statusBadge) statusBadge.textContent = "Awaiting Username";
            container.innerHTML = `
                <div class="github-empty-state">
                    <div class="github-empty-text">
                        <h4>GitHub Integration Ready</h4>
                        <p>Set <code>GITHUB_CONFIG.username</code> in <code>js/config.js</code> to automatically display your public GitHub repositories here while filtering out duplicates.</p>
                    </div>
                </div>
            `;
            return;
        }

        if (statusBadge) statusBadge.textContent = `@${username}`;
        container.innerHTML = `
            <div class="github-empty-state">
                <div class="github-empty-text">
                    <h4>Loading repositories from @${escapeHtml(username)}...</h4>
                    <p>Fetching public repositories via the GitHub API.</p>
                </div>
            </div>
        `;

        try {
            const response = await fetch(
                `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=15`,
                {
                    headers: { Accept: "application/vnd.github.v3+json" }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API responded with status ${response.status}`);
            }

            const repos = await response.json();
            if (!Array.isArray(repos)) {
                throw new Error("Invalid repository payload");
            }

            // Build exclusion set from manual projects and GITHUB_CONFIG.excludeRepos
            const excludedNames = new Set(
                (GITHUB_CONFIG.excludeRepos || []).map((name) => name.toLowerCase().trim())
            );

            if (typeof PROJECTS_DATA !== "undefined" && Array.isArray(PROJECTS_DATA)) {
                PROJECTS_DATA.forEach((proj) => {
                    if (proj.id) excludedNames.add(proj.id.toLowerCase());
                    if (proj.title) {
                        excludedNames.add(proj.title.toLowerCase());
                        // Also add first word slug (e.g. "drivesphere")
                        const firstToken = proj.title.split(/[\s—-]+/)[0].toLowerCase();
                        if (firstToken) excludedNames.add(firstToken);
                    }
                });
            }

            const filtered = repos
                .filter((repo) => {
                    if (GITHUB_CONFIG.excludeForks && repo.fork) return false;
                    const repoName = (repo.name || "").toLowerCase();
                    return !excludedNames.has(repoName);
                })
                .slice(0, GITHUB_CONFIG.maxRepos || 6);

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="github-empty-state">
                        <div class="github-empty-text">
                            <h4>No Additional Public Repositories Found</h4>
                            <p>Connected to <code>@${escapeHtml(username)}</code>. New public repositories pushed to GitHub will appear here automatically.</p>
                        </div>
                    </div>
                `;
                return;
            }

            const grid = document.createElement("div");
            grid.className = "github-repos-grid";

            filtered.forEach((repo) => {
                const card = document.createElement("a");
                card.className = "repo-card";
                card.href = repo.html_url;
                card.target = "_blank";
                card.rel = "noopener noreferrer";

                const updatedDate = repo.updated_at
                    ? new Date(repo.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric"
                      })
                    : "";

                card.innerHTML = `
                    <div>
                        <h4 class="repo-name">${escapeHtml(repo.name)}</h4>
                        <p class="repo-desc">${escapeHtml(repo.description || "Public repository on GitHub.")}</p>
                    </div>
                    <div class="repo-meta">
                        <span>${escapeHtml(repo.language || "Code")}</span>
                        <span>&#9733; ${Number(repo.stargazers_count || 0)} &bull; ${escapeHtml(updatedDate)}</span>
                    </div>
                `;
                grid.appendChild(card);
            });

            container.innerHTML = "";
            container.appendChild(grid);
        } catch (error) {
            if (statusBadge) statusBadge.textContent = "API Offline";
            container.innerHTML = `
                <div class="github-empty-state">
                    <div class="github-empty-text">
                        <h4>GitHub Repositories Currently Unavailable</h4>
                        <p>Could not reach GitHub API right now (${escapeHtml(error.message)}). Curated projects above remain available.</p>
                    </div>
                </div>
            `;
        }
    }

    // ------------------------------------------------------------------------
    // 8. SKILLS & BLOG RENDERING
    // ------------------------------------------------------------------------
    function renderSkills() {
        const container = document.getElementById("skillsContainer");
        if (!container || typeof SKILLS_DATA === "undefined" || !Array.isArray(SKILLS_DATA)) return;

        container.innerHTML = "";
        SKILLS_DATA.forEach((group) => {
            const card = document.createElement("div");
            card.className = "skill-category-card";

            const itemsHtml = (group.items || [])
                .map(
                    (item) => `
                    <div class="skill-row">
                        <div class="skill-row-header">
                            <span class="skill-name">${escapeHtml(item.name)}</span>
                            ${item.level ? `<span class="skill-badge">${escapeHtml(item.level)}</span>` : ""}
                        </div>
                        ${item.description ? `<p class="skill-desc">${escapeHtml(item.description)}</p>` : ""}
                    </div>
                `
                )
                .join("");

            card.innerHTML = `
                <h3 class="skill-cat-title">${escapeHtml(group.category)}</h3>
                <p class="skill-cat-subtitle">${escapeHtml(group.subtitle || "")}</p>
                <div class="skill-items-list">${itemsHtml}</div>
            `;

            container.appendChild(card);
        });
    }

    function renderBlog() {
        const container = document.getElementById("blogContainer");
        if (!container || typeof BLOG_DATA === "undefined" || !Array.isArray(BLOG_DATA)) return;

        container.innerHTML = "";
        BLOG_DATA.forEach((post) => {
            const article = document.createElement("article");
            article.className = "blog-card";

            article.innerHTML = `
                <div>
                    <div class="blog-meta">
                        <span>${escapeHtml(post.date)} &bull; ${escapeHtml(post.readTime)}</span>
                        <span class="blog-status">${escapeHtml(post.status)}</span>
                    </div>
                    <h3 class="blog-title">${escapeHtml(post.title)}</h3>
                    <p class="blog-excerpt">${escapeHtml(post.excerpt)}</p>
                </div>
                <button type="button" class="blog-read-btn">
                    <span>Read Note Summary</span>
                    <span aria-hidden="true">&rarr;</span>
                </button>
            `;

            const readBtn = article.querySelector(".blog-read-btn");
            if (readBtn) {
                readBtn.addEventListener("click", () => {
                    openProjectModal({
                        title: post.title,
                        category: `${post.date} • ${post.status}`,
                        description: post.excerpt,
                        tags: ["BSIT Learning Log", "Hardware & Code", post.readTime],
                        image: ""
                    });
                });
            }

            container.appendChild(article);
        });
    }

    // ------------------------------------------------------------------------
    // 9. MODAL DIALOG CONTROLS
    // ------------------------------------------------------------------------
    function openProjectModal(item) {
        const modal = document.getElementById("projectModal");
        const titleEl = document.getElementById("modalTitle");
        const categoryEl = document.getElementById("modalCategory");
        const descEl = document.getElementById("modalDescription");
        const imgWrapper = document.getElementById("modalImageWrapper");
        const imgEl = document.getElementById("modalImage");
        const tagsEl = document.getElementById("modalTags");

        if (!modal) return;

        if (titleEl) titleEl.textContent = item.title || "";
        if (categoryEl) categoryEl.textContent = item.category || "Preview";
        if (descEl) descEl.textContent = item.description || "";

        if (imgWrapper && imgEl) {
            if (item.image && item.image.trim() !== "") {
                imgEl.src = item.image;
                imgEl.alt = `${item.title} preview`;
                imgWrapper.hidden = false;
            } else {
                imgEl.src = "";
                imgWrapper.hidden = true;
            }
        }

        if (tagsEl) {
            tagsEl.innerHTML = (item.tags || [])
                .map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`)
                .join("");
        }

        modal.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function initModal() {
        const modal = document.getElementById("projectModal");
        const closeBtn = document.getElementById("modalCloseBtn");
        if (!modal) return;

        const closeModal = () => {
            modal.hidden = true;
            document.body.style.overflow = "";
        };

        if (closeBtn) closeBtn.addEventListener("click", closeModal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.hidden) {
                closeModal();
            }
        });
    }

    // ------------------------------------------------------------------------
    // 10. CONTACT FORM HANDLER
    // ------------------------------------------------------------------------
    function initContactForm() {
        const form = document.getElementById("contactForm");
        const feedback = document.getElementById("formFeedback");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = (form.elements.name?.value || "").trim();
            const email = (form.elements.email?.value || "").trim();
            const message = (form.elements.message?.value || "").trim();

            if (!name || !email || !message) {
                if (feedback) {
                    feedback.textContent = "Please complete all fields before sending.";
                }
                return;
            }

            const configuredEmail =
                typeof SOCIAL_LINKS !== "undefined" && SOCIAL_LINKS.email
                    ? SOCIAL_LINKS.email.trim()
                    : "";

            if (configuredEmail) {
                const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
                window.location.href = `mailto:${configuredEmail}?subject=${subject}&body=${body}`;
            }

            if (feedback) {
                feedback.textContent = configuredEmail
                    ? "Opening your email client..."
                    : "Message noted! (Configure SOCIAL_LINKS.email in js/config.js to enable direct email routing.)";
            }

            form.reset();
        });
    }

    // ------------------------------------------------------------------------
    // UTILITY: HTML ESCAPING
    // ------------------------------------------------------------------------
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // ------------------------------------------------------------------------
    // LIVE WEBSITE VIEWERS TRACKER (PHP Heartbeat + Cross-Tab Sync)
    // ------------------------------------------------------------------------
    function initLiveViewers() {
        const countEl = document.getElementById("liveViewerCount");
        const labelEl = document.getElementById("liveViewerLabel");
        const avatarsContainer = document.getElementById("liveViewerAvatars");

        if (!countEl || !labelEl || !avatarsContainer) return;

        const avatars = Array.from(avatarsContainer.querySelectorAll(".viewer-avatar"));
        const STORAGE_KEY = "kc_portfolio_active_tabs";
        const TAB_TTL_MS = 18000;

        let clientId = "";
        try {
            clientId = sessionStorage.getItem("kc_viewer_cid") || "";
            if (!clientId) {
                clientId = "v_" + Math.random().toString(36).slice(2, 10) + "_" + Date.now().toString(36);
                sessionStorage.setItem("kc_viewer_cid", clientId);
            }
        } catch (e) {
            clientId = "v_fallback_" + Math.floor(Math.random() * 100000);
        }

        let serverRealCount = 1;

        function getLocalActiveTabCount() {
            try {
                const now = Date.now();
                const raw = localStorage.getItem(STORAGE_KEY);
                const map = raw ? JSON.parse(raw) : {};

                Object.keys(map).forEach((id) => {
                    if (now - map[id] > TAB_TTL_MS) {
                        delete map[id];
                    }
                });

                map[clientId] = now;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
                return Math.max(1, Object.keys(map).length);
            } catch (e) {
                return 1;
            }
        }

        function removeLocalTab() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return;
                const map = JSON.parse(raw);
                delete map[clientId];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
            } catch (e) {
                // Ignore storage errors
            }
        }

        function renderViewerUI(totalViewers) {
            const safeCount = Math.max(1, totalViewers);
            countEl.textContent = String(safeCount);
            labelEl.textContent = safeCount === 1 ? "person viewing now" : "people viewing now";

            const visibleAvatars = Math.min(safeCount, avatars.length);
            avatars.forEach((avatar, idx) => {
                if (idx < visibleAvatars) {
                    avatar.removeAttribute("hidden");
                    avatar.classList.remove("is-hidden");
                    avatar.style.display = "inline-flex";
                } else {
                    avatar.setAttribute("hidden", "");
                    avatar.classList.add("is-hidden");
                    avatar.style.display = "none";
                }
            });
        }

        function updateCombinedCount() {
            const localTabs = getLocalActiveTabCount();
            const realVisitors = Math.max(serverRealCount, localTabs);
            renderViewerUI(realVisitors);
        }

        async function sendServerHeartbeat(action = "1") {
            try {
                const res = await fetch(
                    `index.php?viewer_ping=${encodeURIComponent(action)}&cid=${encodeURIComponent(clientId)}`,
                    { cache: "no-store", headers: { Accept: "application/json" } }
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data && typeof data.realActive === "number") {
                        serverRealCount = Math.max(1, data.realActive);
                        updateCombinedCount();
                    }
                }
            } catch (e) {
                // Fallback gracefully to local tab tracking if offline
                updateCombinedCount();
            }
        }

        // Initial render and immediate server heartbeat
        updateCombinedCount();
        sendServerHeartbeat("1");

        // Periodic heartbeat every 5 seconds for live responsiveness
        const heartbeatTimer = setInterval(() => {
            sendServerHeartbeat("1");
        }, 5000);

        // Refresh immediately when user switches back to tab
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                sendServerHeartbeat("1");
            }
        });

        // Instant cross-tab updates when another tab opens or closes
        window.addEventListener("storage", (e) => {
            if (e.key === STORAGE_KEY) {
                updateCombinedCount();
            }
        });

        // Cleanly unregister tab on close/navigation
        window.addEventListener("pagehide", () => {
            clearInterval(heartbeatTimer);
            removeLocalTab();
            if (navigator.sendBeacon) {
                navigator.sendBeacon(
                    `index.php?viewer_ping=leave&cid=${encodeURIComponent(clientId)}`
                );
            }
        });
    }

    // ------------------------------------------------------------------------
    // REAL EMAIL OTP VERIFICATION INTEGRATION
    // ------------------------------------------------------------------------
    function initOtpVerification() {
        const emailInput = document.getElementById("senderEmail");
        const btnSendOtp = document.getElementById("btnSendOtp");
        const btnSendOtpText = document.getElementById("btnSendOtpText");
        const otpPanel = document.getElementById("otpPanel");
        const otpCodeInput = document.getElementById("otpCodeInput");
        const btnVerifyOtp = document.getElementById("btnVerifyOtp");
        const otpStatusBanner = document.getElementById("otpStatusBanner");
        const otpStatusTitle = document.getElementById("otpStatusTitle");
        const otpStatusDesc = document.getElementById("otpStatusDesc");
        const btnSubmitMessage = document.getElementById("btnSubmitMessage");
        const submitNotice = document.getElementById("submitButtonNotice");
        const csrfTokenInput = document.getElementById("contactCsrfToken");
        const expiryHint = document.getElementById("otpExpiryHint");

        if (!emailInput || !btnSendOtp || !btnVerifyOtp) {
            return; // Not on Step 2 of contact page
        }

        let cooldownSeconds = 0;
        let cooldownTimer = null;
        let expirySeconds = 300;
        let expiryTimer = null;
        let verifiedEmail = "";

        function showStatus(type, title, desc) {
            if (!otpStatusBanner) return;
            otpStatusBanner.className = `otp-status-banner status-${type}`;
            otpStatusTitle.textContent = title;
            otpStatusDesc.textContent = desc;
            otpStatusBanner.style.display = "flex";
        }

        function hideStatus() {
            if (otpStatusBanner) {
                otpStatusBanner.style.display = "none";
            }
        }

        function startCooldown(sec) {
            cooldownSeconds = sec;
            btnSendOtp.disabled = true;
            btnSendOtpText.textContent = `RESEND (${cooldownSeconds}s)`;

            if (cooldownTimer) clearInterval(cooldownTimer);
            cooldownTimer = setInterval(() => {
                cooldownSeconds -= 1;
                if (cooldownSeconds <= 0) {
                    clearInterval(cooldownTimer);
                    btnSendOtp.disabled = false;
                    btnSendOtpText.textContent = "RESEND CODE";
                } else {
                    btnSendOtpText.textContent = `RESEND (${cooldownSeconds}s)`;
                }
            }, 1000);
        }

        function startExpiryCountdown(sec) {
            expirySeconds = sec;
            if (expiryTimer) clearInterval(expiryTimer);
            expiryTimer = setInterval(() => {
                expirySeconds -= 1;
                if (expirySeconds <= 0) {
                    clearInterval(expiryTimer);
                    if (expiryHint) expiryHint.textContent = "Code expired";
                    showStatus("error", "Code Expired", "Your 6-digit code has expired. Please click Resend Code to request a new one.");
                } else {
                    const min = Math.floor(expirySeconds / 60);
                    const s = expirySeconds % 60;
                    if (expiryHint) {
                        expiryHint.textContent = `Expires in ${min}:${s < 10 ? "0" + s : s}`;
                    }
                }
            }, 1000);
        }

        // When the user changes their email, invalidate verification immediately
        emailInput.addEventListener("input", () => {
            const currentVal = emailInput.value.trim().toLowerCase();
            if (verifiedEmail !== "" && currentVal !== verifiedEmail) {
                verifiedEmail = "";
                emailInput.readOnly = false;
                if (btnSubmitMessage) btnSubmitMessage.disabled = true;
                if (submitNotice) {
                    submitNotice.textContent = "Verify your email first to enable message submission.";
                }
                showStatus("info", "Email Changed", "You modified your email address. Please request and enter a new verification code.");
            }
        });

        // SEND OTP CLICK
        btnSendOtp.addEventListener("click", async () => {
            const email = emailInput.value.trim();
            if (!email || !email.includes("@") || !email.includes(".")) {
                showStatus("error", "Invalid Email", "Please enter a valid email address before requesting a code.");
                emailInput.focus();
                return;
            }

            hideStatus();
            btnSendOtp.disabled = true;
            btnSendOtpText.textContent = "SENDING...";

            const formData = new FormData();
            formData.append("otp_action", "send");
            formData.append("email", email);
            formData.append("csrf_token", csrfTokenInput ? csrfTokenInput.value : "");

            try {
                const res = await fetch("contact.php?ajax_otp=1", {
                    method: "POST",
                    body: formData,
                    headers: { Accept: "application/json" }
                });
                const data = await res.json();

                if (data.success) {
                    showStatus("success", "Code Sent to Inbox", `We sent a real 6-digit verification code to ${email}. Check your inbox (or spam folder).`);
                    if (otpPanel) otpPanel.style.display = "flex";
                    if (otpCodeInput) {
                        otpCodeInput.value = "";
                        otpCodeInput.focus();
                    }
                    startCooldown(data.cooldown || 60);
                    startExpiryCountdown(300);
                } else {
                    btnSendOtp.disabled = false;
                    btnSendOtpText.textContent = "SEND CODE";
                    showStatus("error", "Sending Failed", data.error || "Unable to send verification code. Please check your connection.");
                    if (data.cooldown && data.cooldown > 0) {
                        startCooldown(data.cooldown);
                    }
                }
            } catch (err) {
                btnSendOtp.disabled = false;
                btnSendOtpText.textContent = "SEND CODE";
                showStatus("error", "Network Error", "Could not reach the server. Please try again.");
            }
        });

        // VERIFY OTP CLICK
        btnVerifyOtp.addEventListener("click", async () => {
            const email = emailInput.value.trim();
            const code = (otpCodeInput ? otpCodeInput.value : "").trim();

            if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
                showStatus("error", "Invalid Code Format", "Please enter the exact 6-digit code sent to your email.");
                if (otpCodeInput) otpCodeInput.focus();
                return;
            }

            btnVerifyOtp.disabled = true;
            btnVerifyOtp.innerHTML = "<span>VERIFYING...</span>";

            const formData = new FormData();
            formData.append("otp_action", "verify");
            formData.append("email", email);
            formData.append("otp_code", code);
            formData.append("csrf_token", csrfTokenInput ? csrfTokenInput.value : "");

            try {
                const res = await fetch("contact.php?ajax_otp=1", {
                    method: "POST",
                    body: formData,
                    headers: { Accept: "application/json" }
                });
                const data = await res.json();

                btnVerifyOtp.disabled = false;
                btnVerifyOtp.innerHTML = "<span>VERIFY CODE</span>";

                if (data.success) {
                    verifiedEmail = email.toLowerCase();
                    emailInput.readOnly = true;
                    if (otpPanel) otpPanel.style.display = "none";
                    if (btnSendOtp) btnSendOtp.style.display = "none";
                    if (btnSubmitMessage) btnSubmitMessage.disabled = false;
                    if (submitNotice) {
                        submitNotice.textContent = "Email verified! You can now submit your message.";
                    }
                    showStatus("success", "Email Verified Successfully", "Your email address has been verified. You can now send your message.");
                    if (expiryTimer) clearInterval(expiryTimer);
                    if (cooldownTimer) clearInterval(cooldownTimer);
                } else {
                    showStatus("error", "Verification Failed", data.error || "Incorrect code. Please try again.");
                }
            } catch (err) {
                btnVerifyOtp.disabled = false;
                btnVerifyOtp.innerHTML = "<span>VERIFY CODE</span>";
                showStatus("error", "Network Error", "Could not reach the server to verify. Please try again.");
            }
        });

        // Form submission interceptor: friendly reminder if unverified
        const stepTwoForm = document.getElementById("stepTwoContactForm");
        if (stepTwoForm) {
            stepTwoForm.addEventListener("submit", (e) => {
                const currentEmail = emailInput.value.trim().toLowerCase();
                if (!verifiedEmail || verifiedEmail !== currentEmail) {
                    e.preventDefault();
                    showStatus("error", "Real Email Required", "Add your real email cutie 😉 (and verify it with the 6-digit code sent to your inbox first)");
                    if (otpPanel && otpPanel.style.display !== "none" && otpCodeInput) {
                        otpCodeInput.focus();
                    } else {
                        btnSendOtp.focus();
                    }
                    return false;
                }
            });
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZE ON DOM READY
    // ------------------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        initNavigation();
        renderPersonalInfo();
        renderSocialLinks();
        renderProjects();
        renderSkills();
        renderBlog();
        initGitHubIntegration();
        initModal();
        initContactForm();
        initOtpVerification();
        initLiveViewers();
    });
})();
