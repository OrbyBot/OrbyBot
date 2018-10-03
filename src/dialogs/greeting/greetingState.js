// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Simple object used by the user state property accessor.
 * Used to store the user state.
 */
export class GreetingState {
  constructor(name) {
    this.name = name || undefined;
  }
}
