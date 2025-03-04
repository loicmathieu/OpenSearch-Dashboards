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

import { isBoom } from '@hapi/boom';
import { schema } from '@osd/config-schema';
import { getFields } from '../lib/get_fields';
import { Framework } from '../plugin';

export const fieldsRoutes = (framework: Framework) => {
  framework.router.get(
    {
      path: '/api/metrics/fields',
      validate: {
        query: schema.object({ index: schema.string() }),
      },
    },
    async (context, req, res) => {
      try {
        return res.ok({ body: await getFields(context, req, framework, req.query.index) });
      } catch (err) {
        if (isBoom(err) && err.output.statusCode === 401) {
          return res.customError({
            body: err.output.payload,
            statusCode: err.output.statusCode,
            headers: err.output.headers as { [key: string]: string },
          });
        }

        return res.ok({
          body: [],
        });
      }
    }
  );
};
