'use strict';

(function () {

  const GITHUB_USER = 'MALTOisHERE';
  const EXCLUDED = new Set(['MALTOisHERE', 'MALTOisHERE.github.io', 'blog-comments']);

  const list = document.querySelector('.project-list');
  if (!list) return;

  list.innerHTML = '<li style="grid-column:1/-1;text-align:center;padding:2rem;opacity:.6;color:var(--light-gray)">Loading repositories…</li>';

  function formatName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function categorize(repo) {
    const combined = (repo.name + ' ' + (repo.topics || []).join(' ')).toLowerCase();
    const lang = (repo.language || '').toLowerCase();

    if (/xss|payload|pentest|exploit|atkd|secure.?code|ctf/.test(combined)) return 'security';
    if (/\bai\b|machine.?learn|deep.?learn|defect|detect|compliance|crawl|llm|rag|nlp/.test(combined)) return 'ai / ml';
    if (/\btool\b|server|automat|unitime|wiqaytna|mcp|backup|schedule/.test(combined) || lang === 'java') return 'apps';
    return 'web';
  }

  function displayCat(cat) {
    return cat === 'ai / ml' ? 'AI / ML' : cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  function buildCard(repo) {
    var cat = categorize(repo);

    var li = document.createElement('li');
    li.className = 'project-item active';
    li.setAttribute('data-filter-item', '');
    li.setAttribute('data-category', cat);

    var a = document.createElement('a');
    a.href = repo.html_url;
    a.target = '_blank';
    a.rel = 'noopener';

    var figure = document.createElement('figure');
    figure.className = 'project-img';

    var iconBox = document.createElement('div');
    iconBox.className = 'project-item-icon-box';
    iconBox.innerHTML = '<i class="ph ph-eye"></i>';

    var img = document.createElement('img');
    img.alt = repo.name;

    img.onerror = function () {
      var el = this;
      var attempts = (parseInt(el.dataset.attempts, 10) || 0) + 1;
      el.dataset.attempts = attempts;
      if (attempts <= 2) {
        setTimeout(function () {
          el.src = '';
          el.src = 'https://opengraph.githubassets.com/1/' + GITHUB_USER + '/' + repo.name;
        }, attempts * 1500);
      }
    };

    img.src = 'https://opengraph.githubassets.com/1/' + GITHUB_USER + '/' + repo.name;

    figure.appendChild(iconBox);
    figure.appendChild(img);

    var title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = formatName(repo.name);

    var category = document.createElement('p');
    category.className = 'project-category';
    category.textContent = displayCat(cat);

    a.appendChild(figure);
    a.appendChild(title);
    a.appendChild(category);
    li.appendChild(a);

    return li;
  }

  fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?per_page=100&sort=updated&type=public')
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (repos) {
      list.innerHTML = '';

      repos
        .filter(function (r) { return !EXCLUDED.has(r.name); })
        .forEach(function (repo) {
          list.appendChild(buildCard(repo));
        });
    })
    .catch(function () {
      list.innerHTML = '<li style="grid-column:1/-1;text-align:center;padding:2rem;opacity:.6;color:var(--light-gray)">Could not load repositories.</li>';
    });

}());
