build: concatenate minify

concatenate:
	cat src/breakbone.js src/core/class.js src/core/set.js src/entity.js src/image.js src/input.js src/loader.js src/sound.js src/world.js src/systems/*.js src/components/*.js > breakbone.js

minify:
	@./node_modules/.bin/uglifyjs breakbone.js -o breakbone.min.js

test:
	@./node_modules/.bin/mocha --require ./test/support.js ./test/*-test.js ./test/**/*-test.js

test-browser:
	@./node_modules/.bin/mocha-phantomjs -p phantomjs test/browser/index.html

.PHONY: concatenate minify build test test-browser
