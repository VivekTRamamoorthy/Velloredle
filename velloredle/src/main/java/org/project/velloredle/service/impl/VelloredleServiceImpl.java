package org.project.velloredle.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

import org.project.velloredle.Util;

import org.project.velloredle.service.VelloredleService;

public class VelloredleServiceImpl implements VelloredleService {

	public String getWord(Date today) {

		String wordOfTheDay = null;
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(today);
		int date = calendar.get(Calendar.DAY_OF_MONTH);
		int month = calendar.get(Calendar.MONTH) + 1;
		int year = calendar.get(Calendar.YEAR);
		String dateString = Integer.toString(date) + Integer.toString(month) + Integer.toString(year);
		int randomLineNumber = getRandomWord(Long.parseLong(dateString));
		System.out.println("Random Line Number "+randomLineNumber);

		InputStream inputStream = this.getClass().getResourceAsStream("/fiveletter.txt");

		try {
			BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
			Optional<String> wordOfTheDayObj = bufferedReader.lines().skip(randomLineNumber).limit(1).findAny();
			bufferedReader.close();
			if (wordOfTheDayObj.isPresent()) {
				wordOfTheDay = wordOfTheDayObj.get();
			}
			return wordOfTheDay;
		} catch (IOException e1) {
			System.out.println(e1.getMessage());
			return null;
		}
	}

	public int getRandomWord(long seed) {
		return Util.getRandomWord(seed);
	}

}
