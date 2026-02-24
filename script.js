document.addEventListener('DOMContentLoaded', function () {

  /* ── Tab Switching ─────────────────────────────────────── */
  const tabs = document.querySelectorAll('.tab');
  const tabContents = {
    posts:    document.getElementById('posts'),
    about:    document.getElementById('about-tab'),
    projects: document.getElementById('projects'),
    photos:   document.getElementById('photos'),
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide all, show selected with re-triggered animation
      Object.values(tabContents).forEach(c => c.classList.add('hidden'));
      const target = tabContents[tab.dataset.tab];
      if (target) {
        target.classList.remove('hidden');
        target.style.animation = 'none';
        void target.offsetWidth; // reflow to restart animation
        target.style.animation = '';
      }
    });
  });

  /* ── Connect Button ────────────────────────────────────── */
  const followBtn = document.getElementById('followBtn');
  followBtn.addEventListener('click', function () {
    const connected = this.classList.contains('primary');
    this.classList.toggle('primary', !connected);
    this.classList.toggle('outline', connected);
    this.textContent = connected ? '+ Connect' : '✓ Connected';
  });

  /* ── Message Button ────────────────────────────────────── */
  document.getElementById('messageBtn').addEventListener('click', function () {
    window.location.href =
      'mailto:jatanrajbhar34@gmail.com?subject=Portfolio%20Inquiry&body=Hi%20Jatan%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect.';
  });

  /* ── Post Composer ─────────────────────────────────────── */
  const postBtn     = document.getElementById('postBtn');
  const newPostText = document.getElementById('newPostText');
  const feed        = document.getElementById('feed');

  postBtn.addEventListener('click', () => {
    const text = newPostText.value.trim();
    if (!text) {
      newPostText.focus();
      newPostText.style.borderColor = '#e74c3c';
      setTimeout(() => { newPostText.style.borderColor = ''; }, 1500);
      return;
    }

    const article = document.createElement('article');
    article.className = 'post card';
    article.dataset.id = Date.now();
    article.innerHTML = `
      <header class="post-head">
        <img src="images/jatank.jpeg" class="mini-avatar" alt="Jatan" />
        <div>
          <strong>Jatan Rajbhar</strong>
          <div class="muted small">Just now</div>
        </div>
      </header>
      <div class="post-body"><p>${escapeHtml(text)}</p></div>
      <footer class="post-footer">
        <div class="reactions">
          <button class="like btn">&#128077; <span class="count">0</span></button>
          <button class="comment btn">&#128172; <span class="count">0</span></button>
          <button class="share btn">&#8599; Share</button>
        </div>
        <div class="comments"></div>
      </footer>`;

    article.style.animation = 'fadeUp 0.3s ease';
    feed.prepend(article);
    newPostText.value = '';
  });

  // Allow posting with Enter key
  newPostText.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      postBtn.click();
    }
  });

  /* ── Feed Interactions (Like / Comment / Share) ─────────── */
  feed.addEventListener('click', function (e) {

    // Like
    const likeBtn = e.target.closest('.like');
    if (likeBtn) {
      const count = likeBtn.querySelector('.count');
      count.textContent = Number(count.textContent) + 1;
      likeBtn.style.color = '#1877f2';
      likeBtn.style.transform = 'scale(1.1)';
      setTimeout(() => { likeBtn.style.transform = ''; }, 200);
      return;
    }

    // Comment — inline input instead of prompt()
    const commentBtn = e.target.closest('.comment');
    if (commentBtn) {
      const post = commentBtn.closest('.post');
      const comments = post.querySelector('.comments');

      // Don't add another composer if one already exists
      if (comments.querySelector('.comment-composer')) {
        comments.querySelector('.comment-composer input').focus();
        return;
      }

      const composer = document.createElement('div');
      composer.className = 'comment-composer';
      composer.innerHTML = `
        <input type="text" placeholder="Write a comment…" maxlength="280" />
        <button class="btn primary" style="padding:6px 14px;font-size:13px;">Post</button>`;
      comments.appendChild(composer);

      const input  = composer.querySelector('input');
      const submit = composer.querySelector('button');
      input.focus();

      const postComment = () => {
        const txt = input.value.trim();
        if (!txt) return;
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `<strong>You</strong> ${escapeHtml(txt)}`;
        comments.insertBefore(div, composer);
        composer.remove();
        const ccount = commentBtn.querySelector('.count');
        ccount.textContent = Number(ccount.textContent) + 1;
      };

      submit.addEventListener('click', postComment);
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); postComment(); }
        if (e.key === 'Escape') composer.remove();
      });
      return;
    }

    // Share — copy URL to clipboard
    const shareBtn = e.target.closest('.share');
    if (shareBtn) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const original = shareBtn.innerHTML;
          shareBtn.innerHTML = '&#10003; Copied!';
          shareBtn.style.color = '#42b72a';
          setTimeout(() => {
            shareBtn.innerHTML = original;
            shareBtn.style.color = '';
          }, 2000);
        });
      }
    }
  });

  /* ── Global Search (filters posts by text) ─────────────── */
  document.getElementById('globalSearch').addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    document.querySelectorAll('.post').forEach(post => {
      post.style.display = (!query || post.textContent.toLowerCase().includes(query)) ? '' : 'none';
    });
  });

  /* ── Utility ───────────────────────────────────────────── */
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

});
