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
          var cat = categorize(repo);

          var li = document.createElement('li');
          li.className = 'project-item active';
          li.setAttribute('data-filter-item', '');
          li.setAttribute('data-category', cat);

          li.innerHTML =
            '<a href="' + repo.html_url + '" target="_blank" rel="noopener">' +
              '<figure class="project-img">' +
                '<div class="project-item-icon-box"><i class="far fa-eye"></i></div>' +
                '<img src="https://opengraph.githubassets.com/1/' + GITHUB_USER + '/' + repo.name + '"' +
                     ' alt="' + repo.name + '" loading="lazy">' +
              '</figure>' +
              '<h3 class="project-title">' + formatName(repo.name) + '</h3>' +
              '<p class="project-category">' + displayCat(cat) + '</p>' +
            '</a>';

          list.appendChild(li);
        });
    })
    .catch(function () {
      list.innerHTML = '<li style="grid-column:1/-1;text-align:center;padding:2rem;opacity:.6;color:var(--light-gray)">Could not load repositories.</li>';
    });

}());
