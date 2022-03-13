package org.project.velloredle;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.project.velloredle.service.VelloredleService;
import org.project.velloredle.service.impl.VelloredleServiceImpl;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

public class HandlerAPIGateway implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
	Gson gson = new GsonBuilder().setPrettyPrinting().create();

	public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent event, Context context) {
		
		APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();

		String httpMethod = event.getHttpMethod();
		if (httpMethod.equalsIgnoreCase("get")) {
			String body = event.getBody();
			JsonObject jsonObject = gson.fromJson(body, JsonObject.class);
			String dateString = jsonObject.get("date").getAsString();
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
			Date date = null;
			try {
				date = simpleDateFormat.parse(dateString);
			} catch (ParseException e) {
				response.setIsBase64Encoded(false);
				response.setStatusCode(200);
				HashMap<String, String> headers = new HashMap<String, String>();
				headers.put("Content-Type", "application/json");
				headers.put("Access-Control-Allow-Origin", "*" );
				response.setHeaders(headers);
				response.setBody("{}");
				return response;
			}
			VelloredleService velloredleService = new VelloredleServiceImpl();
			String word = velloredleService.getWord(date);
			response.setIsBase64Encoded(false);
			response.setStatusCode(200);
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Content-Type", "application/json");
			response.setHeaders(headers);
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("word",word);
			ObjectMapper objectMapper = new ObjectMapper();
			try {
				response.setBody(objectMapper.writeValueAsString(map));
			} catch (JsonProcessingException e) {
				response.setBody("{}");
			}
			return response;
		}

		response.setIsBase64Encoded(false);
		response.setStatusCode(200);
		HashMap<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/json");
		response.setHeaders(headers);

		response.setBody(null);
		// log execution details
		Util.logEnvironment(event, context, gson);
		return response;
	}
}
