import { Injectable } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsService {
  private ldClient: LDClient.LDClient | undefined;
  private featureFlagSubject = new BehaviorSubject<boolean>(false);

  constructor() { }


  initializeClient(userKey: string) {
    const clientSideId = '671094e62eeceb0829ce8eb2'; // replace with your actual client-side ID from LaunchDarkly

    const user = {
      key: userKey,  // Unique identifier for your user
      anonymous: false,
      name: "User Name",  // Add more attributes based on your use case
    };

    this.ldClient = LDClient.initialize(clientSideId, user);

    this.ldClient.on('ready', () => {
      console.log('LaunchDarkly client initialized');
    });

    this.ldClient.on('ready', () => {
      console.log('LaunchDarkly client initialized');
      this.checkFlag('sample-feature'); // Initial flag check
    });
  }

  private checkFlag(flagKey: string) {
    if (this.ldClient) {
      const currentValue = this.ldClient.variation(flagKey, false);
      this.featureFlagSubject.next(currentValue);

      // Subscribe to flag changes
      this.ldClient.on(`change:${flagKey}`, (newValue) => {
        this.featureFlagSubject.next(newValue);
      });
    }
  }

  getFeatureFlagObservable(): Observable<boolean> {
    return this.featureFlagSubject.asObservable();
  }

  getFeatureFlag(flagKey: string, defaultValue: boolean): boolean {
    return this.ldClient?.variation(flagKey, defaultValue) ?? defaultValue;
  }
}
