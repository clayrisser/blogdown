var head = document.querySelector('head');
var link = document.createElement('link');
var style = 'default';
if (localStorage.style) {
	style = localStorage.style;
}
link.setAttribute('rel', 'import');
link.setAttribute('href', '../styles/' + style + '-style.html');
head.appendChild(link);
console.log(style + ' style loaded');
