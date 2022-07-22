import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import { Product } from "src/types/api-types";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Product | Product[]) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const formatErrorResponse = (statusCode: number, message: string) => {
	return {
		statusCode,
		body: JSON.stringify({
			error: {
				message,
			},
		}),
	};
};
