/**
 * Launchpad App — main orchestrator
 */
(function () {
  const CHAPTERS = [
    { id: 1, title: 'Where Are We?', subtitle: 'The moment we\'re in', time: '~10 min', render: window.Chapter1.render },
    { id: 2, title: 'What is AI?', subtitle: 'No jargon. No hype.', time: '~12 min', render: window.Chapter2.render },
    { id: 3, title: 'Your Core Toolkit', subtitle: 'Essential digital tools', time: '~15 min', render: window.Chapter3.render },
    { id: 4, title: 'Talking to AI', subtitle: 'Prompting 101', time: '~15 min', render: window.Chapter4.render },
    { id: 5, title: 'Getting Things Done', subtitle: 'Digital project management', time: '~15 min', render: window.Chapter5.render },
    { id: 6, title: 'You\'re Ready', subtitle: 'Job market launchpad', time: '~12 min', render: window.Chapter6.render },
  ];

  const STORAGE_KEY = 'launchpad_progress';
  let currentChapterId = null;

  // === Progress Management ===

  function getProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    const defaults = {};
    CHAPTERS.forEach(ch => { defaults[ch.id] = 'not-started'; });
    return defaults;
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function setChapterStatus(id, status) {
    const progress = getProgress();
    progress[id] = status;
    saveProgress(progress);
    renderSidebar();
  }

  function isChapterUnlocked(id) {
    if (id <= 2) return true;
    const progress = getProgress();
    return progress[2] === 'complete';
  }

  // === Sidebar ===

  function renderSidebar() {
    const nav = document.getElementById('chapter-list');
    const progress = getProgress();
    nav.innerHTML = '';

    CHAPTERS.forEach(ch => {
      const status = progress[ch.id] || 'not-started';
      const unlocked = isChapterUnlocked(ch.id);
      const isActive = ch.id === currentChapterId;

      const item = document.createElement('div');
      item.className = 'chapter-nav-item'
        + (isActive ? ' active' : '')
        + (unlocked ? '' : ' locked')
        + ' status-' + status.replace('-', '-');

      const statusSymbol = status === 'complete' ? '●'
        : status === 'in-progress' ? '◐'
        : '○';

      item.innerHTML = `
        <span class="status-indicator">${unlocked ? statusSymbol : '🔒'}</span>
        <div>
          <div class="leading-tight">${ch.title}</div>
          <div class="text-[11px] opacity-50 mt-0.5">${ch.time}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (!unlocked) {
          showToast('Complete Chapter 2 to unlock this chapter');
          return;
        }
        navigateToChapter(ch.id);
        closeMobileSidebar();
      });

      nav.appendChild(item);
    });

  }

  // === Navigation ===

  function navigateToChapter(id) {
    const chapter = CHAPTERS.find(ch => ch.id === id);
    if (!chapter) return;

    currentChapterId = id;
    const container = document.getElementById('chapter-container');
    container.innerHTML = '';

    // Set in-progress if not started
    const progress = getProgress();
    if (progress[id] === 'not-started') {
      setChapterStatus(id, 'in-progress');
    } else {
      renderSidebar();
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Render chapter content
    chapter.render(container, {
      setChapterStatus,
      getProgress,
      navigateToChapter,
      isChapterUnlocked,
    });
  }

  // === Mobile Sidebar ===

  function openMobileSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.remove('hidden');
    document.getElementById('menu-icon-open').classList.add('hidden');
    document.getElementById('menu-icon-close').classList.remove('hidden');
  }

  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.add('hidden');
    document.getElementById('menu-icon-open').classList.remove('hidden');
    document.getElementById('menu-icon-close').classList.add('hidden');
  }

  // === Toast ===

  function showToast(message) {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // === Init ===

  function init() {
    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });

    document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);

    // Render sidebar
    renderSidebar();

    // Navigate to first incomplete chapter
    const progress = getProgress();
    let startChapter = 1;
    for (const ch of CHAPTERS) {
      if (progress[ch.id] !== 'complete') {
        startChapter = ch.id;
        break;
      }
    }
    // Only navigate to unlocked chapters
    if (!isChapterUnlocked(startChapter)) {
      startChapter = 1;
    }
    navigateToChapter(startChapter);
  }

  // Expose for chapter modules
  window.LaunchpadApp = {
    setChapterStatus,
    getProgress,
    navigateToChapter,
    isChapterUnlocked,
    showToast,
  };

  document.addEventListener('DOMContentLoaded', init);
})();
