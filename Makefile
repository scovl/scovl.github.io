bin          = $(shell npm bin)
stylus       = $(bin)/stylus
browserify   = $(bin)/browserify
stylus-paths = -I node_modules/nib/lib -I node_modules/entypo-stylus -I node_modules/jumper-skirt/src


css:
	mkdir -p media/css
	$(stylus) $(stylus-paths) -o media/css media/stylus

watch-css:
	mkdir -p media/css
	$(stylus) $(stylus-paths) -w -o media/css media/stylus

serve:
	bundle exec jekyll serve --drafts -w --host "0.0.0.0" --incremental

.PHONY: css watch-css