package com.github.blackenwhite.movseeker.server;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class SimpleServlet extends HttpServlet {
    private ServerMoviesProcessor serverMoviesProcessor;
    private int status;

    @Override
    public void doPost(HttpServletRequest request,
                       HttpServletResponse response)
            throws ServletException, IOException {


        response.setContentType("application/json");
        System.out.printf("### genre=%s year=%s rating=%s ###\n",
                request.getParameter("genre"),
                request.getParameter("year"),
                request.getParameter("minRating"));

        PrintWriter out = new PrintWriter(
                new OutputStreamWriter(response.getOutputStream(), "UTF-8"), true);


        if (request.getServletPath().equals("/debug")) {
            String jsonString = " [{\"country\":\"USA, UK\",\"tomatoUserRating\":\"4.4\",\"director\":\"Christopher Nolan\",\"release\":\"18 Jul 2008\",\"tomatoUserMeter\":\"94\",\"tomatoMeter\":\"94\",\"tomatoUserReviews\":\"1818886\",\"runtime\":\"152 min\",\"imdbRating\":\"9.0\",\"title\":\"The Dark Knight\",\"imdbVotes\":\"1519197\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt0468569\\/\",\"actors\":\"Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine\",\"plot\":\"When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.\",\"tomatoRating\":\"8.6\",\"awards\":\"Won 2 Oscars. Another 128 wins & 120 nominations.\",\"tomatoReviews\":\"314\",\"genre\":\"Action, Crime, Drama\",\"id\":\"tt0468569\",\"metascore\":\"82\"},{\"country\":\"USA\",\"tomatoUserRating\":\"4.2\",\"director\":\"Andrew Stanton\",\"release\":\"27 Jun 2008\",\"tomatoUserMeter\":\"89\",\"tomatoMeter\":\"96\",\"tomatoUserReviews\":\"592817\",\"runtime\":\"98 min\",\"imdbRating\":\"8.4\",\"title\":\"WALL·E\",\"imdbVotes\":\"642047\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt0910970\\/\",\"actors\":\"Ben Burtt, Elissa Knight, Jeff Garlin, Fred Willard\",\"plot\":\"In the distant future, a small waste collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.\",\"tomatoRating\":\"8.5\",\"awards\":\"Won 1 Oscar. Another 84 wins & 65 nominations.\",\"tomatoReviews\":\"244\",\"genre\":\"Animation, Adventure, Family\",\"id\":\"tt0910970\",\"metascore\":\"94\"},{\"country\":\"USA, Germany\",\"tomatoUserRating\":\"4.1\",\"director\":\"Clint Eastwood\",\"release\":\"09 Jan 2009\",\"tomatoUserMeter\":\"90\",\"tomatoMeter\":\"79\",\"tomatoUserReviews\":\"329992\",\"runtime\":\"116 min\",\"imdbRating\":\"8.2\",\"title\":\"Gran Torino\",\"imdbVotes\":\"516689\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt1205489\\/\",\"actors\":\"Clint Eastwood, Christopher Carley, Bee Vang, Ahney Her\",\"plot\":\"Disgruntled Korean War veteran Walt Kowalski sets out to reform his neighbor, a Hmong teenager who tried to steal Kowalski's prized possession: a 1972 Gran Torino.\",\"tomatoRating\":\"7.1\",\"awards\":\"Nominated for 1 Golden Globe. Another 22 wins & 10 nominations.\",\"tomatoReviews\":\"224\",\"genre\":\"Drama\",\"id\":\"tt1205489\",\"metascore\":\"72\"},{\"country\":\"Japan\",\"tomatoUserRating\":\"4.2\",\"director\":\"Shion Sono\",\"release\":\"31 Jan 2009\",\"tomatoUserMeter\":\"88\",\"tomatoMeter\":\"90\",\"tomatoUserReviews\":\"2337\",\"runtime\":\"237 min\",\"imdbRating\":\"8.1\",\"title\":\"Love Exposure\",\"imdbVotes\":\"6467\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt1128075\\/\",\"actors\":\"Takahiro Nishijima, Hikari Mitsushima, Sakura Andô, Yutaka Shimizu\",\"plot\":\"A bizarre love triangle forms between a young Catholic upskirt photographer, a misandric girl and a manipulative cultist.\",\"tomatoRating\":\"7.7\",\"awards\":\"17 wins & 2 nominations.\",\"tomatoReviews\":\"21\",\"genre\":\"Action, Comedy, Drama\",\"id\":\"tt1128075\",\"metascore\":\"75\"},{\"country\":\"Japan\",\"tomatoUserRating\":\"4.0\",\"director\":\"Yôjirô Takita\",\"release\":\"19 Jun 2009\",\"tomatoUserMeter\":\"92\",\"tomatoMeter\":\"81\",\"tomatoUserReviews\":\"51624\",\"runtime\":\"130 min\",\"imdbRating\":\"8.1\",\"title\":\"Departures\",\"imdbVotes\":\"36320\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt1069238\\/\",\"actors\":\"Masahiro Motoki, Tsutomu Yamazaki, Ryôko Hirosue, Kazuko Yoshiyuki\",\"plot\":\"A newly unemployed cellist takes a job preparing the dead for funerals.\",\"tomatoRating\":\"7.1\",\"awards\":\"Won 1 Oscar. Another 33 wins & 7 nominations.\",\"tomatoReviews\":\"103\",\"genre\":\"Drama, Music\",\"id\":\"tt1069238\",\"metascore\":\"68\"},{\"country\":\"Bulgaria, Germany, Slovenia, Hungary\",\"tomatoUserRating\":\"4.0\",\"director\":\"Stephan Komandarev\",\"release\":\"10 Oct 2008\",\"tomatoUserMeter\":\"83\",\"tomatoMeter\":\"0\",\"tomatoUserReviews\":\"467\",\"runtime\":\"105 min\",\"imdbRating\":\"8.1\",\"title\":\"The World is Big and Salvation Lurks Around the Corner\",\"imdbVotes\":\"4573\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt1178197\\/\",\"actors\":\"Predrag Manojlovic, Carlo Ljubek, Hristo Mutafchiev, Ana Papadopulu\",\"plot\":\"The story of Alex, who, with the help of his charismatic grandfather, Bai Dan, embarks on a journey in search of his real self.\",\"tomatoRating\":\"0.0\",\"awards\":\"9 wins & 4 nominations.\",\"tomatoReviews\":\"0\",\"genre\":\"Drama\",\"id\":\"tt1178197\",\"metascore\":\"0\"},{\"country\":\"Hong Kong, China\",\"tomatoUserRating\":\"4.2\",\"director\":\"Wilson Yip\",\"release\":\"12 Dec 2008\",\"tomatoUserMeter\":\"93\",\"tomatoMeter\":\"84\",\"tomatoUserReviews\":\"26193\",\"runtime\":\"106 min\",\"imdbRating\":\"8.1\",\"title\":\"Ip Man\",\"imdbVotes\":\"144052\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt1220719\\/\",\"actors\":\"Donnie Yen, Simon Yam, Ka Tung Lam, Siu-Wong Fan\",\"plot\":\"A semi-biographical account of Yip Man, the successful martial arts master who taught the Chinese martial art of Wing Chun to the world.\",\"tomatoRating\":\"6.5\",\"awards\":\"14 wins & 10 nominations.\",\"tomatoReviews\":\"25\",\"genre\":\"Action, Biography, Drama\",\"id\":\"tt1220719\",\"metascore\":\"59\"},{\"country\":\"Japan, USA\",\"tomatoUserRating\":\"4.1\",\"director\":\"Mamoru Oshii\",\"release\":\"12 Jul 2008\",\"tomatoUserMeter\":\"81\",\"tomatoMeter\":\"100\",\"tomatoUserReviews\":\"918\",\"runtime\":\"85 min\",\"imdbRating\":\"8.0\",\"title\":\"Ghost in the Shell 2.0\",\"imdbVotes\":\"8633\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt1260502\\/\",\"actors\":\"Atsuko Tanaka, Akio Ôtsuka, Kôichi Yamadera, Tesshô Genda\",\"plot\":\"A hacker known as the Puppet Master is hunted by a female cyborg cop and her partner. This film is a revised version of Ghost in the Shell (1995).\",\"tomatoRating\":\"6.8\",\"awards\":\"N\\/A\",\"tomatoReviews\":\"7\",\"genre\":\"Animation, Action, Crime\",\"id\":\"tt1260502\",\"metascore\":\"0\"},{\"country\":\"UK, USA\",\"tomatoUserRating\":\"4.0\",\"director\":\"Danny Boyle\",\"release\":\"25 Dec 2008\",\"tomatoUserMeter\":\"90\",\"tomatoMeter\":\"92\",\"tomatoUserReviews\":\"1153303\",\"runtime\":\"120 min\",\"imdbRating\":\"8.0\",\"title\":\"Slumdog Millionaire\",\"imdbVotes\":\"596160\",\"imdbUrl\":\"http:\\/\\/www.imdb.com\\/title\\/tt1010048\\/\",\"actors\":\"Dev Patel, Saurabh Shukla, Anil Kapoor, Rajendranath Zutshi\",\"plot\":\"A Mumbai teen, who grew up in the slums, becomes a contestant on the Indian version of +Who Wants To Be A Millionaire?+ He is arrested under suspicion of cheating, and while being interrogated, events from his life history are shown which explain why he knows the answers.\",\"tomatoRating\":\"8.4\",\"awards\":\"Won 8 Oscars. Another 153 wins & 91 nominations.\",\"tomatoReviews\":\"265\",\"genre\":\"Drama, Romance\",\"id\":\"tt1010048\",\"metascore\":\"86\"}]\n";
            out.print(jsonString);
            out.close();
            return;
        } else if (request.getServletPath().equals("/error")){
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        } else if (request.getServletPath().equals("/search")) {
            try {
                serverMoviesProcessor = new ServerMoviesProcessor(request);
                status = serverMoviesProcessor.initIMDBContent();

                if (status != HttpServletResponse.SC_OK) {
                    response.sendError(status);
                    return;
                }
                serverMoviesProcessor.initMovieObjects();
                serverMoviesProcessor.updateMoviesWithOMDBData();
                String jsonString = serverMoviesProcessor.getAllMoviesAsJSON();
                out.print(jsonString);
                out.flush();
                out.close();
            } catch (IOException e) {
                status = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
            }
        }

//        ServerMoviesProcessor serverMoviesProcessor = new ServerMoviesProcessor(request);
////        int status;
//        if (request.getServletPath().equals("/error")) {
//            status = 500;
//        } else {
//            status = serverMoviesProcessor.initIMDBContent();
//        }
//
//        if (status != HttpServletResponse.SC_OK) {
//            response.sendError(status);
//            return;
//        }
//        serverMoviesProcessor.initMovieObjects();
//        serverMoviesProcessor.updateMoviesWithOMDBData();
//        String jsonString = serverMoviesProcessor.getAllMoviesAsJSON();
//        System.out.println("jsonString:\n "+jsonString);
//        out.print(jsonString);
//
//        out.flush();
//        out.close();
    }

    @Override
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException {

        PrintWriter out = response.getWriter();
        out.println("result");
        out.flush();
        out.close();
    }
}
