#!/usr/bin/env node

'use strict';

/*
 * Production sources are compiled during the image build. Starting the
 * compiled server directly keeps Babel and package-manager tooling out of the
 * runtime image.
 */
process.env.BABEL_ENV = process.env.BABEL_ENV || 'production';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('../src/server');
