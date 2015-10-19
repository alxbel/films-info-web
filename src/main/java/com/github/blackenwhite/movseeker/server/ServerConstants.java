package com.github.blackenwhite.movseeker.server;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Random;

/**
 * Created on 09.10.2015.
 */
public class ServerConstants {
    public static class Movies {
        public static final int MIN_REVIEWS = 500;
        public static final String NOT_AVAILABLE = "N/A";
    }

    public static class Defaults {
        private static final Integer CURRENT_YEAR = new GregorianCalendar().get(Calendar.YEAR);
        public static final Integer MIN_YEAR = 1960;
        public static final Integer YEAR_DIFF = CURRENT_YEAR - MIN_YEAR;
//        public static final Integer DEFAULT_YEAR = new Integer(MIN_YEAR + new Random().nextInt(YEAR_DIFF));
        public static final Integer DEFAULT_YEAR = 2005;
        public static final Double DEFAULT_MIN_RATING = 8.2;
    }
}
