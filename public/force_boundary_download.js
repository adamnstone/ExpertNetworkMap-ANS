// https://d3js.org/d3-force/ v0.0.1 Copyright 2019 John Alexis Guerra Gómez
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.forceBoundary=t()}(this,function(){"use strict";function n(n){return function(){return n}}return function(t,e,r,o){var u,f,i,y,c,a,l,h,p,x,d=n(.1),s=!0,v=n(Math.min((r-t)/2,(o-e)/2));function g(n,t,e,r,o){return(n-t)*Math.min(2,Math.abs(n-t)/n)*e*o}function w(n){for(var t,e=0,r=u.length;e<r;++e)(t=u[e]).x<y[e]+h[e]||t.x>c[e]-h[e]||t.y<a[e]+h[e]||t.y>l[e]-h[e]?(t.vx+=g(p[e],t.x,f[e],h[e],n),t.vy+=g(x[e],t.y,i[e],h[e],n)):(t.vx=0,t.vy=0),s&&(t.x>=c[e]&&(t.vx+=c[e]-t.x),t.x<=y[e]&&(t.vx+=y[e]-t.x),t.y>=l[e]&&(t.vy+=l[e]-t.y),t.y<=a[e]&&(t.vy+=a[e]-t.y))}function A(){if(u){var n,s=u.length;for(f=new Array(s),i=new Array(s),y=new Array(s),a=new Array(s),c=new Array(s),l=new Array(s),x=new Array(s),p=new Array(s),h=new Array(s),n=0;n<s;++n)f[n]=isNaN(y[n]=+t(u[n],n,u))||isNaN(c[n]=+r(u[n],n,u))?0:+d(u[n],n,u),i[n]=isNaN(a[n]=+e(u[n],n,u))||isNaN(l[n]=+o(u[n],n,u))?0:+d(u[n],n,u),p[n]=y[n]+(c[n]-y[n])/2,x[n]=a[n]+(l[n]-a[n])/2,h[n]=+v(u[n],n,u)}}return"function"!=typeof t&&(t=n(null==t?-100:+t)),"function"!=typeof r&&(r=n(null==r?100:+r)),"function"!=typeof e&&(e=n(null==e?-100:+e)),"function"!=typeof o&&(o=n(null==o?100:+o)),w.initialize=function(n){u=n,A()},w.x0=function(e){return arguments.length?(t="function"==typeof e?e:n(+e),A(),w):t},w.x1=function(t){return arguments.length?(r="function"==typeof t?t:n(+t),A(),w):r},w.y0=function(t){return arguments.length?(e="function"==typeof t?t:n(+t),A(),w):e},w.y1=function(t){return arguments.length?(o="function"==typeof t?t:n(+t),A(),w):o},w.strength=function(t){return arguments.length?(d="function"==typeof t?t:n(+t),A(),w):d},w.border=function(t){return arguments.length?(v="function"==typeof t?t:n(+t),A(),w):v},w.hardBoundary=function(n){return arguments.length?(s=n,w):s},w}});