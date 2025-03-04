/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { RESERVED_DIR_JEST_INTEGRATION_TESTS } from '../constants';

export default {
  rootDir: '../../..',
  roots: [
    '<rootDir>/src/plugins',
    '<rootDir>/src/legacy/ui',
    '<rootDir>/src/core',
    '<rootDir>/src/legacy/server',
    '<rootDir>/src/cli',
    '<rootDir>/src/cli_keystore',
    '<rootDir>/src/cli_plugin',
    '<rootDir>/packages/osd-test/target/functional_test_runner',
    '<rootDir>/src/dev',
    '<rootDir>/src/optimize',
    '<rootDir>/src/legacy/utils',
    '<rootDir>/src/setup_node_env',
    '<rootDir>/packages',
    '<rootDir>/src/test_utils',
    '<rootDir>/test/functional/services/remote',
  ],
  collectCoverageFrom: [
    'src/plugins/**/*.{ts,tsx}',
    '!src/plugins/**/*.d.ts',
    'packages/osd-ui-framework/src/components/**/*.js',
    '!packages/osd-ui-framework/src/components/index.js',
    '!packages/osd-ui-framework/src/components/**/*/index.js',
    'packages/osd-ui-framework/src/services/**/*.js',
    '!packages/osd-ui-framework/src/services/index.js',
    '!packages/osd-ui-framework/src/services/**/*/index.js',
  ],
  moduleNameMapper: {
    '@elastic/eui$': '<rootDir>/node_modules/@elastic/eui/test-env',
    '@elastic/eui/lib/(.*)?': '<rootDir>/node_modules/@elastic/eui/test-env/$1',
    '^src/plugins/(.*)': '<rootDir>/src/plugins/$1',
    '^test_utils/(.*)': '<rootDir>/src/test_utils/public/$1',
    '^fixtures/(.*)': '<rootDir>/src/fixtures/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/dev/jest/mocks/file_mock.js',
    '\\.(css|less|scss)$': '<rootDir>/src/dev/jest/mocks/style_mock.js',
    '\\.ace\\.worker.js$': '<rootDir>/src/dev/jest/mocks/worker_module_mock.js',
    '\\.editor\\.worker.js$': '<rootDir>/src/dev/jest/mocks/worker_module_mock.js',
    '^(!!)?file-loader!': '<rootDir>/src/dev/jest/mocks/file_mock.js',
  },
  setupFiles: [
    '<rootDir>/src/dev/jest/setup/babel_polyfill.js',
    '<rootDir>/src/dev/jest/setup/polyfills.js',
    '<rootDir>/src/dev/jest/setup/enzyme.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/dev/jest/setup/mocks.js',
    '<rootDir>/src/dev/jest/setup/react_testing_library.js',
  ],
  coverageDirectory: '<rootDir>/target/opensearch-dashboards-coverage/jest',
  coverageReporters: ['html', 'text', 'text-summary'],
  moduleFileExtensions: ['js', 'mjs', 'json', 'ts', 'tsx', 'node'],
  modulePathIgnorePatterns: [
    '__fixtures__/',
    'target/',
    '<rootDir>/src/plugins/maps_legacy',
    '<rootDir>/src/plugins/region_map',
  ],
  testEnvironment: 'jest-environment-jsdom-thirteen',
  testMatch: ['**/*.test.{js,mjs,ts,tsx}'],
  testPathIgnorePatterns: [
    '<rootDir>/packages/osd-ui-framework/(dist|doc_site|generator-kui)/',
    '<rootDir>/packages/osd-pm/dist/',
    `${RESERVED_DIR_JEST_INTEGRATION_TESTS}/`,
  ],
  transform: {
    '^.+\\.(js|tsx?)$': '<rootDir>/src/dev/jest/babel_transform.js',
    '^.+\\.txt?$': 'jest-raw-loader',
    '^.+\\.html?$': 'jest-raw-loader',
  },
  transformIgnorePatterns: [
    // ignore all node_modules except monaco-editor which requires babel transforms to handle dynamic import()
    // since ESM modules are not natively supported in Jest yet (https://github.com/facebook/jest/issues/4842)
    '[/\\\\]node_modules(?![\\/\\\\](monaco-editor|weak-lru-cache|ordered-binary))[/\\\\].+\\.js$',
    'packages/osd-pm/dist/index.js',
  ],
  snapshotSerializers: [
    '<rootDir>/src/plugins/opensearch_dashboards_react/public/util/test_helpers/react_mount_serializer.ts',
    '<rootDir>/node_modules/enzyme-to-json/serializer',
  ],
  reporters: ['default', '<rootDir>/src/dev/jest/junit_reporter.js'],
};
