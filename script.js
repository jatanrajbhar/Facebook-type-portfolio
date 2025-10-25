document.getElementById('messageBtn').addEventListener('click', function() {
    window.location.href = 'mailto:jatanrajbhar34@gmail.com?subject=Portfolio Inquiry&body=Hi Jatan, I saw your portfolio and...';
});

document.addEventListener('DOMContentLoaded', function(){
  const tabs = document.querySelectorAll('.tab');
  const contents = {
    posts: document.getElementById('posts'),
    about: document.getElementById('about-tab'),
    projects: document.getElementById('projects'),
    photos: document.getElementById('photos'),
    friends: document.getElementById('friends'),
  };
  tabs.forEach(t=>{
    t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      Object.values(contents).forEach(c=>c.classList.add('hidden'));
      const key = t.dataset.tab;
      if(contents[key]) contents[key].classList.remove('hidden');
    });
  });

  const postBtn = document.getElementById('postBtn');
  const newPostText = document.getElementById('newPostText');
  const feed = document.getElementById('feed');

  postBtn.addEventListener('click', ()=>{
    const text = newPostText.value.trim();
    if(!text) return alert('Write something about your work.');
    const id = Date.now();
    const post = document.createElement('article');
    post.className = 'post card';
    post.dataset.id = id;
    post.innerHTML = `
      <header class="post-head">
        <img src="assets/profile.jpg" class="mini-avatar" />
        <div>
          <strong>Jatan Rajbhar</strong>
          <div class="muted small">Just now</div>
        </div>
      </header>
      <div class="post-body"><p>${escapeHtml(text)}</p></div>
      <footer class="post-footer">
        <div class="reactions">
          <button class="like btn">👍 <span class="count">0</span></button>
          <button class="comment btn">💬 <span class="count">0</span></button>
          <button class="share btn">↪</button>
        </div>
        <div class="comments"></div>
      </footer>`;
    feed.prepend(post);
    newPostText.value = '';
  });

  feed.addEventListener('click', function(e){
    const likeBtn = e.target.closest('.like');
    if(likeBtn){
      const count = likeBtn.querySelector('.count');
      count.textContent = Number(count.textContent)+1;
    }
    const commentBtn = e.target.closest('.comment');
    if(commentBtn){
      const comments = commentBtn.closest('.post').querySelector('.comments');
      const txt = prompt('Write a comment:');
      if(txt){ 
        const div = document.createElement('div');
        div.className='comment-item';
        div.innerHTML = `<strong>You</strong> ${escapeHtml(txt)}`;
        comments.appendChild(div);
        const ccount = commentBtn.querySelector('.count');
        ccount.textContent = Number(ccount.textContent)+1;
      }
    }
    const shareBtn = e.target.closest('.share');
    if(shareBtn){
      alert('Share simulated. Copy link to share externally.');
    }
  });

  document.getElementById('followBtn').addEventListener('click', function(){
    this.classList.toggle('primary');
    this.textContent = this.classList.contains('primary') ? 'Connected' : 'Connect';
  });
  document.getElementById('messageBtn').addEventListener('click', function(){
    const mail = 'mailto:jatanrajbhar34@gmail.com';
    location.href = mail;
  });

  function escapeHtml(str){
    return str.replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }
});

