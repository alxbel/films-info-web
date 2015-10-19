package com.github.blackenwhite.movseeker.server;

//import com.github.blackenwhite.movseeker.movies.Movie;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.jsoup.HttpStatusException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.SocketTimeoutException;
import java.util.*;

/**
 * Created on 07.10.2015.
 */
public class ServerMoviesProcessor {
    private static final String IMDB_URL_FORMAT = "http://www.imdb.com/search/title?at=0&sort=user_rating&start=%d&title_type=feature&year=%d,%d";
    private static final String OMDB_URL_FORMAT = "http://www.omdbapi.com/?i=%s&plot=short&tomatoes=true&r=json";
    private static final int MAX_ATTEMPTS = 10;
    private static final int START_PAGE = 1;
    private String genre;
    private Double minRating;
    private Integer year;
    private static final int STEP = 50;
    private Element content;
    private Elements titlesDirty;
    private List<Movie> movies;

    public ServerMoviesProcessor(HttpServletRequest request) {
        if (!request.getParameterMap().isEmpty()) {
            minRating = Double.parseDouble(request.getParameter("minRating"));
            year = Integer.parseInt(request.getParameter("year"));
            genre = request.getParameter("genre");
            System.out.println("genre:"+genre);
        } else {
            year = new Integer(ServerConstants.Defaults.MIN_YEAR +
                    new Random().nextInt(ServerConstants.Defaults.YEAR_DIFF));
            minRating = ServerConstants.Defaults.DEFAULT_MIN_RATING;
        }
        movies = new LinkedList<Movie>();
    }

    @Override
    public String toString() {
        StringBuffer moviesStringBuffer = new StringBuffer();
        for (Movie movie: movies) {
            moviesStringBuffer.append(movie).append("* * *\n");
        }
        return moviesStringBuffer.toString();
    }

    public int initIMDBContent() {
        System.out.println("* * * INIT WITH IMDB RAW DATA * * *");

        Element content = Jsoup.parseBodyFragment("").body();

        int start = START_PAGE;
        int pageCount = 1;
        int attempt = 0;
        while (true) {
            if (++attempt == MAX_ATTEMPTS) {
                // after 10 failed attempts, return error to client
                return HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
            }
            String url = String.format(IMDB_URL_FORMAT, start, year, year);
            StringBuffer msg = new StringBuffer();
            msg.append("* [").append(attempt).append("] IMDB: ").append(url);
            System.out.println(msg);
            Document html = null;
            try {
                html = Jsoup.connect(url).timeout(10*1000).get();
            } catch (SocketTimeoutException e) {
                System.out.println(" | " + e.getMessage());
                continue;
            } catch (HttpStatusException e) {
                System.out.println(" | " + e.getMessage());
                continue;
            } catch (IOException e) {
                System.out.println(" | " + e.getMessage());
                continue;
            }
            Document doc = Jsoup.parseBodyFragment(html.toString());
            Element page = Jsoup.parseBodyFragment(doc.body().toString());

            if (isMinRatingFound(page)) {
                System.out.printf("* Min rating %.1f on %d page\n", minRating, pageCount);
                content.append(page.toString());
                break;
            }
            content.append(page.toString());
            start += STEP;
            pageCount++;
            // reset attempts counter due to successfully processed page
            attempt = 0;
        }
        this.content = content;
        return HttpServletResponse.SC_OK;
    }

    public void initMovieObjects() {
        if (content != null) {
            titlesDirty = content.getElementsByClass("title");
            for (Element titleDirty : titlesDirty) {
                if (!this.genre.equalsIgnoreCase("any")) {
                    String genre = titleDirty.getElementsByClass("genre").text();
                    if (!genre.toLowerCase().contains(this.genre)) {
                        continue;
                    }
                }
                // add movie
                Movie movie = new Movie(titleDirty);
                if (movie.getDirector() == null ||
                        movie.getImdbVotesInt() < ServerConstants.Movies.MIN_REVIEWS ||
                        movie.getImdbRating() < minRating ||
                        movie.getImdbVotes() < 0) {
                    continue;
                }
                movies.add(movie);
            }
            System.out.println("* * * END OF INITIALIZATION PROCESS * * *");
        }
    }

    public void updateMoviesWithOMDBData() {
        System.out.println("* * * UPDATE WITH OMDB DATA * * *");
        Iterator<Movie> iterator = movies.iterator();
        while (iterator.hasNext()) {
            Movie movie = iterator.next();
            String url = String.format(OMDB_URL_FORMAT, movie.getId());
            System.out.println("* OMDB: " + url);
            try {
                String json = Jsoup.connect(url).ignoreContentType(true).execute().body();
                movie.updateWithOMDBData(json);
            } catch (IOException e) {
                iterator.remove();
                System.err.println("! Error processing: " + movie.getTitle() + " : " + e.getMessage());
                e.printStackTrace();
            }
        }
        System.out.println("* * * END OF UPDATE PROCESS * * *");
    }

    public String getAllMoviesAsJSON() throws UnsupportedEncodingException {
        JSONArray jsonArray = new JSONArray();
        for (Movie movie : movies) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.putAll(movie.getJson());
            jsonArray.add(jsonObject);
        }
        return jsonArray.toString();
    }

    private boolean isMinRatingFound(Element page) {
        Elements titles = page.getElementsByClass("title");
        for (Element title : titles) {
//            System.out.println("*******************************\n"+title);
            if (title.getElementsByClass("value").size() > 0) {
//                System.out.println("value="+title.getElementsByClass("value"));
                Double rating = Double.parseDouble(title.getElementsByClass("value").get(0).text());
                if (rating < minRating) {
                    return true;
                }
            }
        }
        return false;
    }
}