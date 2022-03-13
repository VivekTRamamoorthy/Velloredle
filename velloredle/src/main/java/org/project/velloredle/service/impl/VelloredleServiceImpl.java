package org.project.velloredle.service.impl;

import java.io.IOException;
import java.util.Date;
import java.util.Properties;

import org.project.velloredle.service.VelloredleService;

public class VelloredleServiceImpl implements VelloredleService {

	public String getWord(Date date) {
		
		Properties properties = new Properties();
		try {
			properties.load(this.getClass().getResourceAsStream("/application.properties"));
			String word = properties.getProperty("word");
			return word;
		} catch (IOException e) {
			return null;
		}
	}

}
