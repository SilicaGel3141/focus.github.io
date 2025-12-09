/**
 * ふぉーかす！ - Main JavaScript
 * モダンなインタラクションとアニメーションを実装
 */

// ===================================
// DOM Ready
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initSharedContent(); // 共通コンテンツの初期化
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initDotBackground();
    initCounterAnimation();
    initBackToTop();
});

// ===================================
// Shared Content
// ===================================
function initSharedContent() {
    if (typeof SITE_DATA === 'undefined') return;

    // About Description
    const aboutDesc = document.getElementById('shared-about-description');
    if (aboutDesc && SITE_DATA.about && SITE_DATA.about.description) {
        aboutDesc.innerHTML = SITE_DATA.about.description;
    }

    // Footer Copyright
    const footerCopyright = document.getElementById('shared-footer-copyright');
    if (footerCopyright && SITE_DATA.footer && SITE_DATA.footer.copyright) {
        footerCopyright.innerHTML = SITE_DATA.footer.copyright;
    }

    // News List
    initNews();

    // Members List
    initMembers();
}

function initNews() {
    const newsContainer = document.getElementById('shared-news-container');
    if (!newsContainer || !SITE_DATA.news) return;

    const limit = parseInt(newsContainer.dataset.limit) || 0; // 0 means all
    const newsItems = limit > 0 ? SITE_DATA.news.slice(0, limit) : SITE_DATA.news;

    let html = '';
    newsItems.forEach(item => {
        const featuredClass = item.featured ? 'featured' : '';
        html += `
        <article class="news-card ${featuredClass}">
            <div class="news-image">
                <div class="news-placeholder"></div>
            </div>
            <div class="news-content">
                <span class="news-date">${item.date}</span>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${item.excerpt}</p>
                <a href="${item.link}" class="news-link">${item.title === '新企画「ハードコアサバイバル」始動！' ? '動画を見る' : '詳細へ'}</a>
            </div>
        </article>
        `;
    });
    newsContainer.innerHTML = html;
}

function initMembers() {
    const membersContainer = document.getElementById('shared-members-container');
    if (!membersContainer || !SITE_DATA.members) return;

    // もし既存のgridクラスがあれば削除し、新しいレイアウト用クラスを付与
    membersContainer.classList.remove('members-grid');
    membersContainer.classList.add('members-inline-container');

    // HTML構造の生成
    // 1. セレクター（上部アイコン一覧）
    let selectorHtml = '<div class="member-selector">';
    SITE_DATA.members.forEach((member, index) => {
        selectorHtml += `
            <button class="member-select-btn" onclick="updateMemberDetail(${index})" aria-label="${member.name}">
                <div class="select-btn-image">
                    <img src="${member.image}" alt="${member.name}">
                </div>
                <span class="select-btn-name">${member.name}</span>
            </button>
        `;
    });
    selectorHtml += '</div>';

    // 2. 詳細ビュー（下部メイン表示）
    // 矢印ボタンを含むコンテナ構造に変更
    const detailHtml = `
        <div class="member-detail-container">
            <button class="nav-arrow prev" onclick="cycleMember(-1)" aria-label="前のメンバーへ">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            <div class="member-detail-view" id="member-detail-view">
                <div class="detail-content-inner" id="detail-content-inner">
                    <div class="detail-image-wrapper">
                        <img id="detail-img" src="" alt="">
                    </div>
                    <div class="detail-content-wrapper">
                        <h3 id="detail-name" class="detail-name"></h3>
                        <p id="detail-role" class="detail-role"></p>
                        <div id="detail-text" class="detail-text"></div>
                    </div>
                </div>
            </div>

            <button class="nav-arrow next" onclick="cycleMember(1)" aria-label="次のメンバーへ">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
        </div>
    `;

    membersContainer.innerHTML = selectorHtml + detailHtml;

    // 初期表示（1人目）
    // グローバル変数で現在のインデックスを保持
    window.currentMemberIndex = 0;
    updateMemberDetail(0, 'fade');
}

// メンバー切り替え（前後）
window.cycleMember = function (direction) {
    if (!SITE_DATA.members) return;

    let newIndex = window.currentMemberIndex + direction;
    const count = SITE_DATA.members.length;

    // ループ処理
    if (newIndex >= count) newIndex = 0;
    if (newIndex < 0) newIndex = count - 1;

    const animDir = direction > 0 ? 'next' : 'prev';
    updateMemberDetail(newIndex, animDir);
};

// 詳細更新
window.updateMemberDetail = function (index, direction = 'fade') {
    if (!SITE_DATA.members || !SITE_DATA.members[index]) return;

    window.currentMemberIndex = index;
    const member = SITE_DATA.members[index];
    const contentInner = document.getElementById('detail-content-inner');
    const buttons = document.querySelectorAll('.member-select-btn');

    // 現在のコンテンツをスライドアウト
    let exitClass = '';
    let enterClass = '';

    if (direction === 'next') { // 右へ進む（左へ消え、右から出る）
        exitClass = 'slide-out-left';
        enterClass = 'slide-in-right';
    } else if (direction === 'prev') { // 左へ戻る（右へ消え、左から出る）
        exitClass = 'slide-out-right';
        enterClass = 'slide-in-left';
    } else {
        exitClass = 'fade-out';
        enterClass = 'fade-in';
    }

    contentInner.className = 'detail-content-inner ' + exitClass;

    // 少し待ってから内容更新＆スライドイン
    setTimeout(() => {
        // ボタンのアクティブ状態更新
        buttons.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('active');
                btn.style.setProperty('--active-color', member.color);
            } else {
                btn.classList.remove('active');
            }
        });

        // 内容更新
        document.getElementById('detail-img').src = member.image;
        document.getElementById('detail-img').alt = member.name;

        const nameEl = document.getElementById('detail-name');
        nameEl.textContent = member.name;
        nameEl.style.color = member.color || 'var(--text-primary)';

        document.getElementById('detail-role').textContent = member.role;
        document.getElementById('detail-text').innerHTML = member.detail;

        // クラスリセットしてインアニメーション
        contentInner.className = 'detail-content-inner ' + enterClass;

        // アニメーション完了後にクリーンアップ
        setTimeout(() => {
            contentInner.classList.remove(enterClass);
        }, 300);

    }, 200);
};

// ===================================
// Loader
// ===================================
function initLoader() {
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    });
}

// ===================================
// Navbar
// ===================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // スクロール時のナビゲーション変化
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // モバイルメニュートグル
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // リンククリック時にメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // アクティブリンクの更新
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll(
        '.section-header, .about-text, .about-visual, .member-card, .news-card, .contact-content'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });

    // CSS追加
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .member-card.animate-element,
        .news-card.animate-element {
            transition-delay: calc(var(--index, 0) * 0.1s);
        }
    `;
    document.head.appendChild(style);

    // カードにインデックスを設定
    document.querySelectorAll('.member-card, .news-card').forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
}

// ===================================
// Dot Background (Canvas Animation)
// ===================================
// ===================================
// Dot Background (Canvas Animation)
// ===================================
function initDotBackground() {
    const canvas = document.getElementById('dotCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let dots = [];
    let zoomLevel = 1.0; // ズーム倍率

    // メンバーカラー（CSS変数と一致させる）
    const colors = [
        '#FF5E5E', // Red
        '#F0E68C', // Yellow/White
        '#FF9F43', // Orange
        '#48DBFB'  // Blue
    ];

    const resizeBox = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createDots();
    };

    const createDots = () => {
        dots = [];
        const spacing = 7; // 密度調整
        const cols = Math.ceil(canvas.width / spacing);
        const rows = Math.ceil(canvas.height / spacing);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // 間引き（確率でスキップ）
                if (Math.random() > 0.8) continue;

                // 行ごとのオフセット
                const x = c * spacing + (r % 2 === 0 ? 0 : spacing / 2);
                const y = r * spacing;

                dots.push({
                    x: x,
                    y: y,
                    originalX: x, // 初期位置保存
                    originalY: y, // 初期位置保存
                    size: Math.random() * 3 + 1.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0,
                    maxOpacity: 0.2 + Math.random() * 0.4,
                    speed: 0.01 + Math.random() * 0.03,
                    phase: Math.random() * Math.PI * 2,
                    offset: Math.random() * 100
                });
            }
        }
    };

    // スクロールイベントでズーム倍率とアニメーションを制御
    const heroScrollContainer = document.querySelector('.hero-scroll-container');
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const adventureText = document.getElementById('adventure-text');
    const glassShapes = document.querySelector('.glass-shapes'); // 追加

    // アニメーション状態
    let currentScrollProgress = 0;

    window.addEventListener('scroll', () => {
        if (!heroScrollContainer) return;

        const containerTop = heroScrollContainer.offsetTop;
        const containerHeight = heroScrollContainer.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.pageYOffset;

        // コンテナ内でのスクロール進捗 (0.0 ～ 1.0)
        // コンテナの開始位置から、コンテナの高さ - 画面の高さ 分だけスクロールできる
        let progress = (scrollY - containerTop) / (containerHeight - windowHeight);
        progress = Math.max(0, Math.min(1, progress)); // Clamp 0-1
        currentScrollProgress = progress;

        // Phase 1: タップ演出 (0.0 - 0.15)
        // 「冒険」テキストが沈んで(scaleダウン)、弾む(scaleアップ)動き
        if (progress < 0.2) {
            // 0.0 -> 0.1 で 1.0 -> 0.8 (沈む)
            // 0.1 -> 0.2 で 0.8 -> 1.0 (戻る)
            let scale = 1.0;
            const seed = progress / 0.2; // 0.0 - 1.0 in this phase
            if (seed < 0.5) {
                scale = 1.0 - (seed * 0.4); // 1.0 -> 0.8
            } else {
                scale = 0.8 + ((seed - 0.5) * 0.4); // 0.8 -> 1.0
            }
            if (adventureText) {
                adventureText.style.transform = `scale(${scale})`;
                adventureText.style.display = 'inline-block'; // transform適用に必要
            }
        } else {
            if (adventureText) adventureText.style.transform = 'scale(1.0)';
        }

        // Phase 2: ダイブ演出 (0.15 - 1.0)
        // 背景ズーム & コンテンツフェードアウト
        if (progress > 0.15) {
            const diveProgress = (progress - 0.15) / 2; // 0.0 - 1.0 normalized

            // ズーム: 1.0 -> 10.0 (かなり大きく)
            // 指数関数的に加速させるとスピード感が出る
            zoomLevel = 1.0 + Math.pow(diveProgress, 2) * 20.0;

            // コンテンツフェードアウト: ズーム開始とともに消す
            // 0.0 -> 0.5 の間で opacity 1 -> 0
            const opacity = Math.max(0, 1 - (diveProgress * 3.0));
            if (heroContent) {
                heroContent.style.opacity = opacity;
                // 拡大しながら消える
                const contentScale = 1.0 + diveProgress * 2.0;
                heroContent.style.transform = `scale(${contentScale})`;
            }

            // Glass Shapes もズーム
            if (glassShapes) {
                // 背景の一部なのでCanvasと同じくらい拡大するが、ボケているので少し控えめでも良い
                // ここではCanvasと同期させる
                glassShapes.style.transform = `scale(${zoomLevel})`;
                // 拡大しすぎると粗くなるが、glass-shapeはCSSグラデーションなので大丈夫
                // ただ非常に大きくなるので、ある程度透明度を下げる演出を入れても良いかもしれない
                // 今回はシンプルに拡大のみ
            }

            if (scrollIndicator) {
                scrollIndicator.style.opacity = Math.max(0, 1 - diveProgress * 10);
            }
        } else {
            zoomLevel = 1.0;
            if (heroContent) {
                heroContent.style.opacity = 1;
                heroContent.style.transform = 'scale(1)';
            }
            if (glassShapes) {
                glassShapes.style.transform = 'scale(1)';
            }
            if (scrollIndicator) scrollIndicator.style.opacity = 1;
        }

    }, { passive: true });

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバス全体クリア

        // ズーム適用のためのコンテキスト保存
        ctx.save();

        // 画面中央を基準にズーム
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.translate(centerX, centerY);
        ctx.scale(zoomLevel, zoomLevel);
        ctx.translate(-centerX, -centerY);

        const time = Date.now() * 0.001;

        for (const dot of dots) {
            // 点滅アニメーション
            let blink = (Math.sin(time * dot.speed * 10 + dot.offset) + 1) / 2;
            blink = Math.pow(blink, 0.6);

            dot.opacity = blink * dot.maxOpacity;

            if (dot.opacity <= 0) continue;

            // 描画（座標は変換済みコンテキストにより自動的にズームされる）
            // ただし、ズームすると描画範囲外のドットも計算されるため、
            // 厳密にはカリング（画面外描画スキップ）を入れるとパフォーマンスが良いが、
            // 本件のドット数ならこのままでも動作する想定。

            ctx.globalAlpha = dot.opacity;
            ctx.fillStyle = dot.color;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // スクエアアニメーション（こちらもズーム影響下）
        manageSquares(ctx, canvas, time);

        // コンテキスト復元（次のフレームのclearRectのため）
        ctx.restore();

        requestAnimationFrame(animate);
    };

    // スクエア管理用の変数
    let squares = [];
    let lastSquareTime = 0;

    const manageSquares = (ctx, canvas, time) => {
        // 新しいスクエアの生成
        if (time - lastSquareTime > 0.2) {
            if (squares.length < 40) {
                // 生成座標は「canvas座標系」で生成するが、
                // ズームされるため、画面中央付近に生成しないと
                // 拡大時に画面外すぎて見えなくなる可能性がある。
                // ひとまず画面全体にランダム配置し、ズームで広がるに任せる。
                squares.push(createSquare(canvas));
                lastSquareTime = time;
            }
        }

        for (let i = squares.length - 1; i >= 0; i--) {
            const sq = squares[i];
            sq.life += 0.003;

            let alpha = 0;
            if (sq.life < 0.2) {
                alpha = sq.life * 5;
            } else if (sq.life > 0.8) {
                alpha = (1 - sq.life) * 5;
            } else {
                alpha = 1;
            }

            if (sq.life >= 1) {
                squares.splice(i, 1);
                continue;
            }

            const currentSize = sq.size * (0.8 + 0.2 * Math.sin(sq.life * Math.PI));

            ctx.globalAlpha = alpha * 0.15;
            ctx.strokeStyle = sq.color;
            ctx.lineWidth = 5;
            ctx.strokeRect(sq.x - currentSize / 2, sq.y - currentSize / 2, currentSize, currentSize);
        }
    };

    const createSquare = (canvas) => {
        // ズーム時は、「現在画面に見えている範囲」を中心に生成する
        // ズームレベルが大きいほど、生成範囲は中央に寄る
        // 可視領域の幅 = canvas.width / zoomLevel
        const visibleWidth = canvas.width / zoomLevel;
        const visibleHeight = canvas.height / zoomLevel;

        // 中心からのオフセット範囲
        const offsetX = (Math.random() - 0.5) * visibleWidth;
        const offsetY = (Math.random() - 0.5) * visibleHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        return {
            x: centerX + offsetX,
            y: centerY + offsetY,
            size: 50 + Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0
        };
    };

    // リサイズ処理
    window.addEventListener('resize', () => {
        resizeBox();
    });

    // 初期化
    resizeBox();
    animate();
}

// ===================================
// Counter Animation
// ===================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===================================
// Utility Functions
// ===================================

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
