import { Injectable } from '@angular/core';
import { FeatureFlagsService } from '../core/services/FeatureFlags/feature-flags.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsStoreService {
  private flagsStore = new Map<string, BehaviorSubject<boolean>>();

  constructor(private featureFlagsService: FeatureFlagsService) {}

  // Initialize feature flags during app startup
  loadFlags(): Promise<void> {
    return new Promise((resolve) => {
      this.featureFlagsService.initializeClient("ui");  // Initialize LaunchDarkly client

      const featureKeys = ['subscription-businesses', 'another-flag-key']; // add more keys as needed
      featureKeys.forEach((flagKey) => {
        const flagValue = this.featureFlagsService.getFeatureFlag(flagKey, false);
        this.flagsStore.set(flagKey, new BehaviorSubject(flagValue));

        // Listen for changes to this flag
        this.featureFlagsService.getFeatureFlagObservable().subscribe((newFlagValue) => {
          this.flagsStore.get(flagKey)?.next(newFlagValue);
        });
      });

      resolve();
    });
  }

  // Get an observable for a specific feature flag
  getFlag(flagKey: string): Observable<boolean> {
    return this.flagsStore.get(flagKey)?.asObservable() || new BehaviorSubject(false).asObservable();
  }
}
