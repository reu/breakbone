build: concatenate minify

concatenate:
	cat src/breakbone.js\
		src/core/class.js\
		src/core/vector.js\
		src/keys.js\
		src/runner.js\
		src/entity.js\
		src/image.js\
		src/loader.js\
		src/sound.js\
		src/world.js\
		src/systems/system.js\
		src/systems/void.js\
		src/systems/input.js\
		src/components/component.js\
		src/components/input.js\
		> breakbone.js

minify:
	@./node_modules/.bin/uglifyjs breakbone.js -o breakbone.min.js

test:
	@./node_modules/.bin/mocha --require ./test/support.js ./test/*-test.js ./test/**/*-test.js

test-browser: build
	open test/browser/index.html

.PHONY: concatenate minify build test test-browser
