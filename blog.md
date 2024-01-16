---
title: blog
layout: page
blog_index: true
permalink: blog/
---
A space for side projects, tinkering and musings on data, technology and beyond. 
<ul>
    {% for post in site.posts %}
    {% unless post.draft == true or post.series %}
    <li class="post-item">
        <a class="post-title" href="{{ post.url }}"><span>{{ post.title }}</span></a>
        <div class="post-date"><i>{{ post.date | date: '%B %-d, %Y' }}</i></div>
    </li>
    {% endunless %}
    {% endfor %}
</ul>