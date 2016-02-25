=====
Kordecms
=====

CMS app for korde cms. Built on django rest framework. 

Detailed documentation is in the "docs" directory.

Quick start
-----------

Installation

pip install git+git://github.com/RubenSchmidt/kordecms.git


1. Add "kordecms" to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = [
        ...
        'kordecms',
    ]

2. Include the polls URLconf in your project urls.py like this::

    url(r'^cms/', include('kordecms.urls')),

3. Run `python manage.py migrate` to create the kordecms models.

4. Start the development server and visit http://127.0.0.1:8000/cms/admin
   to view the cms admin.
