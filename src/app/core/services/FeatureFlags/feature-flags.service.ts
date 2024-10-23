import { Injectable } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { getEnvironmentName } from '../../utils/check_environment';
import { LAUNCH_DARKLY_PROD_CLIENT_ID,LAUNCH_DARKLY_TEST_CLIENT_ID } from '../../http/base/constants';


@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsService {
  private ldClient: LDClient.LDClient | undefined;
  private featureFlagSubject = new BehaviorSubject<boolean>(false);
  private environment!: string
  private clientSideId!:string

  constructor() { 
    this.environment = getEnvironmentName()
  }


  initializeClient(key:string) {

    if(this.environment === "test"){
      this.clientSideId = LAUNCH_DARKLY_TEST_CLIENT_ID;
    }else{
      this.clientSideId  = LAUNCH_DARKLY_PROD_CLIENT_ID;
    }

    const user = {
      key: "cc",  
      anonymous: false,
    };

    this.ldClient = LDClient.initialize(this.clientSideId, user);
   
    //TO DO - check all flags when ready
    this.ldClient.on('ready', () => {
      this.checkFlag(key); 
      // this.checkFlag('subscription-businesses'); 
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


  // getAllFeatureFlags() {
  //   if (this.ldClient) {
  //     try {
  //       const allFlags = this.ldClient.allFlags();  // Retrieve all feature flags
  //      
  //       // Check if any flags are missing
  //       if (!allFlags || Object.keys(allFlags).length === 0) {
  //         console.warn('No feature flags were returned. Ensure the flags are available for client-side SDKs.');
  //       }
  
  //       // this.featureFlagSubject.next(allFlags);  // Push the flags into the BehaviorSubject
  //     } catch (error) {
  //       console.error('Error fetching all feature flags:', error);
  //     }
  //   } else {
  //     console.error('LaunchDarkly client not initialized');
  //   }
  // }
  

  getFeatureFlagObservable(): Observable<boolean> {
    return this.featureFlagSubject.asObservable();
  }

  getFeatureFlag(flagKey: string, defaultValue: boolean): boolean {
    return this.ldClient?.variation(flagKey, defaultValue) ?? defaultValue;
  }
}
