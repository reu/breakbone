concatenate:
	cat src/breakbone.js src/core/class.js src/core/set.js src/*.js src/systems/*.js src/components/*.js > breakbone.js

minify:
	@./node_modules/.bin/uglifyjs breakbone.js -o breakbone.min.js

build: concatenate minify

test:
	@./node_modules/.bin/mocha --require ./test/support.js ./test/*-test.js ./test/**/*-test.js

test-browser:
	@./node_modules/.bin/serve .

.PHONY: concatenate minify build test test-browser
