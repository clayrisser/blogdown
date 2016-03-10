var head = document.querySelector('head');
var link = document.createElement('link');
var theme = 'default';
if (localStorage.theme) {
	theme = localStorage.theme;
}
link.setAttribute('rel', 'import');
link.setAttribute('href', '../styles/' + theme + '-theme.html');
head.appendChild(link);
console.log(theme + ' theme loaded');
