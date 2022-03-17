package org.project.velloredle;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.Gson;

import java.util.Random;

public class Util {
	
	private static final int MAX_VALUE = 5757;
	
	private static final ThreadLocal<Random> THREAD_LOCAL_RANDOM = ThreadLocal.withInitial(Random::new);

	 public static void logEnvironment(Object event, Context context, Gson gson)
	  {
	    LambdaLogger logger = context.getLogger();
	    // log execution details
	    logger.log("ENVIRONMENT VARIABLES: " + gson.toJson(System.getenv()));
	    logger.log("CONTEXT: " + gson.toJson(context));
	    // log event details
	    logger.log("EVENT: " + gson.toJson(event));
	    logger.log("EVENT TYPE: " + event.getClass().toString());
	  }
	 
	 // generate a pseudo random number between 0(inclusive) and 5757(exclusive)
	 public static int getRandomWord(long date) {
		 
		Random random = THREAD_LOCAL_RANDOM.get();
		random.setSeed(date);
		int lineNumber = random.nextInt(MAX_VALUE);
		return lineNumber;
		 
	 }
}
