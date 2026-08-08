/**
 * Legacy alias for the shared client.
 *
 * This used to be a second axios instance with its own interceptors and its
 * own 401 behaviour, so which recovery path a request got depended on which
 * client the calling service happened to import. Both now share one refresh
 * and one session-teardown path.
 */
import { HTTP_CLIENT } from "./axiosClient";

const axiosInstance = HTTP_CLIENT;

export default axiosInstance;
