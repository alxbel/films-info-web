package com.github.blackenwhite.movseeker.server;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.jsoup.nodes.Element;

import java.lang.reflect.Field;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created on 08.10.2015.
 */
public class Movie implements Comparable {
    public static final String NOT_AVAILABLE = "N/A";

    private String title;
    private String director;
    private String release;
    private String runtime;
    private String genre;
    private String actors;
    private String country;
    private String plot;
    private String awards;

    private String id;
    private Double imdbRating;
    private String imdbUrl;
    private Integer imdbVotes;

    private Integer tomatoMeter;
    private Double tomatoRating;
    private Integer tomatoReviews;
    private Integer tomatoUserMeter;
    private Double tomatoUserRating;
    private Integer tomatoUserReviews;

    private Integer metascore;

    public Movie(){}

    // init from raw html
    public Movie(Element htmlContent) {
        Element title = htmlContent.getElementsByAttributeValueMatching("href", "^/title/(.*)/$").get(0);
        setTitle(title.text());

        Integer votes = -1;
        if (htmlContent.getElementsByClass("rating").size() > 0) {
            Element votesDirty = htmlContent.getElementsByClass("rating").get(0);
            Pattern votesPattern = Pattern.compile("\\((.*).*?votes\\)");
            Matcher votesMatcher = votesPattern.matcher(votesDirty.toString());
            if (votesMatcher.find()) {
                String votesString = votesMatcher.group(1).toString().replaceAll(",", "").trim();
                votes = Integer.parseInt(votesString);
            }
        }
        setImdbVotes(votes);

        // set director
        String director = null;
        if (htmlContent.getElementsByAttributeValueMatching("href", "^/name/(.*)/$").size() > 0) {
            director = htmlContent.getElementsByAttributeValueMatching("href", "^/name/(.*)/$").get(0).text();
        }
        setDirector(director);

        // set imdb id
        String id = null;
        Pattern p = Pattern.compile(".*/title/(.*?)/");
        Matcher m = p.matcher(title.toString());
        if (m.find()) {
            id = m.group(1);
        }
        setId(id);

        // set imdb rating
        Double rating = -1.0;
        if (htmlContent.getElementsByClass("value").size() > 0) {
            rating = Double.parseDouble(htmlContent.getElementsByClass("value").get(0).text());
        }
        setImdbRating(rating);
        setImdbUrl();
    }

    // init from json
    public Movie(JSONObject jsonObject) {
        for (Iterator iterator = jsonObject.entrySet().iterator(); iterator.hasNext();) {
            Map.Entry entry = (Map.Entry) iterator.next();
            String fieldName = entry.getKey().toString();
            String fieldValueToSet = entry.getValue().toString();
            Field field = null;
            try {
                field = this.getClass().getDeclaredField(fieldName);
                if (field.getType() == Double.class) {
                    field.set(this, Double.parseDouble(fieldValueToSet));
                } else if (field.getType() == String.class) {
                    field.set(this, fieldValueToSet);
                } else if (field.getType() == Integer.class) {
                    field.set(this, Integer.parseInt(fieldValueToSet));
                }
            } catch (NoSuchFieldException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public String toString() {
        return String.format(
                "- - -\n" +
                "Title: %s\nDirector: %s\n" +
                "Rating: %.1f\nVotes: %d\n" +
                        "URL: %s\nid: %s\n" +
                        "- - -\n",
                getTitle(), getDirector(),
                getImdbRating(), getImdbVotesInt(),
                getImdbUrlString(), getId());
    }

    @Override
    public int compareTo(Object o) {
        Movie other = (Movie) o;
        return Integer.compare(this.getImdbVotesInt(), other.getImdbVotesInt());
    }

    // get object as json
    public HashMap<String, String> getJson() {
        HashMap<String, String> jsonMap = new HashMap<String, String>();
        ArrayList<Field> fieldList = new ArrayList<Field>();
        fieldList.addAll(Arrays.asList(this.getClass().getDeclaredFields()));
        for (Field field : fieldList) {
            field.setAccessible(true);
            try {
                Object value = field.get(this);
                if (value != null && !field.getName().equals("NOT_AVAILABLE")) {
                    jsonMap.put(field.getName(), value.toString());
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return jsonMap;
    }

    public void updateWithOMDBData(String json) {
        JSONParser parser = new JSONParser();
        try {
            Object rawJsonArray = parser.parse(json.toString().trim());
            JSONArray jsonArray = new JSONArray();
            jsonArray.add(rawJsonArray);
//
            for (Object object : jsonArray) {
                JSONObject jsonObject = (JSONObject) object;
                setTitle            (jsonObject.get("Title")            .toString());
                setTomatoMeter      (jsonObject.get("tomatoMeter")      .toString());
                setTomatoRating     (jsonObject.get("tomatoRating")     .toString());
                setTomatoReviews    (jsonObject.get("tomatoReviews")    .toString());
                setTomatoUserMeter  (jsonObject.get("tomatoUserMeter")  .toString());
                setTomatoUserRating (jsonObject.get("tomatoUserRating") .toString());
                setTomatoUserReviews(jsonObject.get("tomatoUserReviews").toString());

                setMetascore        (jsonObject.get("Metascore")        .toString());
                setRelease          (jsonObject.get("Released")         .toString());
                setRuntime          (jsonObject.get("Runtime")          .toString());
                setGenre            (jsonObject.get("Genre")            .toString());
                setActors           (jsonObject.get("Actors")           .toString());
                String plot = jsonObject.get("Plot").toString().replaceAll("\"", "+");
                setPlot             (plot             .toString());
                setCountry          (jsonObject.get("Country").toString());
                setAwards           (jsonObject.get("Awards")           .toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        if (director != null) {
            this.director = director;
        } else {
            this.director = "NOT FOUND";
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        if (id != null) {
            this.id = id;
        } else {
            this.id = "NOT FOUND";
        }
    }

    public String getImdbUrlString() {
        return imdbUrl;
    }

    public Double getImdbRating() {
        return imdbRating;
    }

    public void setImdbRating(Double imdbRating) {
        this.imdbRating = imdbRating;
    }

    public Integer getImdbVotes() {
        return imdbVotes;
    }

    public Integer getImdbVotesInt() {
        return imdbVotes;
    }

    public void setImdbVotes(Integer imdbVotes) {
        this.imdbVotes = imdbVotes;
    }

    public URL getImdbUrl() {
        try {
            URL url = new URL(getImdbUrlString());
            return url;
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void setImdbUrl() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("http://www.imdb.com/title/").append(getId()).append("/");
        imdbUrl = buffer.toString();
    }

    public Integer getTomatoMeter() {
        return tomatoMeter;
    }

    public void setTomatoMeter(String tomatoMeter) {
        if (!tomatoMeter.equals(NOT_AVAILABLE)) {
            this.tomatoMeter = Integer.parseInt(tomatoMeter);
        } else {
            this.tomatoMeter = 0;
        }
    }

    public Double getTomatoRating() {
        return tomatoRating;
    }

    public void setTomatoRating(String tomatoRating) {
        if (!tomatoRating.equals(NOT_AVAILABLE)) {
            this.tomatoRating = Double.parseDouble(tomatoRating);
        } else {
            this.tomatoRating = 0.0;
        }
    }

    public Integer getTomatoReviews() {
        return tomatoReviews;
    }

    public void setTomatoReviews(String tomatoReviews) {
        if (!tomatoReviews.equals(NOT_AVAILABLE)) {
            this.tomatoReviews = Integer.parseInt(tomatoReviews);
        } else {
            this.tomatoReviews = 0;
        }
    }

    public Integer getTomatoUserMeter() {
        return tomatoUserMeter;
    }

    public void setTomatoUserMeter(String tomatoUserMeter) {
        if (!tomatoUserMeter.equals(NOT_AVAILABLE)) {
            this.tomatoUserMeter = Integer.parseInt(tomatoUserMeter);
        } else {
            this.tomatoUserMeter = 0;
        }
    }

    public Double getTomatoUserRating() {
        return tomatoUserRating;
    }

    public void setTomatoUserRating(String tomatoUserRating) {
        if (!tomatoUserRating.equals(NOT_AVAILABLE)) {
            this.tomatoUserRating = Double.parseDouble(tomatoUserRating);
        } else {
            this.tomatoUserRating = 0.0;
        }
    }

    public Integer getTomatoUserReviews() {
        return tomatoUserReviews;
    }

    public void setTomatoUserReviews(String tomatoUserReviews) {
        if (!tomatoUserReviews.equals(NOT_AVAILABLE)) {
            this.tomatoUserReviews = Integer.parseInt(tomatoUserReviews);
        } else {
            this.tomatoUserReviews = 0;
        }
    }

    public Integer getMetascore() {
        return metascore;
    }

    public void setMetascore(String metascore) {
        if (!metascore.equals(NOT_AVAILABLE)) {
            this.metascore = Integer.parseInt(metascore);
        } else {
            this.metascore = 0;
        }
    }

    public String getRuntime() {
        return runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public String getRelease() {
        return release;
    }

    public void setRelease(String release) {
        this.release = release;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPlot() {
        return plot;
    }

    public void setPlot(String plot) {
        this.plot = plot;
    }

    public String getAwards() {
        return awards;
    }

    public void setAwards(String awards) {
        this.awards = awards;
    }

    public String getActors() {
        return actors;
    }

    public void setActors(String actors) {
        this.actors = actors;
    }
}
