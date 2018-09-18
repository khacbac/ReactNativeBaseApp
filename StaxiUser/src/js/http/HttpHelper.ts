import MethodName from "./MethodName";
import { HttpUtils, NativeAppModule } from "../../module";

/**
 *
 * @param methodName xử lý request khi gửi mảng byte
 * @param request
 */
export const requestByJson = (
  methodName: MethodName,
  request: any,
  timeout = 10000
) => {
  return HttpUtils.fetchByJson(NativeAppModule.HTTP_API + methodName, request, timeout);
};

export function requestByObject<T>(
  methodName: MethodName,
  request: Object,
  response: T,
  timeout = 10000
): Promise<T> {
  // console.log("request NativeAppModule.HTTP_API___ ", NativeAppModule.HTTP_API+ methodName);
  return HttpUtils.fetchByObject(
    NativeAppModule.HTTP_API + methodName,
    request,
    response,
    timeout
  );
}
export { MethodName };
