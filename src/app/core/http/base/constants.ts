import { getEnvironmentName } from "../../utils/check_environment";
import { environment as environmentDev } from "../../../../environments/environment.dev";
import { environment as environmentProd } from "../../../../environments/environment.prod";

export const BASE_URL = getEnvironmentName() === 'prod' ? environmentProd.apiUrl : environmentDev.apiUrl;

export const CALENDLYEVENTID = "ueiuwiiwu";

export const LAUNCH_DARKLY_PROD_CLIENT_ID = "671094e62eeceb0829ce8eb3";
export const LAUNCH_DARKLY_TEST_CLIENT_ID = "671094e62eeceb0829ce8eb2";
