import { SwalUtils } from "../utils/swal_utils";

export enum ApiMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export interface ApiCallParams {
    url: string,
    method?: ApiMethod,
    data?: Record<string, unknown>,
    headers?: Record<string, string>,
    body?: ReadableStream<Uint8Array> | string | null,
}

export interface DefaultApiCallParams {
    headers: Record<string, string>,
    method: ApiMethod,
    body?: ReadableStream<Uint8Array> | string | null,
}


export class API {

    static endpoint = process.env.REACT_APP_ENDPOINT ?? "http://localhost:4000";
    static words = API.endpoint + "/words";

    static handleErrors(response: Response): Response {
        if (response.ok || response.status === 204) {
            return response;
        } else {
            throw response;
        }
    }

    static apiCall<T>(params: ApiCallParams = {
        url: "",
        method: ApiMethod.GET,
        data: undefined
    }): Promise<T | null> {

        const defaultParams: DefaultApiCallParams = {
            headers: {
                "content-type": "application/json",
                "accept": "application/json, application/ld+json",
            },
            method: ApiMethod.GET,
            body: null,
        };

        const finalParams: ApiCallParams = Object.assign(defaultParams, params);

        if (params.data) {
            finalParams.body = JSON.stringify(params.data);
        }

        return fetch(params.url, finalParams)
            .then(this.handleErrors)
            .then(r => r.json())
            .catch(async ex => {
                if (ex.json) {
                    const err = await ex.json();
                    SwalUtils.showErrorSwalToast(err?.message ?? err ?? "An error occurred.");
                }
                return null;
            });
    }
}