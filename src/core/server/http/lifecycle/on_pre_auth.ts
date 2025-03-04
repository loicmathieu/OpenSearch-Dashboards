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

import { Lifecycle, Request, ResponseToolkit as HapiResponseToolkit } from '@hapi/hapi';
import { Logger } from '../../logging';
import {
  HapiResponseAdapter,
  OpenSearchDashboardsRequest,
  OpenSearchDashboardsResponse,
  lifecycleResponseFactory,
  LifecycleResponseFactory,
} from '../router';

enum ResultType {
  next = 'next',
}

interface Next {
  type: ResultType.next;
}

type OnPreAuthResult = Next;

const preAuthResult = {
  next(): OnPreAuthResult {
    return { type: ResultType.next };
  },
  isNext(result: OnPreAuthResult): result is Next {
    return result && result.type === ResultType.next;
  },
};

/**
 * @public
 * A tool set defining an outcome of OnPreAuth interceptor for incoming request.
 */
export interface OnPreAuthToolkit {
  /** To pass request to the next handler */
  next: () => OnPreAuthResult;
}

const toolkit: OnPreAuthToolkit = {
  next: preAuthResult.next,
};

/**
 * See {@link OnPreAuthToolkit}.
 * @public
 */
export type OnPreAuthHandler = (
  request: OpenSearchDashboardsRequest,
  response: LifecycleResponseFactory,
  toolkit: OnPreAuthToolkit
) =>
  | OnPreAuthResult
  | OpenSearchDashboardsResponse
  | Promise<OnPreAuthResult | OpenSearchDashboardsResponse>;

/**
 * @public
 * Adopt custom request interceptor to Hapi lifecycle system.
 * @param fn - an extension point allowing to perform custom logic for
 * incoming HTTP requests before a user has been authenticated.
 */
export function adoptToHapiOnPreAuth(fn: OnPreAuthHandler, log: Logger) {
  return async function interceptPreAuthRequest(
    request: Request,
    responseToolkit: HapiResponseToolkit
  ): Promise<Lifecycle.ReturnValue> {
    const hapiResponseAdapter = new HapiResponseAdapter(responseToolkit);

    try {
      const result = await fn(
        OpenSearchDashboardsRequest.from(request),
        lifecycleResponseFactory,
        toolkit
      );
      if (result instanceof OpenSearchDashboardsResponse) {
        return hapiResponseAdapter.handle(result);
      }

      if (preAuthResult.isNext(result)) {
        return responseToolkit.continue;
      }

      throw new Error(
        `Unexpected result from OnPreAuth. Expected OnPreAuthResult or OpenSearchDashboardsResponse, but given: ${result}.`
      );
    } catch (error) {
      log.error(error);
      return hapiResponseAdapter.toInternalError();
    }
  };
}
